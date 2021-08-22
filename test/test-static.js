const test = require('tape')
const GithubSlugger = require('../')

test('static method - simple stuff', function (t) {
  const slug = GithubSlugger.slug

  // See `1-basic-usage.md`
  t.equals(slug('foo'), 'foo')
  t.equals(slug('foo bar'), 'foo-bar')
  t.equals(slug('foo'), 'foo') // idem potent

  // See `2-camel-case.md`
  t.equals(slug('foo'), 'foo')

  // Note: GH doesn’t support `maintaincase`, so the actual values are commented below.
  t.equals(slug('fooCamelCase', true), 'fooCamelCase') // foocamelcase
  t.equals(slug('fooCamelCase'), 'foocamelcase') // foocamelcase

  t.end()
})

test('static method - yielding empty strings', function (t) {
  const slug = GithubSlugger.slug

  t.equals(slug(1), '', 'should return empty string for non-strings')
  t.equals(slug(' '), '')

  t.end()
})
