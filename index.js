import { regex } from './regex.js';

/**
 * Slugger.
 */
export default class BananaSlug {
  /**
   * Create a new slug class.
   */
  constructor() {
    this.occurrences = Object.create(null);
    this.reset();
  }

  /**
   * Generate a unique slug.
   *
   * Tracks previously generated slugs: repeated calls with the same value
   * will result in different slugs.
   * Use the `slug` function to get same slugs.
   *
   * @param {string} value - String of text to slugify
   * @param {boolean} [maintainCase=false] - Keep the current case, otherwise make all lowercase
   * @return {string} A unique slug string
   */
  slug(value, maintainCase) {
    let result = this.getSlug(value, maintainCase === true);
    const originalSlug = result;

    while (this.occurrences.hasOwnProperty(result)) {
      this.occurrences[originalSlug]++;
      result = `${originalSlug}-${this.occurrences[originalSlug]}`;
    }

    this.occurrences[result] = 0;

    return result;
  }

  /**
   * Reset - Forget all previous slugs
   *
   * @return {void}
   */
  reset() {
    this.occurrences = Object.create(null);
  }

  /**
   * Generate a slug.
   *
   * Does not track previously generated slugs: repeated calls with the same value
   * will result in the exact same slug.
   * Use the `GithubSlugger` class to get unique slugs.
   *
   * @param {string} value - String of text to slugify
   * @param {boolean} [maintainCase=false] - Keep the current case, otherwise make all lowercase
   * @return {string} A unique slug string
   */
  getSlug(value, maintainCase) {
    if (typeof value !== 'string') return '';
    if (!maintainCase) value = value.toLowerCase();
    return value.replace(regex, '').replace(/ /g, '-');
  }
}
