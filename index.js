module.exports = BananaSlug

var wemoji = require('wemoji')

function BananaSlug () {
  var self = this
  if (!(self instanceof BananaSlug)) return new BananaSlug()

  self.reset()
}

/**
 * Generate a unique slug.
 * @param  {string} value String of text to slugify
 * @return {string}       A unique slug string
 */
BananaSlug.prototype.slug = function (value) {
  var self = this
  var slug = slugger(value)
  var occurrences = self.occurrences[slug]

  if (self.occurrences.hasOwnProperty(slug)) {
    occurrences++
  } else {
    occurrences = 0
  }

  self.occurrences[slug] = occurrences

  if (occurrences) {
    slug = slug + '-' + occurrences
  }

  return slug
}

/**
 * Reset - Forget all previous slugs
 * @return void
 */
BananaSlug.prototype.reset = function () {
  this.occurrences = {}
}

var whitespace = /\s/g

function convertEmoji (string) {
  for (var idx = 0; idx < string.length; idx++) {
    // inspect two characters at a time because indexing characters in JavaScript
    // strings like this ends up splitting the unicode code points up
    // (see https://mathiasbynens.be/notes/javascript-unicode)
    var emoji = wemoji.unicode[string[idx] + string[idx + 1]]
    if (emoji) {
      string = string.substring(0, idx) + emoji.name + string.substring(idx + 1)
      idx += emoji.name.length
    }
  }

  return string
}

function slugger (string) {
  var allowedCharacters = 'A-Za-z0-9_ -'
  var re = new RegExp('[^' + allowedCharacters + ']', 'g')
  var maintainCase = false
  var replacement = '-'
  var result

  if (typeof string !== 'string') return ''
  if (!maintainCase) string = string.toLowerCase()
  result = convertEmoji(string.trim()).replace(re, '').replace(whitespace, replacement)
  return result
}
