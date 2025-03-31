// Copyright (c) 2025 Gustavo "Guz" L. de Mello
// Copyright (c) 2025 The Lored.dev Contributors
//
// Contents of this file, expect as otherwise noted, are dual-licensed under the
// Apache License, Version 2.0 <http://www.apache.org/licenses/LICENSE-2.0> or
// the MIT license <http://opensource.org/licenses/MIT>, at you option.
//
// You may use this file in compliance with the licenses.
//
// Unless required by applicable law or agreed to in writing, this file distributed
// under the licenses is distributed on as "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS
// OF ANY KIND, either express or implied.
//
// An original copy of this file can be found at http://forge.capytal.company/loreddev/x/tinyssert/tinyssert.go.

// # Tiny Assert
//
// Minimal set of assertions functions for testing and simulation testing, all in
// one file.
//
// The most simple way of using the package is importing it directly and using the
// alias functions:
//
//	package main
//
//	import (
//	  "log"
//	  "forge.capytal.company/loreddev/x/tinyssert"
//	)
//
//	func main() {
//	  expected := "value"
//	  value := "value"
//	  log.Println(tinyssert.Equal(expected, value)) // "true"
//	}
//
// Or proverbially, you can create your own "assert" variable and have more control
// over how asserts work, see [NewAssertions] for more information:
//
//	package main
//
//	import (
//	  "log/slog"
//	  "forge.capytal.company/loreddev/x/tinyssert"
//	)
//
//	var logger = slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{}))
//	var assert = tinyssert.NewAssertions(assert.Opts{Logger: logger})
//
//	func main() {
//	  expected := "value"
//	  value := "not value"
//	  assert.Equal(expected, value) // "expected \"value\", got \"not value\"" with the call stack and returns false
//	}
package tinyssert

import (
	"fmt"
	"io"
	"log/slog"
	"os"
	"path"
	"reflect"
	"runtime"
	"strings"
	"unicode"
	"unicode/utf8"
)

// Assertions represents all the API provided by the [assert] package. Implementation
// of this interface can have extra logic on their state such as panicking or using
// [testing.T.FailNow] to halt the program from continuing on failed assertions instead
// of just return false.
type Assertions interface {
	// Asserts that the object are not zero-valued or nil, aka. "are ok".
	OK(obj any, msg ...any) bool

	// Asserts that the actual value is equal to the expected value.
	Equal(expected, actual any, msg ...any) bool
	// Asserts that the actual value is not equal to the expected value.
	NotEqual(expected, actual any, msg ...any) bool

	// Asserts that the object is nil.
	Nil(obj any, msg ...any) bool
	// Asserts that the object is not nil.
	NotNil(obj any, msg ...any) bool

	// Asserts that the object is a boolean true.
	True(obj any, msg ...any) bool
	// Asserts that the object is a boolean false.
	False(obj any, msg ...any) bool

	// Asserts that the object is zero-valued.
	Zero(obj any, msg ...any) bool
	// Asserts that the object is not zero-valued.
	NotZero(obj any, msg ...any) bool

	// Asserts that the function panics.
	Panic(fn func(), msg ...any) bool
	// Asserts that the function does not panics.
	NotPanic(fn func(), msg ...any) bool

	// Returns false and marks the test as having failed, if the underlying
	// implementation has access to a [testing.T.Fail]. Implementations can also log
	// the call stack using [CallerInfo].
	Fail(failureMsg string, msg ...any) bool
	// Returns false, marks the test as having failed, and calls [testing.T.FailNow] if the
	// underlying implementation has access to it, otherwise, simply panics.
	// Implementations can also log the call stack using [CallerInfo].
	FailNow(failureMsg string, msg ...any) bool

	// Gets the caller stack.
	CallerInfo() []string
}

var defaultAssert = NewAssertions()

// Asserts that the object are not zero-valued or nil, aka. "are ok".
func OK(obj any, msg ...any) bool {
	return defaultAssert.OK(obj, msg...)
}

