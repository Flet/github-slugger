const { spawnSync } = require('child_process')
const fs = require('fs')
const https = require('https')
const path = require('path')

// Assume the final byte is a newline
function exec (args) {
  const { stdout } = spawnSync(args[0], args.slice(1))
  return stdout.slice(0, -1)
}

for (const dirent of fs.readdirSync(
  path.dirname(require.resolve('unicode-12.1.0/General_Category')),
  { withFileTypes: true }
)) {
  if (dirent.isDirectory()) {
    switch (dirent.name) {
      // These are unions of other categories
      case 'Cased_Letter':
      case 'Letter':
      case 'Mark':
      case 'Number':
      case 'Punctuation':
      case 'Symbol':
      case 'Separator':
      case 'Other':
        break
      default: {
        const text = `${
          dirent.name
        } ${require(`unicode-12.1.0/General_Category/${dirent.name}/symbols.js`).join(
          ''
        )}`
        fs.writeFileSync(path.join(__dirname, dirent.name + '.md'), `# ${text}\n`)
        // Try to scrape the actual slug from GitHub and output a test
        // case
        const branch = exec(['git', 'branch', '--show-current'])
        const remote = exec([
          'git',
          'config',
          `remote.${exec(['git', 'config', `branch.${branch}.remote`])}.url`
        ])
        const req = https.request(
          // e.g. https://github.com/Flet/github-slugger/blob/master/test/General_Category/Close_Punctuation.md
          // Poor man's hosted-git-info
          `${remote.slice(0, -4)}/blob/${branch}/test/General_Category/${
            dirent.name
          }.md`,
          async (res) => {
            let slug = `${dirent.name.toLowerCase()}-`
            let data = Buffer.alloc(0)
            for await (const chunk of res) {
              data = Buffer.concat([data, chunk])
            }
            const result = data.toString().match(`"#${slug}.*?"`)
            if (result) {
              const [match] = result
              slug = match.slice(2, -1)
            }
            fs.writeFileSync(
              path.join(__dirname, dirent.name + '.json'),
              JSON.stringify({ mesg: dirent.name, text, slug }, undefined, 2) +
                '\n'
            )
          }
        )
        req.end()
      }
    }
  }
}
