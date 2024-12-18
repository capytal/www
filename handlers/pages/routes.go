package pages

import (
	"log/slog"

	"forge.capytal.company/loreddev/x/groute/router"
	"forge.capytal.company/loreddev/x/groute/router/rerrors"
)

func Routes(log *slog.Logger) router.Router {
	r := router.NewRouter()

	r.Use(rerrors.NewErrorMiddleware(ErrorPage{}.Component, log))

	r.Handle("/", &IndexPage{})
	r.Handle("/about", &AboutPage{})

	return r
}
