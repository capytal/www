package pages

import (
	"log/slog"

	"forge.capytal.company/capytalcode/project-comicverse/lib/router"
	"forge.capytal.company/capytalcode/project-comicverse/lib/router/rerrors"
)

func Routes(log *slog.Logger) router.Router {
	r := router.NewRouter()

	r.Use(rerrors.NewErrorMiddleware(ErrorPage{}.Component, log).Wrap)

	r.Handle("/", &IndexPage{})

	return r
}
