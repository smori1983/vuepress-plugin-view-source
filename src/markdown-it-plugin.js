const { Base64 } = require('js-base64');

/**
 * @param {string} markerDefault
 * @param {string} markerContainer
 */
module.exports = (markerDefault, markerContainer) => {
  return (md) => {
    md.block.ruler.before('paragraph', 'playground_view_source', blockRule(markerDefault, markerContainer));
  };
};

/**
 * @param {string} markerDefault
 * @param {string} markerContainer
 */
const blockRule = (markerDefault, markerContainer) => {
  return (state, startLine, endLine, silent) => {
    const lineText = state.src.slice(state.bMarks[startLine], state.eMarks[startLine]);

    let display = null;

    if (lineText === markerDefault) {
      display = 'default';
    } else if (lineText === markerContainer) {
      display = 'container';
    } else {
      return false;
    }

    state.line = startLine + 1;

    const encoded = Base64.encode(state.src);

    const token = new state.Token('html_block', '', 0);
    token.map = [startLine, state.line];
    token.content = `<PlaygroundViewSourceDefault display="${display}">${encoded}</PlaygroundViewSourceDefault>`;
    token.block = true;

    state.tokens.push(token);

    return true;
  };
};
