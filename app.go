package main

import (
	"errors"
	"fmt"
	"html/template"
	"io"
	"io/fs"
	"log/slog"
	"net/http"
	"regexp"
	"slices"
	"sort"
	"strings"

	"capytal.cc/assets"
	"capytal.cc/internals/natsort"
	"capytal.cc/templates"
	"capytal.cc/tinyssert"
	"forge.capytal.company/loreddev/blogo"
	"forge.capytal.company/loreddev/blogo/plugin"
	"forge.capytal.company/loreddev/blogo/plugins"
	"forge.capytal.company/loreddev/blogo/plugins/gitea"
	"forge.capytal.company/loreddev/blogo/plugins/markdown"
	"forge.capytal.company/loreddev/x/smalltrip"
	"forge.capytal.company/loreddev/x/smalltrip/exception"
	"forge.capytal.company/loreddev/x/smalltrip/middleware"
)

func NewApp(opts ...Option) (http.Handler, error) {
	app := &app{
		assets:    assets.Files(),
		templates: templates.Templates(),

		cache:  true,
		log:    slog.New(slog.DiscardHandler),
		assert: tinyssert.NewDisabledAssertions(),
	}

	for _, opt := range opts {
		opt(app)
	}

	app.setup()

	return app, nil
}

type Option func(a *app)

func WithAssets(assets fs.FS) Option {
	return func(a *app) { a.assets = assets }
}

func WithTemplates(t templates.ITemplate) Option {
	return func(a *app) { a.templates = t }
}

func WithCacheDisabled() Option {
	return func(a *app) { a.cache = false }
}

func WithLogger(logger *slog.Logger) Option {
	return func(a *app) { a.log = logger }
}

func WithAssertions(assertions tinyssert.Assertions) Option {
	return func(a *app) { a.assert = assertions }
}

type app struct {
	router http.Handler

	assets    fs.FS
	templates templates.ITemplate

	cache  bool
	log    *slog.Logger
	assert tinyssert.Assertions
}

func (app *app) setup() {
	app.assert.NotNil(app.log)

	router := smalltrip.NewRouter(
		smalltrip.WithAssertions(app.assert),
		smalltrip.WithLogger(app.log.WithGroup("smalltrip")),
	)

	router.Use(middleware.Logger(app.log.WithGroup("requests")))

	if app.cache {
		router.Use(middleware.Cache())
	} else {
		router.Use(middleware.DisableCache())
	}

	router.Handle("/assets/", http.StripPrefix("/assets/", http.FileServerFS(app.assets)))

	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Query().Get("lang") == "" {
			langRedirect(w, r)
		}

		err := app.templates.ExecuteTemplate(w, "homepage", map[string]any{
			"Lang": r.URL.Query().Get("lang"),
		})
		if err != nil {
			exception.InternalServerError(err).ServeHTTP(w, r)
			return
		}
	})
	router.HandleFunc("/README.md/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Query().Get("lang") == "" {
			langRedirect(w, r)
		}

		err := app.templates.ExecuteTemplate(w, "readme", map[string]any{
			"Lang": r.URL.Query().Get("lang"),
		})
		if err != nil {
			exception.InternalServerError(err).ServeHTTP(w, r)
			return
		}
	})
	router.HandleFunc("/PRIVACY.md/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Query().Get("lang") == "" {
			langRedirect(w, r)
		}

		err := app.templates.ExecuteTemplate(w, "privacy-policy", map[string]any{
			"Lang": r.URL.Query().Get("lang"),
		})
		if err != nil {
			exception.InternalServerError(err).ServeHTTP(w, r)
			return
		}
	})

	blogEN := app.blogEN()
	blogPT := app.blogPT()
	router.Handle("/blog/", http.StripPrefix("/blog/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Query().Get("lang") == "" {
			langRedirect(w, r)
		}

		switch r.URL.Query().Get("lang") {
		case "pt":
			blogPT.ServeHTTP(w, r)
		default:
			blogEN.ServeHTTP(w, r)
		}
	})))

	app.router = router
}

