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
	"syscall"

	"capytal.cc/templates"
	"capytal.cc/tinyssert"
)

var (
	hostname     = flag.String("hostname", "localhost", "Host to listen to")
	port         = flag.Uint("port", 8080, "Port to be used for the server.")
	templatesDir = flag.String("templates", "", "Templates directory to be used instead of built-in ones.")
	verbose      = flag.Bool("verbose", false, "Print debug information on logs")
	dev          = flag.Bool("dev", false, "Run the server in debug mode.")
)

func getEnv(key string, d string) string {
	v := os.Getenv(key)
	if v == "" {
		return d
	}
	return v
}

func init() {
	flag.Parse()
}

func main() {
	ctx := context.Background()

	assertions := tinyssert.NewDisabledAssertions()
	if *dev {
		assertions = tinyssert.NewAssertions(tinyssert.Opts{
			Panic: true,
		})
	}

	level := slog.LevelError
	if *dev {
		level = slog.LevelDebug
	} else if *verbose {
		level = slog.LevelInfo
	}
	log := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{Level: level}))

	opts := []Option{
		WithAssertions(assertions),
		WithLogger(log),
	}
	if *dev {
		opts = append(opts, WithAssets(os.DirFS("./assets")))
		opts = append(opts, WithTemplates(templates.NewHotTemplates(os.DirFS("./templates"))))
		opts = append(opts, WithCacheDisabled())
	}

	app, err := NewApp(opts...)
	if err != nil {
		log.Error("Unable to initiate application", slog.String("error", err.Error()))
		os.Exit(1)
	}

	srv := &http.Server{
		Addr:    fmt.Sprintf("%s:%d", *hostname, *port),
		Handler: app,
	}

	c, stop := signal.NotifyContext(ctx, syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	go func() {
		log.Info("Starting application",
			slog.String("host", *hostname),
			slog.Uint64("port", uint64(*port)),
			slog.Bool("verbose", *verbose),
			slog.Bool("development", *dev))

		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Error("Failed to start application server", slog.String("error", err.Error()))
			os.Exit(1)
		}
	}()

	<-c.Done()

	log.Info("Stopping application gracefully")
	if err := srv.Shutdown(ctx); err != nil {
		log.Error("Failed to stop application server gracefully", slog.String("error", err.Error()))
		os.Exit(1)
	}

	log.Info("FINAL")
	os.Exit(0)
}
