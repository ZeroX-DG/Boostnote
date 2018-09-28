'use strict'

module.exports = function audioPlugin (md) {
  function audio (state, startLine) {
    const audioSouceRegex = /^@\((.*?)\)/
    let token = null
    let ch = null
    const pos = state.bMarks[startLine] + state.tShift[startLine]
    const max = state.eMarks[startLine]

    // if it's indented more than 3 spaces, it should be a code block
    if (state.sCount[startLine] - state.blkIndent >= 4) { return false }

    ch = state.src.charCodeAt(pos)

    if (ch !== 0x40/* @ */ || pos >= max) { return false }
    state.line = startLine + 1
    token = state.push('audio')
    const src = audioSouceRegex.exec(
      state.src.substring(state.bMarks[startLine], state.eMarks[state.line])
    )[1]
    token.src = src
    return true
  }

  function audioRender (tokens, idx) {
    const token = tokens[idx]
    return `<div class='audio-player' data-src='${token.src}'></div>`
  }

  md.block.ruler.before('paragraph', 'audio', audio, {
    alt: ['paragraph', 'reference', 'blockquote']
  })

  md.renderer.rules['audio'] = audioRender
}
