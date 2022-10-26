import { regex } from './regex.js'

const own = Object.hasOwnProperty

/**
 * Slugger.
 */
export default class BananaSlug {
  /**
   * Create a new slug class.
   */
  constructor () {
    this.reset()
  }

  /**
   * Generate a unique slug.
   *
   * @param  {string} value
   *   String of text to slugify
   * @param  {boolean} [maintainCase=false]
   *   Keep the current case, otherwise make all lowercase
   * @return {string}
   *   A unique slug string
   */
  slug (value, maintainCase) {
    const self = this
    let result = slug(value, maintainCase === true)
    const originalSlug = result

    while (own.call(self.occurrences, result)) {
      self.occurrences[originalSlug]++
      result = originalSlug + '-' + self.occurrences[originalSlug]
    }

    self.occurrences[result] = 0

    return result
  }

  /**
   * Reset - Forget all previous slugs
   *
   * @return void
   */
  reset () {
    this.occurrences = Object.create(null)
  }
}

export function slug (string, maintainCase) {
  if (typeof string !== 'string') return ''
  if (!maintainCase) string = string.toLowerCase()
  return string.replace(regex, '').replace(/ /g, '-')
}
