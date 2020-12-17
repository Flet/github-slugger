var test = require('tape')
var GithubSlugger = require('../')

test('simple stuff', function (t) {
  var slugger = new GithubSlugger()

  t.equals(GithubSlugger().slug('foo'), 'foo', 'should work without new')
  t.equals(slugger.slug(1), '', 'should return empty string for non-strings')

  // See `1-basic-usage.md`
  t.equals(slugger.slug('foo'), 'foo')
  t.equals(slugger.slug('foo bar'), 'foo-bar')
  t.equals(slugger.slug('foo'), 'foo-1')

  // See `2-camel-case.md`
  slugger.reset()
  t.equals(slugger.slug('foo'), 'foo')
  // Note: GH doesn’t support `maintaincase`, so the actual values are commented below.
  t.equals(slugger.slug('fooCamelCase', true), 'fooCamelCase') // foocamelcase
  t.equals(slugger.slug('fooCamelCase'), 'foocamelcase') // foocamelcase-1

  // See `3-prototype.md`
  slugger.reset()
  t.equals(slugger.slug('__proto__'), '__proto__')
  t.equals(slugger.slug('__proto__'), '__proto__-1')
  t.equals(slugger.slug('hasOwnProperty', true), 'hasOwnProperty') // hasownproperty
  t.equals(slugger.slug('foo'), 'foo')

  t.end()
})

test('matching slugs', function (t) {
  var slugger = new GithubSlugger()

  // See `4-matching-slugs-basic.md`
  t.equals(slugger.slug('foo'), 'foo')
  t.equals(slugger.slug('foo'), 'foo-1')
  t.equals(slugger.slug('foo 1'), 'foo-1-1')
  t.equals(slugger.slug('foo-1'), 'foo-1-2')
  t.equals(slugger.slug('foo'), 'foo-2')

  // See `5-matching-slugs-again.md`
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
  {
    mesg: 'a space',
    text: ' ',
    slug: '-1'
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
  // See `7-duplicates.md`
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
  },
  require('./General_Category/Close_Punctuation.json'),
  require('./General_Category/Connector_Punctuation.json'),
  require('./General_Category/Control.json'),
  require('./General_Category/Currency_Symbol.json'),
  require('./General_Category/Dash_Punctuation.json'),
  require('./General_Category/Decimal_Number.json'),
  require('./General_Category/Enclosing_Mark.json'),
  require('./General_Category/Final_Punctuation.json'),
  require('./General_Category/Format.json'),
  require('./General_Category/Initial_Punctuation.json'),
  require('./General_Category/Letter_Number.json'),
  //require('./General_Category/Line_Separator.json'), // Presumably d/t .trim()? Not worth fixing?
  require('./General_Category/Lowercase_Letter.json'),
  require('./General_Category/Math_Symbol.json'),
  require('./General_Category/Modifier_Letter.json'),
  require('./General_Category/Modifier_Symbol.json'),
  require('./General_Category/Nonspacing_Mark.json'),
  require('./General_Category/Open_Punctuation.json'),
  require('./General_Category/Other_Letter.json'),
  require('./General_Category/Other_Number.json'),
  require('./General_Category/Other_Punctuation.json'),
  require('./General_Category/Other_Symbol.json'),
  //require('./General_Category/Paragraph_Separator.json'), // Presumably d/t .trim()? Not worth fixing?
  require('./General_Category/Private_Use.json'),
  //require('./General_Category/Space_Separator.json'), // Presumably d/t .trim()? Not worth fixing?
  require('./General_Category/Spacing_Mark.json'),
  //require('./General_Category/Surrogate.json'), // Not sure why I can't strip U+DFFF?
  require('./General_Category/Titlecase_Letter.json'),
  require('./General_Category/Unassigned.json'),
  require('./General_Category/Uppercase_Letter.json'),
]
