export function lastFindInArray (array, callback) {
  for (let i = array.length - 1; i >= 0; --i) {
    if (callback(array[i], i, array)) {
      return array[i]
    }
  }
}

export function escapeHtmlCharacters (html, opt = { detectCodeBlock: false }) {
  const matchHtmlRegExp = /["'&<>]/g
  const matchCodeBlockRegExp = /```/g
  const escapes = ['&quot;', '&amp;', '&#39;', '&lt;', '&gt;']
  let match = null
  const replaceAt = (str, index, replace) =>
    str.substr(0, index) +
    replace +
    str.substr(index + replace.length - (replace.length - 1))

  while ((match = matchHtmlRegExp.exec(html)) !== null) {
    const current = { char: match[0], index: match.index }
    const codeBlockIndexs = []
    let openCodeBlock = null
    if (opt.detectCodeBlock) {
      // position of the nearest line start
      let previousLineEnd = current.index - 1
      while (html[previousLineEnd] !== '\n' && previousLineEnd !== -1) {
        previousLineEnd--
      }
      // 4 spaces means this character is in a code block
      if (
        html[previousLineEnd + 1] === ' ' &&
        html[previousLineEnd + 2] === ' ' &&
        html[previousLineEnd + 3] === ' ' &&
        html[previousLineEnd + 4] === ' '
      ) {
        // so skip it
        continue
      }
      // if the character is in ``` means, it's in a code block
      // detecting code block
      while ((openCodeBlock = matchCodeBlockRegExp.exec(html)) !== null) {
        codeBlockIndexs.push(openCodeBlock.index)
      }
      let shouldSkipChar = false
      for (let i = 0; i < codeBlockIndexs.length; i += 2) {
        // this is an open ``` so index is the first ` and + 2 is the last `
        // the second index is the closing ``` so the char must less than it
        if (
          current.index > codeBlockIndexs[i] + 2 &&
          current.index < codeBlockIndexs[i + 1]
        ) {
          // skip it
          shouldSkipChar = true
          break
        }
      }
      if (shouldSkipChar) {
        continue
      }
    }
    // otherwise, escape it !!!
    if (current.char === '&') {
      let nextStr = ''
      let nextIndex = current.index
      let escapedStr = false
      // maximum length of an escape string is 5. For example ('&quot;')
      while (nextStr.length <= 5) {
        nextStr += html[nextIndex]
        nextIndex++
        if (escapes.indexOf(nextStr) !== -1) {
          escapedStr = true
          break
        }
      }
      if (!escapedStr) {
        // this & char is not a part of an escaped string
        html = replaceAt(html, current.index, '&amp;')
      }
    } else if (current.char === '"') {
      html = replaceAt(html, current.index, '&quot;')
    } else if (current.char === "'") {
      html = replaceAt(html, current.index, '&#39;')
    } else if (current.char === '<') {
      html = replaceAt(html, current.index, '&lt;')
    } else if (current.char === '>') {
      html = replaceAt(html, current.index, '&gt;')
    }
  }
  return html
}

export function isObjectEqual (a, b) {
  const aProps = Object.getOwnPropertyNames(a)
  const bProps = Object.getOwnPropertyNames(b)

  if (aProps.length !== bProps.length) {
    return false
  }

  for (var i = 0; i < aProps.length; i++) {
    const propName = aProps[i]
    if (a[propName] !== b[propName]) {
      return false
    }
  }
  return true
}

export default {
  lastFindInArray,
  escapeHtmlCharacters,
  isObjectEqual
}
