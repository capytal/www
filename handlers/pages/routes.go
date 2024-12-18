package pages

import (
	"log/slog"
	"net/http"

	"forge.capytal.company/capytal/www/libs/blog"
	"forge.capytal.company/capytalcode/project-comicverse/lib/router"
	"forge.capytal.company/capytalcode/project-comicverse/lib/router/rerrors"
)

func Routes(log *slog.Logger) router.Router {
	r := router.NewRouter()

	r.Use(rerrors.NewErrorMiddleware(ErrorPage{}.Component, log))

	r.Handle("/", &IndexPage{})
	r.Handle("/about", &AboutPage{})

	b := blog.NewGiteaBlog("dot013", "blog", "https://forge.capytal.company/api/v1")

	r.Handle("/blog/{path...}", http.StripPrefix("/blog/", b))

	return r
}
