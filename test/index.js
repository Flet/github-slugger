var test = require('tape')
var GithubSlugger = require('../')

test('simple stuff', function (t) {
  var slugger = new GithubSlugger()

  t.equals(slugger.slug('foo'), 'foo')
  t.equals(slugger.slug('foo bar'), 'foo-bar')
  t.equals(slugger.slug('foo'), 'foo-1')

  slugger.reset()
  t.equals(slugger.slug('foo'), 'foo')
  t.equals(slugger.slug('fooCamelCase', true), 'fooCamelCase')
  t.equals(slugger.slug('fooCamelCase'), 'foocamelcase')

  slugger.reset()
  t.equals(slugger.slug('__proto__'), '__proto__')
  t.equals(slugger.slug('__proto__'), '__proto__-1')
  t.equals(slugger.slug('hasOwnProperty', true), 'hasOwnProperty')
  t.equals(slugger.slug('foo'), 'foo')

  t.equals(GithubSlugger().slug('foo'), 'foo', 'should work without new')
  t.equals(slugger.slug(1), '', 'should return empty string for non-strings')

  t.end()
})

test('matching slugs', function (t) {
  var slugger = new GithubSlugger()

  t.equals(slugger.slug('foo'), 'foo')
  t.equals(slugger.slug('foo'), 'foo-1')
  t.equals(slugger.slug('foo 1'), 'foo-1-1')
  t.equals(slugger.slug('foo-1'), 'foo-1-2')
  t.equals(slugger.slug('foo'), 'foo-2')

  slugger.reset()
  t.equals(slugger.slug('foo-1'), 'foo-1')
  t.equals(slugger.slug('foo'), 'foo')
  t.equals(slugger.slug('foo'), 'foo-2')

  t.end()
})

test('github test cases', function (t) {
  var slugger = new GithubSlugger()

  testCases.forEach(function (test) {
    t.equals(slugger.slug(test.text), test.slug, test.mesg)
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
    text: 'duplicates',
    slug: 'duplicates'
  },
  {
    mesg: 'deals with duplicates correctly-1',
    text: 'duplicates',
    slug: 'duplicates-1'
  },
  {
    mesg: 'deals with duplicates correctly-2',
    text: 'duplicates',
    slug: 'duplicates-2'
  },
  {
    mesg: 'deals with non-latin chars',
    text: 'Привет',
    slug: 'привет'
  },
  // https://github.com/wooorm/gh-and-npm-slug-generation
  {
    mesg: 'gh-and-npm-slug-generation-1',
    text: 'I ♥ unicode',
    slug: 'i--unicode'
  },
  {
    mesg: 'gh-and-npm-slug-generation-2',
    text: 'Dash-dash',
    slug: 'dash-dash'
  },
  {
    mesg: 'gh-and-npm-slug-generation-3',
    text: 'en–dash!',
    slug: 'endash'
  },
  {
    mesg: 'gh-and-npm-slug-generation-4',
    text: 'em–dash',
    slug: 'emdash'
  },
  {
    mesg: 'gh-and-npm-slug-generation-5',
    text: '😄 unicode emoji',
    slug: '-unicode-emoji'
  },
  {
    mesg: 'gh-and-npm-slug-generation-6',
    text: '😄-😄 unicode emoji',
    slug: '--unicode-emoji'
  },
  {
    mesg: 'gh-and-npm-slug-generation-7',
    text: '😄_😄 unicode emoji',
    slug: '_-unicode-emoji'
  },
  {
    mesg: 'gh-and-npm-slug-generation-8',
    text: '😄 - an emoji',
    slug: '---an-emoji'
  },
  {
    mesg: 'gh-and-npm-slug-generation-9',
    text: ':smile: - a gemoji',
    slug: 'smile---a-gemoji'
  },
  {
    mesg: 'gh-and-npm-slug-generation-10',
    text: '    Initial spaces',
    slug: 'initial-spaces'
  },
  {
    mesg: 'gh-and-npm-slug-generation-11',
    text: 'Final spaces   ',
    slug: 'final-spaces'
  },
  {
    mesg: 'gh-and-npm-slug-generation-12',
    text: 'duplicate',
    slug: 'duplicate'
  },
  {
    mesg: 'gh-and-npm-slug-generation-13',
    text: 'duplicate',
    slug: 'duplicate-1'
  },
  {
    mesg: 'gh-and-npm-slug-generation-14',
    text: 'Привет non-latin 你好',
    slug: 'привет-non-latin-你好'
  },
  // https://github.com/chrisdickinson/emoji-slug-example
  {
    mesg: 'emoji-slug-example-1',
    text: ':ok: No underscore',
    slug: 'ok-no-underscore'
  },
  {
    mesg: 'emoji-slug-example-2',
    text: ':ok_hand: Single',
    slug: 'ok_hand-single'
  },
  {
    mesg: 'emoji-slug-example-3',
    text: ':ok_hand::hatched_chick: Two in a row with no spaces',
    slug: 'ok_handhatched_chick-two-in-a-row-with-no-spaces'
  },
  {
    mesg: 'emoji-slug-example-4',
    text: ':ok_hand: :hatched_chick: Two in a row',
    slug: 'ok_hand-hatched_chick-two-in-a-row'
  },
  {
    mesg: 'Cyrillic',
    text: 'Профили пользователей',
    slug: 'профили-пользователей'
  }
]
