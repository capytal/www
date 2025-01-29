package pages

import (
	"context"
	"errors"
	"io"
	"io/fs"
	"log/slog"
	"net/http"

	"forge.capytal.company/loreddev/blogo"
	"forge.capytal.company/loreddev/blogo/plugins"
	"forge.capytal.company/loreddev/blogo/plugins/gitea"
	"forge.capytal.company/loreddev/blogo/plugins/markdown"
	"forge.capytal.company/loreddev/x/groute/router"
	"forge.capytal.company/loreddev/x/groute/router/rerrors"
	"forge.capytal.company/loreddev/x/tinyssert"
)

var assert = tinyssert.NewAssertions()

func Routes(log *slog.Logger) router.Router {
	r := router.NewRouter()

	r.Use(rerrors.NewErrorMiddleware(ErrorPage{}.Component, log))

	r.Handle("/", &IndexPage{})
	r.Handle("/about", &AboutPage{})

	// b, err := NewBlog("dot013", "blog", "https://forge.capytal.company/api/v1")
	// if err != nil {
	// 	panic(err)
	// }

	blog := blogo.New(blogo.Opts{
		Assertions: assert,
		Logger:     log.WithGroup("blogo"),
	})

	gitea := gitea.New("dot013", "blog", "https://forge.capytal.company", gitea.Opts{
		// Ref: "2025-redesign",
	})
	blog.Use(gitea)

	blog.Use(&listTemplater{})

	rf := plugins.NewFoldingRenderer(plugins.FoldingRendererOpts{
		Assertions: assert,
		Logger:     log.WithGroup("folding-renderer"),
	})

	markdown := markdown.New()
	rf.Use(markdown)
	rf.Use(&templater{})

	blog.Use(rf)

	plaintext := plugins.NewPlainText(plugins.PlainTextOpts{
		Assertions: assert,
	})
	blog.Use(plaintext)

	r.Handle("/blog", http.StripPrefix("/blog/", blog))

	return r
}

type templater struct{}

func (t *templater) Name() string {
	return "capytal-templater-renderer"
}

func (t *templater) Render(src fs.File, w io.Writer) error {
	c, err := io.ReadAll(src)
	if err != nil {
		return err
	}

	err = blogEntry(string(c)).Render(context.Background(), w)
	if err != nil {
		return err
	}

	return nil
}

type listTemplater struct{}

func (t *listTemplater) Name() string {
	return "capytal-listtemplater-renderer"
}

func (t *listTemplater) Render(src fs.File, w io.Writer) error {
	if d, ok := src.(fs.ReadDirFile); ok {
		entries, err := d.ReadDir(-1)
		if err != nil && !errors.Is(err, io.EOF) {
			return err
		}

		return blogList(entries).Render(context.Background(), w)
	}
	return errors.New("templater does not support single files")
}
