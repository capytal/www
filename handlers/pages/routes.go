package pages

import (
	"log/slog"
	"net/http"

	"forge.capytal.company/loreddev/x/groute/router"
	"forge.capytal.company/loreddev/x/groute/router/rerrors"
)

func Routes(log *slog.Logger) router.Router {
	r := router.NewRouter()

	r.Use(rerrors.NewErrorMiddleware(ErrorPage{}.Component, log))

	r.Handle("/", &IndexPage{})
	r.Handle("/about", &AboutPage{})

	b := NewBlog("dot013", "blog", "https://forge.capytal.company/api/v1")
	r.Handle("/blog", http.StripPrefix("/blog/", b.Routes()))

	return r
}
