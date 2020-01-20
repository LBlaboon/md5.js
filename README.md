# md5.js
`md5.js` is a JavaScript implementation of the MD5 hash function. It mostly follows the reference implementation published on [Wikipedia](https://en.wikipedia.org/wiki/MD5#Pseudocode).

## Usage
`md5.js` is written as a native JavaScript module (it is **not** a NodeJS module). This is a relatively new feature of JavaScript which is supported by [most major browsers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#Browser_support).
You can import it into other scripts with a statement such as the following: `import { md5 } from "/path/to/md5.js";`

The `md5` function takes an input string and returns a string representing the MD5 hash of the input string.

## Example
`var hash = md5("The quick brown fox jumps over the lazy dog");`
The variable `hash` will contain the string `"9e107d9d372bb6826bd81d3542a419d6"`.
