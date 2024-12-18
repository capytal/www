module forge.capytal.company/capytal/www

go 1.23.3

require forge.capytal.company/loreddev/x v0.0.0

replace forge.capytal.company/loreddev/x => ./x

require (
	github.com/a-h/templ v0.2.793
	github.com/yuin/goldmark v1.7.8
	github.com/yuin/goldmark-meta v1.1.0
)

require gopkg.in/yaml.v2 v2.3.0 // indirect
