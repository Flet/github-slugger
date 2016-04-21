var test = require('tape')
var GithubSlugger = require('../')

test('simple stuff', function (t) {
  var slugger = new GithubSlugger()

  t.equals('foo', slugger.slug('foo'))
  t.equals('foo-bar', slugger.slug('foo bar'))
  t.equals('foo-1', slugger.slug('foo'))

  slugger.reset()
  t.equals('foo', slugger.slug('foo'))

  t.end()
})

test('github test cases', function (t) {
  var slugger = new GithubSlugger()

  testCases.forEach(function (test) {
    t.equals(test.slug, slugger.slug(test.text), test.mesg)
  })
  t.end()
})

var testCases = [
  {
    mesg: 'allows a dash',
    text: 'heading with a - dash',
    slug: 'heading-with-a---dash'
  },
  {
    mesg: 'allows underscores',
    text: 'heading with an _ underscore',
    slug: 'heading-with-an-_-underscore'
  },
  {
    mesg: 'filters periods',
    text: 'heading with a period.txt',
    slug: 'heading-with-a-periodtxt'
  },
  {
    mesg: 'allows two spaces even after filtering',
    text: 'exchange.bind_headers(exchange, routing [, bindCallback])',
    slug: 'exchangebind_headersexchange-routing--bindcallback'
  },
  {
    mesg: 'empty',
    text: '',
    slug: ''
  },
  {
    mesg: 'a space',
    text: ' ',
    slug: '-1'
  },
  {
    mesg: 'initial space',
    text: ' initial space',
    slug: 'initial-space'
  },
  {
    mesg: 'final space',
    text: 'final space ',
    slug: 'final-space'
  },
  {
    mesg: 'deals with prototype properties',
    text: 'length',
    slug: 'length'
  },
  {
    mesg: 'deals with duplicates correctly',
    text: 'duplicate',
    slug: 'duplicate'
  },
  {
    mesg: 'deals with duplicates correctly-1',
    text: 'duplicate',
    slug: 'duplicate-1'
  },
  {
    mesg: 'deals with duplicates correctly-2',
    text: 'duplicate',
    slug: 'duplicate-2'
  },
  {
    mesg: 'deals with non-latin chars',
    text: 'Привет',
    slug: 'привет'
  }
]