// Asserts that the actual value is equal to the expected value.
func Equal(expected, actual any, msg ...any) bool {
	return defaultAssert.Equal(expected, actual, msg...)
}

// Asserts that the actual value is not equal to the expected value.
func NotEqual(expected, actual any, msg ...any) bool {
	return defaultAssert.NotEqual(expected, actual, msg...)
}

// Asserts that the object is nil.
func Nil(obj any, msg ...any) bool {
	return defaultAssert.Nil(obj, msg...)
}

// Asserts that the object is not nil.
func NotNil(obj any, msg ...any) bool {
	return defaultAssert.NotNil(obj, msg...)
}

// Asserts that the object is a boolean true.
func True(obj any, msg ...any) bool {
	return defaultAssert.True(obj, msg...)
}

// Asserts that the object is a boolean false.
func False(obj any, msg ...any) bool {
	return defaultAssert.False(obj, msg...)
}

// Asserts that the object is zero-valued.
func Zero(obj any, msg ...any) bool {
	return defaultAssert.Zero(obj, msg...)
}

// Asserts that the object is not zero-valued.
func NotZero(obj any, msg ...any) bool {
	return defaultAssert.NotZero(obj, msg...)
}

// Asserts that the function panics.
func Panic(fn func(), msg ...any) bool {
	return defaultAssert.Panic(fn, msg...)
}

// Asserts that the function does not panics.
func NotPanic(fn func(), msg ...any) bool {
	return defaultAssert.NotPanic(fn, msg...)
}

// Returns false and logs the failure message using [slog.TextHandler] to [os.Stdout].
func Fail(failureMsg string, msg ...any) bool {
	return NewAssertions(
		Opts{Logger: slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{}))},
	).Fail(failureMsg, msg...)
}

// Panics and logs the failure message using [slog.TextHandler] to [os.Stdout].
func FailNow(failureMsg string, msg ...any) bool {
	return defaultAssert.FailNow(failureMsg, msg...)
}

// Creates a new implementation of Assertions, use [Opts] if you want to better manipulate
// the behaviour of assertions.
func NewAssertions(opts ...Opts) Assertions {
	opt := Opts{}
	if len(opts) > 0 {
		opt = opts[0]
	}

	var h helperT
	if th, ok := opt.Testing.(helperT); ok {
		h = th
	}

	if opt.Logger == nil {
		opt.Logger = slog.New(slog.NewTextHandler(io.Discard, &slog.HandlerOptions{}))
	}

	return &assertions{
		panic: opt.Panic,

		t: opt.Testing,
		h: h,

		log: opt.Logger,
	}
}

type Opts struct {
	// Wherever the assertions should panic/[FailNow] instead of just logging and
	// marking the test as failed. Optional, defaults to false.
	Panic bool
	// The testing framework to be used by assertions. Optional, if none is provided
	// the assertions just returns false in the functions, if [Opts.Panic] is set to true, the
	// assertions use panic() instead of [FailNow].
	Testing TestingT
	// The logger used by the assertions if none Testing framework is provided. Optional,
	// creates a logger that writes to [io.Discard] if none is provided.
	Logger *slog.Logger
}

// Wrapper interface around [testing.T].
type TestingT interface {
	Errorf(format string, args ...any)
}
type helperT interface {
	Helper()
}

type assertions struct {
	panic bool

	t TestingT
	h helperT

	log *slog.Logger
}

func (as *assertions) OK(obj any, msg ...any) bool {
	switch {
	case as.nil(obj):
		return as.failOrPanic("unexpected nil value", msg...)
	case as.zero(obj):
		return as.failOrPanic("unexpected zero value", msg...)
	default:
		return false
	}
}

func (as *assertions) Equal(e, a any, msg ...any) bool {
	if as.equal(e, a) {
		return true
	}
	return as.failOrPanic(fmt.Sprintf("expected %v, got %v", e, a), msg...)
}

