package blog

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"path"
	"forge.capytal.company/capytalcode/project-comicverse/lib/router/rerrors"
)

func NewGiteaBlog(owner, repo, endpoint string) *GiteaBlog {
	return &GiteaBlog{
		owner:    owner,
		repo:     repo,
		endpoint: endpoint,
	}
}

func (b *GiteaBlog) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	p := path.Clean(r.URL.Path)
	p = fmt.Sprintf("%s/repos/%s/%s/contents/%s", b.endpoint, b.owner, b.repo, p)

	log.Printf("PATH %s", p)

	res, err := http.Get(p)
	if err != nil {
		rerrors.InternalError(err).ServeHTTP(w, r)
		return
	}

	body, err := io.ReadAll(res.Body)
	if err != nil {
		rerrors.InternalError(err).ServeHTTP(w, r)
		return
	} else if res.StatusCode != http.StatusOK {
		rerrors.InternalError(fmt.Errorf("Non-OK: %s", string(body))).ServeHTTP(w, r)
		return
	}

	if _, err := w.Write(body); err != nil {
		rerrors.InternalError(err).ServeHTTP(w, r)
		return
	}
}
