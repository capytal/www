package main

import (
	"context"
	"errors"
	"flag"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"syscall"

	"forge.capytal.company/capytal/www/configs"
	"forge.capytal.company/capytal/www/handlers/pages"

	"forge.capytal.company/loreddev/x/groute/middleware"
	"forge.capytal.company/loreddev/x/groute/router"
)

var (
	port int
	dev  bool
)

func init() {
	if p, err := strconv.Atoi(os.Getenv("PORT")); err != nil {
		flag.IntVar(&port, "port", 8080, "The port to use in the server")
	} else {
		flag.IntVar(&port, "port", p, "The port to use in the server")
	}

	if p, err := strconv.ParseBool(os.Getenv("DEV")); err != nil {
		flag.BoolVar(&dev, "dev", false, "Should the server run in development mode")
	} else {
		flag.BoolVar(&dev, "dev", p, "Should the server run in development mode")
	}
}

func main() {
	flag.Parse()

	logger := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelDebug}))

	router.Use(middleware.NewLoggerMiddleware(logger))

	if dev {
		configs.DEVELOPMENT = true
		router.Use(middleware.DevMiddleware)
	} else {
		router.Use(middleware.CacheMiddleware)
	}

	router.Handle("/assets/", http.StripPrefix("/assets/", http.FileServer(http.Dir("./assets"))))

	router.Handle("/", pages.Routes(logger))

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	server := http.Server{
		Addr:    fmt.Sprintf(":%v", port),
		Handler: router.DefaultRouter,
	}

	go func() {
		logger.Info("Starting server", slog.Int("port", port))

		if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			logger.Error("Listen and serve returned error", slog.String("error", err.Error()))
		}
	}()

	<-ctx.Done()
	logger.Info("Gracefully shutting doing server")
	if err := server.Shutdown(context.TODO()); err != nil {
		logger.Error("Server shut down returned an error", slog.String("error", err.Error()))
	}

	logger.Info("FINAL")
}
