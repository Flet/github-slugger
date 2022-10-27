import fs from 'node:fs'
import test from 'tape'
import GithubSlugger, { slug } from '../index.js'

const fixtures = JSON.parse(
  String(fs.readFileSync(
    new URL('fixtures.json', import.meta.url)
  ))
)

test('simple stuff', function (t) {
  const slugger = new GithubSlugger()

  t.equals(slugger.slug(1), '', 'should return empty string for non-strings')

  // Note: GH doesn’t support `maintaincase`, so the actual values are commented below.
  t.equals(slugger.slug('fooCamelCase', true), 'fooCamelCase', 'should support `maintainCase`') // foocamelcase
  t.equals(slugger.slug('fooCamelCase'), 'foocamelcase', 'should support `maintainCase` (reference)') // foocamelcase-1

  t.end()
})

test('static method', function (t) {
  t.equals(slug('foo'), 'foo')
  t.equals(slug('foo bar'), 'foo-bar')
  t.equals(slug('foo'), 'foo') // idem potent
  t.end()
})

test('fixtures', function (t) {
  const slugger = new GithubSlugger()

  fixtures.forEach((d) => {
    t.equals(slugger.slug(d.input), d.expected, d.name)
  })

  t.end()
})
