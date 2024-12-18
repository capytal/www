package pages

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"path"

	"forge.capytal.company/capytalcode/project-comicverse/lib/router"
	"forge.capytal.company/capytalcode/project-comicverse/lib/router/rerrors"
)

type Blog struct {
	repo     string
	owner    string
	endpoint string
}

func NewBlog(repo, owner, endpoint string) *Blog {
	u, err := url.Parse(endpoint)
	if err != nil {
		panic(fmt.Sprintf("Blog Forgejo endpoint is not a valid URL: %v", err))
	}
	return &Blog{repo: repo, owner: owner, endpoint: u.String()}
}

func (p *Blog) Routes() router.Router {
	r := router.NewRouter()

	r.HandleFunc("/", p.listPosts)

	return r
}

func (p *Blog) listPosts(w http.ResponseWriter, r *http.Request) {
	_, body, rerr := p.get(fmt.Sprintf("/repos/%s/%s/contents/daily-blogs", p.owner, p.repo))
	if rerr != nil {
		rerr.ServeHTTP(w, r)
		return
	}

	var list []forgejoFile

	err := json.Unmarshal(body, &list)
	if err != nil {
		rerrors.InternalError(errors.New("failed to parse list of entries"), err).ServeHTTP(w, r)
		return
	}

	w.WriteHeader(http.StatusOK)
	_, err = w.Write([]byte(fmt.Sprintf("%v", list)))
	if err != nil {
		rerrors.InternalError(err).ServeHTTP(w, r)
	}
}

func (p *Blog) get(endpoint string) (http.Header, []byte, *rerrors.RouteError) {
	u, _ := url.Parse(p.endpoint)
	u.Path = path.Join(u.Path, endpoint)

	r, err := http.Get(u.String())
	if err != nil {
		e := rerrors.InternalError(
			fmt.Errorf("failed to make request to endpoint %s", u.String()),
			err,
		)
		return nil, nil, &e
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		e := rerrors.InternalError(
			fmt.Errorf("failed to read response body of request to endpoint %s", u.String()),
			err,
		)
		return nil, nil, &e
	} else if r.StatusCode != http.StatusOK {
		e := rerrors.InternalError(
			fmt.Errorf("request to endpoint %s returned non-200 code %q.\n%s", u.String(), r.Status, string(body)),
		)
		return nil, nil, &e
	}

	return r.Header, body, nil
}

type forgejoFile struct {
	Name          string `json:"name"`
	Path          string `json:"path"`
	Sha           string `json:"sha"`
	LastCommitSha string `json:"last_commit_sha"`
	Type          string `json:"type"`
}
