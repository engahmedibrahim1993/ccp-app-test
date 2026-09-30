const fs = require('fs');
const crypto = require('crypto');

function extractArrayLiteral(src, startIdx) {
  // startIdx must point at the opening '[' of the array literal.
  // String-literal-aware bracket-depth counter: tracks whether we're inside
  // a JS string (single/double-quoted) and honors backslash escapes, so a
  // ']' or '[' character appearing inside a quoted question/option string
  // never miscounts as a structural bracket.
  let depth = 0;
  let inString = false;
  let quoteChar = null;
  let i = startIdx;
  const n = src.length;
  for (; i < n; i++) {
    const c = src[i];
    if (inString) {
      if (c === '\\') { i++; continue; } // skip escaped char
      if (c === quoteChar) { inString = false; quoteChar = null; }
      continue;
    }
    if (c === '"' || c === "'") { inString = true; quoteChar = c; continue; }
    if (c === '[') { depth++; continue; }
    if (c === ']') {
      depth--;
      if (depth === 0) { return src.slice(startIdx, i + 1); }
      continue;
    }
  }
  throw new Error('Unterminated array literal (never reached depth 0)');
}

function findAndExtractQuestions(filePath) {
  const src = fs.readFileSync(filePath, 'utf8');
  const marker = /^var QUESTIONS\s*=\s*/m;
  const m = marker.exec(src);
  if (!m) throw new Error('QUESTIONS declaration not found');
  const declEnd = m.index + m[0].length;
  if (src[declEnd] !== '[') throw new Error('Expected "[" immediately after "var QUESTIONS =", found: ' + JSON.stringify(src.slice(declEnd, declEnd + 20)));
  const arrayLiteral = extractArrayLiteral(src, declEnd);
  const parsed = JSON.parse(arrayLiteral);
  const hash = crypto.createHash('sha256').update(arrayLiteral, 'utf8').digest('hex');
  return { count: parsed.length, hash, arrayLiteral };
}

const file = process.argv[2];
const result = findAndExtractQuestions(file);
console.log(JSON.stringify({ file, count: result.count, sha256: result.hash }, null, 2));
