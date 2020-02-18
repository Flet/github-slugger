var test = require('tape')
var GithubSlugger = require('../')

test('static method - simple stuff', function (t) {
  var slug = GithubSlugger.slug

  t.equals(slug('foo'), 'foo', 'should work without new')
  t.equals(slug(1), '', 'should return empty string for non-strings')

  // See `1-basic-usage.md`
  t.equals(slug('foo'), 'foo')
  t.equals(slug('foo bar'), 'foo-bar')
  t.equals(slug('foo'), 'foo') // idem potent

  // See `2-camel-case.md`
  t.equals(slug('foo'), 'foo')
  // Note: GH doesn’t support `maintaincase`, so the actual values are commented below.
  t.equals(slug('fooCamelCase', true), 'fooCamelCase') // foocamelcase
  t.equals(slug('fooCamelCase'), 'foocamelcase') // foocamelcase-1

  // See `3-prototype.md`
  t.equals(slug('__proto__'), '__proto__')
  t.equals(slug('__proto__'), '__proto__')
  t.equals(slug('hasOwnProperty', true), 'hasOwnProperty') // hasownproperty
  t.equals(slug('foo'), 'foo')

  t.end()
})

test('static method - github test cases', function (t) {
  var slug = GithubSlugger.slug

  testCases.forEach(function (test) {
    t.equals(slug(test.text), test.slug, test.mesg)
  })

  t.end()
})

var testCases = [
  // See `6-characters.md`
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
  // Note: GH doesn’t create slugs for empty headings.
  {
    mesg: 'empty',
    text: '',
    slug: ''
  },
  // Note: white-space in headings is trimmed off in markdown.
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
  // Note: Apostrophe in heading is trimmed off in markdown
  {
    mesg: 'apostrophe’s should be trimmed',
    text: 'apostrophe’s should be trimmed',
    slug: 'apostrophes-should-be-trimmed'
  },
  // See `8-non-ascii.md`
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
    mesg: 'deals with non-latin chars',
    text: 'Привет',
    slug: 'привет'
  },
  {
    mesg: 'Cyrillic',
    text: 'Профили пользователей',
    slug: 'профили-пользователей'
  },
  {
    mesg: 'More non-latin',
    text: 'Привет non-latin 你好',
    slug: 'привет-non-latin-你好'
  },
  // See `9-emoji.md`
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
  }
]
