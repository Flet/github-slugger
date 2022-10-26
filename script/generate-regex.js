import { promises as fs } from 'node:fs'
import regenerate from 'regenerate'
import alphabetics from '@unicode/unicode-13.0.0/Binary_Property/Alphabetic/code-points.js'

const categoryBase = new URL('../node_modules/@unicode/unicode-13.0.0/General_Category/', import.meta.url)

// Unicode General Categories to remove.
const ranges = [
  // Some numbers:
  'Other_Number',

  // Some punctuation:
  'Close_Punctuation',
  'Final_Punctuation',
  'Initial_Punctuation',
  'Open_Punctuation',
  'Other_Punctuation',
  // All except a normal `-` (dash)
  'Dash_Punctuation',

  // All:
  'Symbol',
  'Control',
  'Private_Use',
  'Format',
  'Unassigned',

  // All except a normal ` ` (space)
  'Separator'
]

main()

async function main () {
  const generator = regenerate()

  let index = -1

  // Add code points to strip.
  while (++index < ranges.length) {
    const name = ranges[index]
    const fp = `./${name}/code-points.js`
    const { default: codePoints } = await import(new URL(fp, categoryBase))

    generator.add(codePoints)
  }

  generator
    // Some overlap between letters and Other Symbol.
    .remove(alphabetics)
    // Spaces are turned to `-`
    .remove(' ')
    // Dash is kept.
    .remove('-')

  await fs.writeFile('regex.js', [
    '// This module is generated by `script/`.',
    '/* eslint-disable no-control-regex, no-misleading-character-class, no-useless-escape */',
    'export const regex = ' + generator.toRegExp() + 'g',
    ''
  ].join('\n'))
}