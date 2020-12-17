const fs = require('fs')
const path = require('path')

const regenerate = require('regenerate')

const set = regenerate()
  .add(require('unicode-12.1.0/General_Category/Close_Punctuation/code-points.js'))
  .add(require('unicode-12.1.0/General_Category/Control/code-points.js'))
  .add(require('unicode-12.1.0/General_Category/Currency_Symbol/code-points.js'))
  .add(require('unicode-12.1.0/General_Category/Dash_Punctuation/code-points.js'))
  .remove('-') // Except Hyphen-Minus
  .add(require('unicode-12.1.0/General_Category/Final_Punctuation/code-points.js'))
  .add(require('unicode-12.1.0/General_Category/Format/code-points.js'))
  .add(require('unicode-12.1.0/General_Category/Initial_Punctuation/code-points.js'))
  .add(require('unicode-12.1.0/General_Category/Line_Separator/code-points.js'))
  .add(require('unicode-12.1.0/General_Category/Math_Symbol/code-points.js'))
  .add(require('unicode-12.1.0/General_Category/Modifier_Symbol/code-points.js'))
  .add(require('unicode-12.1.0/General_Category/Open_Punctuation/code-points.js'))
  .add(require('unicode-12.1.0/General_Category/Other_Number/code-points.js'))
  .add(require('unicode-12.1.0/General_Category/Other_Punctuation/code-points.js'))
  .add(require('unicode-12.1.0/General_Category/Other_Symbol/code-points.js'))
  .add(require('unicode-12.1.0/General_Category/Paragraph_Separator/code-points.js'))
  .add(require('unicode-12.1.0/General_Category/Private_Use/code-points.js'))
  .add(require('unicode-12.1.0/General_Category/Surrogate/code-points.js'))
  .add(require('unicode-12.1.0/General_Category/Unassigned/code-points.js'))

console.log(`/${set.toString()}/g`)
// Then you might want to use a template like this to write the result to a file, along with any regex flags you might need:
// const regex = /<%= set.toString() %>/gim;

fs.writeFileSync(path.resolve('..', '_generated_unicode_regex.js'), `
/* *********************** *\\
 * DO NOT EDIT THIS FILE!
 * It was generated by script/generate-regex.js! Edit the script and run it again instead!
\\* *********************** */

module.exports = function () {
  return /${set.toString()}/g
}
`)
