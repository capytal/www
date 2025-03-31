package templates

// INFO: This will probably become a new lib in loreddev/x at some point

import (
	"embed"
	"errors"
	"fmt"
	"html/template"
	"io"
	"io/fs"
)

var (
	patterns  = []string{"*.html", "layouts/*.html", "partials/*.html"}
	functions = template.FuncMap{
		"args": func(pairs ...any) (map[string]any, error) {
			if len(pairs)%2 != 0 {
				return nil, errors.New("misaligned map in template arguments")
			}

			m := make(map[string]any, len(pairs)/2)

			for i := 0; i < len(pairs); i += 2 {
				key, ok := pairs[i].(string)
				if !ok {
					return nil, fmt.Errorf("cannot use type %T as map key", pairs[i])
				}

				m[key] = pairs[i+1]
			}

			return m, nil
		},
	}
)

//go:embed *.html layouts/*.html partials/*.html
var embedded embed.FS

var temps = template.Must(template.New("templates").Funcs(functions).ParseFS(embedded, patterns...))

func Templates() *template.Template {
	return temps // TODO: Support for local templates/hot-reloading without rebuild
}

func NewHotTemplates(fsys fs.FS) *HotTemplate {
	return &HotTemplate{
		fs: fsys,
	}
}

type HotTemplate struct {
	fs       fs.FS
	template *template.Template
}

func (t *HotTemplate) Execute(wr io.Writer, data any) error {
	te, err := template.New("hot-templates").Funcs(functions).ParseFS(t.fs, patterns...)
	if err != nil {
		return err
	}
	return te.Execute(wr, data)
}

func (t *HotTemplate) ExecuteTemplate(wr io.Writer, name string, data any) error {
	te, err := template.New("hot-templates").Funcs(functions).ParseFS(t.fs, patterns...)
	if err != nil {
		return err
	}
	return te.ExecuteTemplate(wr, name, data)
}

type ITemplate interface {
	Execute(wr io.Writer, data any) error
	ExecuteTemplate(wr io.Writer, name string, data any) error
}