func (as *assertions) NotEqual(e, a any, msg ...any) bool {
	if !as.equal(e, a) {
		return true
	}
	return as.failOrPanic(fmt.Sprintf("not expected %v, got %v", e, a), msg...)
}

func (as *assertions) equal(e, a any) bool {
	if an, en := as.nil(a), as.nil(e); an || en {
		if (an && !en) || (!an && en) {
			return false
		}
		return en == an
	}

	if reflect.DeepEqual(e, a) {
		return true
	}

	ev, av := reflect.ValueOf(e), reflect.ValueOf(a)

	if ev == av {
		return true
	}

	if av.Type().ConvertibleTo(ev.Type()) {
		return reflect.DeepEqual(e, av.Convert(ev.Type()).Interface())
	}

	if fmt.Sprintf("%#v", e) == fmt.Sprintf("%#v", a) {
		return true
	}

	return false
}

func (as *assertions) Nil(obj any, msg ...any) bool {
	if as.nil(obj) {
		return true
	}
	return as.failOrPanic("expected nil value", msg...)
}

func (as *assertions) NotNil(obj any, msg ...any) bool {
	if !as.nil(obj) {
		return true
	}
	return as.failOrPanic("expected not-nil value", msg...)
}

func (as *assertions) nil(obj any) bool {
	if obj == nil {
		return true
	}
	v := reflect.ValueOf(obj)
	k := v.Kind()
	if k >= reflect.Chan && k <= reflect.Slice && v.IsNil() {
		return true
	}
	return false
}

func (as *assertions) True(obj any, msg ...any) bool {
	if b, ok := obj.(bool); ok && b {
		return true
	}
	return as.failOrPanic("expected true", msg...)
}

func (as *assertions) False(obj any, msg ...any) bool {
	if b, ok := obj.(bool); ok && !b {
		return true
	}
	return as.failOrPanic("expected false", msg...)
}

func (as *assertions) Zero(obj any, msg ...any) bool {
	if as.zero(obj) {
		return true
	}
	return as.failOrPanic(fmt.Sprintf("expected zero value, got %v", obj), msg...)
}

func (as *assertions) NotZero(obj any, msg ...any) bool {
	if !as.zero(obj) {
		return true
	}
	return as.failOrPanic(fmt.Sprintf("expected non-zero value, got %v", obj), msg...)
}

func (as *assertions) zero(obj any) bool {
	if obj != nil && !reflect.DeepEqual(obj, reflect.Zero(reflect.TypeOf(obj)).Interface()) {
		return false
	}
	return true
}

func (as *assertions) Panic(fn func(), msg ...any) bool {
	if as.panics(fn) {
		return true
	}
	return as.failOrPanic("expected panic", msg...)
}

func (as *assertions) NotPanic(fn func(), msg ...any) bool {
	if !as.panics(fn) {
		return true
	}
	return as.failOrPanic("unexpected panic", msg...)
}

func (as *assertions) panics(fn func()) bool {
	var r any
	func() {
		defer func() {
			r = recover()
		}()
		fn()
	}()
	return r != nil
}

func (as *assertions) Fail(failureMsg string, msg ...any) bool {
	as.fail(failureMsg, msg...)
	if ft, ok := as.t.(interface {
		Fail()
	}); ok {
		ft.Fail()
	}
	return false
}

func (as *assertions) FailNow(failureMsg string, msg ...any) bool {
	as.fail(failureMsg, msg...)
	if ft, ok := as.t.(interface {
		FailNow()
	}); ok {
		ft.FailNow()
	} else {
		panic(fmtMessage(msg))
	}
	return false
}