func langRedirect(w http.ResponseWriter, r *http.Request) {
	acceptedLang := r.Header.Get("Accept-Language")
	if strings.Contains(acceptedLang, "pt") {
		http.Redirect(w, r, fmt.Sprintf("%s?lang=pt", r.URL.Path), http.StatusSeeOther)
	}
}

func (app *app) blogEN() blogo.Blogo {
	blog := blogo.New(blogo.Opts{
		Assertions: app.assert,
		Logger:     app.log.WithGroup("blogo"),
	})

	gitea := gitea.New("capytal", "capytal.cc-blog", "https://forge.capytal.company")
	blog.Use(gitea)

	blog.Use(&listRenderer{app.templates, "en"})

	rf := plugins.NewFoldingRenderer(plugins.FoldingRendererOpts{
		Assertions: app.assert,
		Logger:     app.log.WithGroup("folding-renderer"),
	})

	rf.Use(markdown.New())
	rf.Use(&blogPostRenderer{app.templates, "en"})

	blog.Use(rf)
	blog.Use(plugins.NewPlainText())

	return blog
}

func (app *app) blogPT() blogo.Blogo {
	blog := blogo.New(blogo.Opts{
		Assertions: app.assert,
		Logger:     app.log.WithGroup("blogo-pt"),
	})

	gitea := gitea.New("capytal", "capytal.cc-blog", "https://forge.capytal.company", gitea.Opts{
		Ref: "main-pt",
	})
	blog.Use(gitea)

	blog.Use(&listRenderer{app.templates, "pt"})

	rf := plugins.NewFoldingRenderer(plugins.FoldingRendererOpts{
		Assertions: app.assert,
		Logger:     app.log.WithGroup("folding-renderer"),
	})

	rf.Use(markdown.New())
	rf.Use(&blogPostRenderer{app.templates, "pt"})

	blog.Use(rf)
	blog.Use(plugins.NewPlainText())

	return blog
}

func (app *app) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	app.assert.NotNil(w)
	app.assert.NotNil(r)
	app.assert.NotNil(app.router)

	app.router.ServeHTTP(w, r)
}

type blogPostRenderer struct {
	templates templates.ITemplate
	lang      string
}

var _ plugin.Renderer = (*blogPostRenderer)(nil)

func (r *blogPostRenderer) Name() string {
	return "capytal-blogpostrenderer-renderer"
}

var re = regexp.MustCompile(`<h1>(.*?)</h1>`)

func (r *blogPostRenderer) Render(src fs.File, w io.Writer) error {
	c, err := io.ReadAll(src)
	if err != nil {
		return err
	}

	m := re.FindStringSubmatch(string(c))

	title := "Blog"
	if len(m) > 1 {
		t := strings.TrimSuffix(strings.TrimPrefix(m[0], "<h1>"), "</h1>")
		title = fmt.Sprintf("%s - Capytal's Blog", t)
	}

	return r.templates.ExecuteTemplate(w, "blog-post", map[string]any{
		"Title":   title,
		"Lang":    r.lang,
		"Content": template.HTML(string(c)),
	})
}

type listRenderer struct {
	templates templates.ITemplate
	lang      string
}

var _ plugin.Renderer = (*listRenderer)(nil)

func (r *listRenderer) Name() string {
	return "capytal-list-renderer"
}

func (r *listRenderer) Render(src fs.File, w io.Writer) error {
	d, ok := src.(fs.ReadDirFile)
	if !ok {
		return errors.New("renderer does not support single files")
	}

	entries, err := d.ReadDir(-1)
	if err != nil && !errors.Is(err, io.EOF) {
		return err
	}

	sort.Slice(entries, func(i, j int) bool {
		return natsort.Compare(entries[i].Name(), entries[j].Name())
	})

	links := map[string]string{}
	for _, e := range entries {
		n := e.Name()
		if strings.HasPrefix(n, ".") ||
			e.IsDir() ||
			slices.Contains([]string{
				"LICENSE",
				"README.md",
			}, n) {
			continue
		}
		links[n] = r.lang
	}

	return r.templates.ExecuteTemplate(w, "blog", links)
}
