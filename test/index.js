const test = require('tape')
const GithubSlugger = require('../')
const gist = require('./fixtures.json')

require('./test-static')

test('simple stuff', function (t) {
  const slugger = new GithubSlugger()

  t.equals(GithubSlugger().slug('foo'), 'foo', 'should work without new')
  t.equals(slugger.slug(1), '', 'should return empty string for non-strings')

  // Note: GH doesn’t support `maintaincase`, so the actual values are commented below.
  t.equals(slugger.slug('fooCamelCase', true), 'fooCamelCase', 'should support `maintainCase`') // foocamelcase
  t.equals(slugger.slug('fooCamelCase'), 'foocamelcase', 'should support `maintainCase` (reference)') // foocamelcase-1

  t.end()
})

test('fixtures', function (t) {
  const slugger = new GithubSlugger()

  gist.forEach((d) => {
    t.equals(slugger.slug(d.input), d.expected, d.name)
  })

  t.end()
})