func (as *assertions) fail(failureMsg string, msg ...any) {
	if as.h != nil {
		as.h.Helper()
	}
	content := make(map[string]string, 4)

	content["Stack Trace"] = strings.Join(as.CallerInfo(), "\n\t")
	content["Error"] = failureMsg

	if n, ok := as.t.(interface {
		Name() string
	}); ok {
		content["Test"] = n.Name()
	}

	if msg := fmtMessage(msg); msg != "" {
		content["Message"] = msg
	}

	var out string
	for k, m := range content {
		var c string
		for _, s := range strings.Split(m, "\n") {
			c += fmt.Sprintf("\t%s\n", s)
		}
		out += fmt.Sprintf("\t%s:\n%s", k, c)
	}

	if as.t != nil {
		as.t.Errorf("\n%s", out)
	} else {
		as.log.Error(out)
	}
}

func (as *assertions) failOrPanic(failureMsg string, msg ...any) bool {
	if as.panic {
		return as.FailNow(failureMsg, msg...)
	}
	return as.Fail(failureMsg, msg...)
}

func fmtMessage(msg []any) string {
	switch len(msg) {
	case 0:
		return ""
	case 1:
		if s, ok := msg[0].(string); ok {
			return s
		} else {
			return fmt.Sprintf("%v", msg[0])
		}
	default:
		var m string
		if s, ok := msg[0].(string); ok {
			m = s
		} else {
			m = fmt.Sprintf("%v", msg[0])
		}
		return fmt.Sprintf(m, msg[1:]...)
	}
}

func (as *assertions) CallerInfo() []string {
	callers := []string{}
	for i := 0; ; i++ {
		pc, file, line, ok := runtime.Caller(i)
		if !ok {
			// We reached the end of the call stack
			break
		}

		// Edge case found in https://github.com/stretchr/testify/issues/180
		if file == "<autogenerated>" {
			break
		}

		f := runtime.FuncForPC(pc)
		if f == nil {
			break
		}
		name := f.Name()

		if name == "testing.Runner" {
			break
		}

		filename := path.Base(file)
		dirname := path.Base(path.Dir(file))
		if (dirname != "assert" && dirname != "mock" && dirname != "require") ||
			filename == "mock_test.go" {
			callers = append(callers, fmt.Sprintf("%s:%d", file, line))
		}

		// Remove the package
		s := strings.Split(name, ".")
		name = s[len(s)-1]

		if isTest(name, "Test") || isTest(name, "Benchmark") || isTest(name, "Example") {
			break
		}
	}
	return callers
}

func isTest(name, prefix string) bool {
	if !strings.HasPrefix(name, prefix) {
		return false
	}
	if len(name) == len(prefix) {
		return true
	}
	r, _ := utf8.DecodeRuneInString(name[len(prefix):])
	return !unicode.IsLower(r)
}

type disabledAssertions struct{}

// NewDisabledAssertions creates a new implementation of Assertions that always return true, with
// the exception of [Assertions.Fail] and [Assertions.FailNow] which returns false, and
// [Assertions.CallerInfo] which returns the actual caller info (uses [CallerInfo] underlying).
// It is useful it you use  assertions in production and want to disable them without changing any code.
func NewDisabledAssertions() Assertions {
	return &disabledAssertions{}
}

func (*disabledAssertions) OK(any, ...any) bool              { return true }
func (*disabledAssertions) Equal(_, _ any, _ ...any) bool    { return true }
func (*disabledAssertions) NotEqual(_, _ any, _ ...any) bool { return true }
func (*disabledAssertions) Nil(any, ...any) bool             { return true }
func (*disabledAssertions) NotNil(any, ...any) bool          { return true }
func (*disabledAssertions) True(any, ...any) bool            { return true }
func (*disabledAssertions) False(any, ...any) bool           { return true }
func (*disabledAssertions) Zero(any, ...any) bool            { return true }
func (*disabledAssertions) NotZero(any, ...any) bool         { return true }
func (*disabledAssertions) Panic(func(), ...any) bool        { return true }
func (*disabledAssertions) NotPanic(func(), ...any) bool     { return true }
func (*disabledAssertions) Fail(string, ...any) bool         { return false }
func (*disabledAssertions) FailNow(string, ...any) bool      { return false }
func (*disabledAssertions) CallerInfo() []string             { return defaultAssert.CallerInfo() }
