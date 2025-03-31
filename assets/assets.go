package assets

import (
	"embed"
	"io/fs"
)

//go:embed stylesheets/out.css icon.svg fonts/*.ttf fonts/*.woff fonts/*.woff2 fonts/*.otf
var files embed.FS

func Files(local ...bool) fs.FS {
	var l bool
	if len(local) > 0 {
		l = local[0]
	}

	if !l {
		return files
	}

	return files
}
