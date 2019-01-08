var emoji = require('emoji-regex')

module.exports = BananaSlug

function BananaSlug () {
  var self = this
  if (!(self instanceof BananaSlug)) return new BananaSlug()

  self.reset()
}

/**
 * Generate a unique slug.
 * @param  {string} value String of text to slugify
 * @param  {boolean} [false] Keep the current case, otherwise make all lowercase
 * @return {string}       A unique slug string
 */
BananaSlug.prototype.slug = function (value, maintainCase) {
  maintainCase = maintainCase === true
  var self = this
  var slug = slugger(value, maintainCase)

  if (Object.hasOwnProperty.call(self.occurrences, slug)) {
    var originalSlug = slug
    do {
      self.occurrences[originalSlug]++
      slug = originalSlug + '-' + self.occurrences[originalSlug]
    } while (Object.hasOwnProperty.call(self.occurrences, slug))
  }

  self.occurrences[slug] = 0

  return slug
}

/**
 * Reset - Forget all previous slugs
 * @return void
 */
BananaSlug.prototype.reset = function () {
  this.occurrences = Object.create(null)
}

var whitespace = /\s/g

function slugger (string, maintainCase) {
  var re = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g
  var replacement = '-'

  if (typeof string !== 'string') return ''
  if (!maintainCase) string = string.toLowerCase()
  return string.trim()
    .replace(re, '')
    .replace(emoji(), '')
    .replace(whitespace, replacement)
}
