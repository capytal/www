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
	"time"

	"capytal.cc/assets"
	"capytal.cc/internals/natsort"
	"capytal.cc/templates"
	"capytal.cc/tinyssert"
	"forge.capytal.company/loreddev/blogo"
	"forge.capytal.company/loreddev/blogo/plugin"
	"forge.capytal.company/loreddev/blogo/plugins"
	"forge.capytal.company/loreddev/blogo/plugins/gitea"
	"forge.capytal.company/loreddev/x/smalltrip"
	"forge.capytal.company/loreddev/x/smalltrip/exception"
	"forge.capytal.company/loreddev/x/smalltrip/middleware"
	chromahtml "github.com/alecthomas/chroma/v2/formatters/html"
	links "github.com/fundipper/goldmark-links"
	"github.com/goodsign/monday"
	"github.com/yuin/goldmark"
	highlighting "github.com/yuin/goldmark-highlighting/v2"
	meta "github.com/yuin/goldmark-meta"
	"github.com/yuin/goldmark/ast"
	"github.com/yuin/goldmark/extension"
	"github.com/yuin/goldmark/parser"
	"github.com/yuin/goldmark/renderer"
	"github.com/yuin/goldmark/text"
	callout "gitlab.com/staticnoise/goldmark-callout"
	"go.abhg.dev/goldmark/anchor"
)

var md = goldmark.New(
	goldmark.WithParserOptions(
		parser.WithAutoHeadingID(),
	),
	goldmark.WithExtensions(
		extension.Footnote,
		extension.GFM,
		extension.DefinitionList,
		extension.Typographer,
		highlighting.NewHighlighting(
			highlighting.WithStyle("monokai"),
			highlighting.WithFormatOptions(
				chromahtml.WithLineNumbers(true),
			),
		),
		meta.New(meta.WithStoresInDocument()),
		&anchor.Extender{},
		links.NewExtender(
			map[string]bool{
				"capytal.cc":            true,
				"capytal.company":       true,
				"forge.capytal.company": true,
				"lored.dev":             true,
			},
			map[string]string{
				"rel":    "nofollow noopener noreferrer",
				"target": "_blank",
			},
		),
		callout.CalloutExtention,
	),
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
		if r.URL.Path != "/" {
			http.Redirect(w, r, "/", http.StatusSeeOther)
		}
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
	router.HandleFunc("/about/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Query().Get("lang") == "" {
			langRedirect(w, r)
		}

		err := app.templates.ExecuteTemplate(w, "about", map[string]any{
			"Lang": r.URL.Query().Get("lang"),
		})
		if err != nil {
			exception.InternalServerError(err).ServeHTTP(w, r)
			return
		}
	})
	router.HandleFunc("/privacy/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Query().Get("lang") == "" {
			langRedirect(w, r)
		}

		lang := ""
		if l := r.URL.Query().Get("lang"); l != "" && !strings.Contains(l, "en") {
			lang = fmt.Sprintf("_%s", l)
		}

		res, err := http.Get(fmt.Sprintf("https://forge.capytal.company/api/v1/repos/capytal/privacy-policy/raw/PRIVACY_POLICY%s.md", lang))
		if err != nil {
			exception.InternalServerError(err).ServeHTTP(w, r)
			return
		}

		c, err := io.ReadAll(res.Body)
		if err != nil {
			exception.InternalServerError(err).ServeHTTP(w, r)
			return
		}

		doc := md.Parser().Parse(text.NewReader(c))
		meta := doc.OwnerDocument().Meta()

		title := "Privacy Policy"
		if t, ok := meta["title"]; ok {
			tt, ok := t.(string)
			if ok {
				title = tt
			}
		}

		changeDate, err := time.Parse(time.DateOnly, "2025-04-11")
		app.assert.Nil(err, "This date should always be valid")

		if d, ok := meta["modified"]; ok {
			if s, ok := d.(string); ok {
				t, err := time.Parse(time.RFC3339, s)
				if err != nil {
					exception.InternalServerError(err).ServeHTTP(w, r)
					return
				}
				changeDate = t
			}
		}

		f := new(strings.Builder)
		err = md.Renderer().Render(f, c, doc)
		if err != nil {
			exception.InternalServerError(err).ServeHTTP(w, r)
			return
		}

		locale := r.URL.Query().Get("lang")
		if locale == "" {
			locale = "en-US"
		}
		locale = strings.Replace(locale, "-", "_", 1)

		format, ok := monday.LongFormatsByLocale[monday.Locale(locale)]
		if !ok {
			format = time.DateTime
		}

		err = app.templates.ExecuteTemplate(w, "privacy-policy", map[string]any{
			"Title":      title,
			"Lang":       r.URL.Query().Get("lang"),
			"Content":    template.HTML(f.String()),
			"ChangeDate": monday.Format(changeDate, format, monday.Locale(locale)),
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
		case "pt-BR":
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
		http.Redirect(w, r, fmt.Sprintf("%s?lang=pt-BR", r.URL.Path), http.StatusSeeOther)
	}
}

func (app *app) blogEN() blogo.Blogo {
	blog := blogo.New(blogo.Opts{
		Assertions: app.assert,
		Logger:     app.log.WithGroup("blogo"),
	})

	gitea := gitea.New("capytal", "capytal.cc-blog", "https://forge.capytal.company")
	blog.Use(gitea)

	blog.Use(&listRenderer{app.templates, "en-US"})
	blog.Use(NewBlogPostRenderer(app.templates, "en-US"))
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

	blog.Use(&listRenderer{app.templates, "pt-BR"})
	blog.Use(NewBlogPostRenderer(app.templates, "pt-BR"))
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

	parser   parser.Parser
	renderer renderer.Renderer
}

var _ plugin.Renderer = (*blogPostRenderer)(nil)

func NewBlogPostRenderer(templates templates.ITemplate, lang string) *blogPostRenderer {
	return &blogPostRenderer{
		templates: templates,
		lang:      lang,
		parser:    md.Parser(),
		renderer:  md.Renderer(),
	}
}

func (r *blogPostRenderer) Name() string {
	return "capytal-blogpostrenderer-renderer"
}

var re = regexp.MustCompile(`<h1>(.*?)</h1>`)

func (r *blogPostRenderer) Render(src fs.File, w io.Writer) error {
	c, err := io.ReadAll(src)
	if err != nil {
		return err
	}

	doc := r.parser.Parse(text.NewReader(c))
	meta := doc.OwnerDocument().Meta()

	title := "Blog"
	if t, ok := meta["title"]; ok {
		tt, ok := t.(string)
		if ok {
			title = tt
		}
	} else {
		err := ast.Walk(doc, func(n ast.Node, entering bool) (ast.WalkStatus, error) {
			if n.Kind().String() != "Heading" {
				return ast.WalkContinue, nil
			}

			if h, ok := n.(*ast.Heading); !ok || h.Level > 1 {
				return ast.WalkContinue, nil
			}

			// TODO: This is deprecated
			title = string(n.Text(c))
			return ast.WalkStop, nil
		})
		if err != nil {
			return err
		}
	}

	f := new(strings.Builder)
	err = r.renderer.Render(f, c, doc)
	if err != nil {
		return err
	}

	return r.templates.ExecuteTemplate(w, "blog-post", map[string]any{
		"Title":   title,
		"Lang":    r.lang,
		"Content": template.HTML(f.String()),
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
