import { promises as fs } from 'node:fs'
import { Octokit } from '@octokit/rest'
import fetch from 'node-fetch'
import { unified } from 'unified'
import rehypeParse from 'rehype-parse'
import { select, selectAll } from 'hast-util-select'
import { toMarkdown } from 'mdast-util-to-markdown'
import { gfmToMarkdown } from 'mdast-util-gfm'

// Note: the GH token needs `gists` access!
const ghToken = process.env.GH_TOKEN || process.env.GITHUB_TOKEN

if (!ghToken) {
  throw new Error('Missing GitHub token: expected `GH_TOKEN` in env')
}

const octo = new Octokit({ auth: 'token ' + ghToken })
const categoryBase = new URL('../node_modules/@unicode/unicode-13.0.0/General_Category/', import.meta.url)

// Take up to N samples from each category.
const samples = 400

const otherTests = [
  { name: 'Basic usage', input: 'alpha' },
  { name: 'Basic usage (again)', input: 'alpha' },
  { name: 'Camelcase', input: 'bravoCharlieDelta' },
  { name: 'Prototypal injection: proto', input: '__proto__' },
  { name: 'Prototypal injection: proto (again)', input: '__proto__' },
  { name: 'Prototypal injection: has own', input: 'hasOwnProperty' },
  { name: 'Repetition (1)', input: 'echo' },
  { name: 'Repetition (2)', input: 'echo' },
  { name: 'Repetition (3)', input: 'echo 1' },
  { name: 'Repetition (4)', input: 'echo-1' },
  { name: 'Repetition (5)', input: 'echo' },
  { name: 'More repetition (1)', input: 'foxtrot-1' },
  { name: 'More repetition (2)', input: 'foxtrot' },
  { name: 'More repetition (3)', input: 'foxtrot' },
  { name: 'Characters: dash', input: 'heading with a - dash' },
  { name: 'Characters: underscore', input: 'heading with an _ underscore' },
  { name: 'Characters: dot', input: 'heading with a period.txt' },
  { name: 'Characters: dots, parents, brackets', input: 'exchange.bind_headers(exchange, routing [, bindCallback])' },
  { name: 'Characters: space', input: ' ', markdownOverwrite: '# &#x20;' },
  { name: 'Characters: initial space', input: ' a', markdownOverwrite: '# &#x20;a' },
  { name: 'Characters: final space', input: 'a ', markdownOverwrite: '# a&#x20;' },
  { name: 'Characters: initial and final spaces', input: ' a ', markdownOverwrite: '# &#x20;a&#x20;' },
  { name: 'Characters: initial and final dashes', input: '-a-' },
  { name: 'Characters: apostrophe', input: 'apostrophe’s should be trimmed' },
  { name: 'Some more duplicates (1)', input: 'golf' },
  { name: 'Some more duplicates (2)', input: 'golf' },
  { name: 'Some more duplicates (3)', input: 'golf' },
  { name: 'Non-ascii: ♥', input: 'I ♥ unicode' },
  { name: 'Non-ascii: -', input: 'dash-dash' },
  { name: 'Non-ascii: –', input: 'en–dash' },
  { name: 'Non-ascii: –', input: 'em–dash' },
  { name: 'Non-ascii: 😄', input: '😄 unicode emoji' },
  { name: 'Non-ascii: 😄-😄', input: '😄-😄 unicode emoji' },
  { name: 'Non-ascii: 😄_😄', input: '😄_😄 unicode emoji' },
  { name: 'Non-ascii: 😄', input: '😄 - an emoji' },
  { name: 'Non-ascii: :smile:', input: ':smile: - a gemoji' },
  { name: 'Non-ascii: Cyrillic (1)', input: 'Привет' },
  { name: 'Non-ascii: Cyrillic (2)', input: 'Профили пользователей' },
  { name: 'Non-ascii: Cyrillic + Han', input: 'Привет non-latin 你好' },
  { name: 'Gemoji (1)', input: ':ok: No underscore' },
  { name: 'Gemoji (2)', input: ':ok_hand: Single' },
  { name: 'Gemoji (3)', input: ':ok_hand::hatched_chick: Two in a row with no spaces' },
  { name: 'Gemoji (4)', input: ':ok_hand: :hatched_chick: Two in a row' }
]

main()

async function main () {
  const files = await fs.readdir(categoryBase)
  const tests = [...otherTests]
  let index = -1

  // Create a test case with a bunch of examples.
  while (++index < files.length) {
    const name = files[index]

    if (name === 'index.js') continue

    // These result in Git(Hub) thinking it’s a binary file.
    if (name === 'Control' || name === 'Surrogate') continue

    // This prevents GH from rendering markdown to HTML.
    if (name === 'Other') continue

    const fp = `./${name}/code-points.js`
    const { default: codePoints } = await import(new URL(fp, categoryBase))
    const subs = []

    let n = -1

    while (++n < samples) {
      subs.push(codePoints[Math.floor(codePoints.length / samples * n)])
    }

    subs.push(codePoints[codePoints.length - 1])

    tests.push({ name, input: 'a' + [...new Set(subs)].map(d => String.fromCodePoint(d)).join(' ') + 'b' })
  }

  // Create a Gist.
  const filename = 'readme.md'
  const gistResult = await octo.gists.create({
    files: {
      [filename]: {
        content: tests.map(d => {
          return d.markdownOverwrite || toMarkdown({ type: 'heading', depth: 1, children: [{ type: 'text', value: d.input }] }, { extensions: [gfmToMarkdown()] })
        }).join('\n\n')
      }
    }
  })

  const file = gistResult.data.files[filename]

  if (!file.language) {
    throw new Error('The generated markdown was seen as binary data instead of text by GitHub. This is likely because there are weird characters (such as control characters or lone surrogates) in it')
  }

  // Fetch the rendered page.
  const response = await fetch(gistResult.data.html_url, {
    headers: { Authorization: 'token ' + ghToken }
  })

  const doc = await response.text()

  // Remove the Gist.
  await octo.gists.delete({ gist_id: gistResult.data.id })

  const tree = unified().use(rehypeParse).parse(doc)
  const markdownBody = select('.markdown-body', tree)

  if (!markdownBody) {
    throw new Error('The generated markdown could not be rendered by GitHub as HTML. This is likely because there are weird characters in it')
  }

  const anchors = selectAll('h1 .anchor', markdownBody)

  anchors.forEach((node, i) => {
    tests[i].expected = node.properties.href.slice(1)
  })

  await fs.writeFile(new URL('../test/fixtures.json', import.meta.url), JSON.stringify(tests, null, 2) + '\n')
}
