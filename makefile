PORT?=8080

lint: build/templ
	go run github.com/golangci/golangci-lint/cmd/golangci-lint@v1.59.1 run
	# npx eslint .

lint/fix: build/templ
	go run github.com/golangci/golangci-lint/cmd/golangci-lint@v1.59.1 run
	# npx eslint --fix .

fmt: build/templ
	go fmt ./.
	go run github.com/a-h/templ/cmd/templ@v0.2.707 fmt .
	go run mvdan.cc/gofumpt@v0.7.0 -l -w .
	go run github.com/segmentio/golines@v0.12.2 -w .
	go run golang.org/x/tools/cmd/goimports@v0.26.0 -w -l .

dev/templ:
	go run github.com/a-h/templ/cmd/templ@v0.2.707 generate --watch \
		--proxy=http://localhost:$(PORT) \
		--proxybind="0.0.0.0" \
		--open-browser=false

dev/server:
	go run github.com/air-verse/air@v1.52.2 \
		--build.cmd "go build -o tmp/bin/main ." \
		--build.bin "tmp/bin/main" \
		--build.exclude_dir "node_modules" \
		--build.include_ext "go" \
		--build.stop_on_error "false" \
		--misc.clean_on_exit true \
		-- -dev -port $(PORT)

dev/sync_assets:
	go run github.com/air-verse/air@v1.52.2 \
		--build.cmd "go run github.com/a-h/templ/cmd/templ@v0.2.707 generate --notify-proxy" \
		--build.bin "true" \
		--build.delay "100" \
		--build.exclude_dir "" \
		--build.include_dir "static" \
		--build.include_ext "js,css"

dev/assets/css:
	npx unocss --watch

dev:
	go run github.com/joho/godotenv/cmd/godotenv@v1.5.1 \
		make -j4 dev/templ dev/server dev/sync_assets dev/assets/css

build/templ:
	go run github.com/a-h/templ/cmd/templ@v0.2.707 generate

build/app:
	go build -o ./.dist/app .

build/assets:
	npx unocss

build: build/templ build/assets build/app

run: build
	./.dist/app

clean:
	# Remove templ generated files
	find -type f -iname '*_templ.go' -delete \
		-o -type f -iname '*_templ.txt' -delete

	# Remove UnoCSS generated file
	rm ./assets/css/uno.css

	# Remove generated directories
	if [[ -d ".dist" ]]; then rm -r ./.dist; fi
	if [[ -d "tmp" ]]; then rm -r ./tmp; fi
	if [[ -d "bin" ]]; then rm -r ./bin; fi
