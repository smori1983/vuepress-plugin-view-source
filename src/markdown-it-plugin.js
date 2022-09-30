const { Base64 } = require('js-base64');

/**
 * @param {string} markerDefault
 * @param {string} markerContainer
 */
module.exports = (markerDefault, markerContainer) => {
  return (md) => {
    md.block.ruler.before('paragraph', 'vuepress_plugin_view_source', entirePage(markerDefault, markerContainer));
    md.block.ruler.before('paragraph', 'vuepress_plugin_view_source_range', range);
  };
};

/**
 * @param {string} markerDefault
 * @param {string} markerContainer
 */
const entirePage = (markerDefault, markerContainer) => {
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
    token.content = `<PluginViewSourceDefault display="${display}">${encoded}</PluginViewSourceDefault>`;
    token.block = true;

    state.tokens.push(token);

    return true;
  };
};

// '[[source:<id>:begin]]' and '[[source:<id>:end]]'
const regexpBeginEnd = /^\[\[source:[\da-z_]+:(begin|end)]]$/;

// '[[source:<id>:show]]'
const regexpOutput = /^\[\[source:([\da-z_]+):show]]$/;

const range = (state, startLine, endLine, silent) => {
  const lineText = state.src.slice(state.bMarks[startLine], state.eMarks[startLine]);

  // Do not leave begin and end markers.
  if (regexpBeginEnd.test(lineText)) {
    state.line = startLine + 1;
    return true;
  }

  let matched;
  if ((matched = regexpOutput.exec(lineText)) !== null) {
    const id = matched[1];
    const markerBegin = `[[source:${id}:begin]]`;
    const markerEnd = `[[source:${id}:end]]`;

    let rangeBegin;
    let rangeEnd;

    // Find begin and end marker again.
    for (let line = 0; line <= state.lineMax; line++) {
      const text = state.src.slice(state.bMarks[line], state.eMarks[line]);

      if (text === markerBegin) {
        rangeBegin = state.eMarks[line] + 1;
      }

      if (text === markerEnd) {
        rangeEnd = state.bMarks[line] - 1;
      }
    }

    if (typeof rangeBegin === 'number' && typeof rangeEnd === 'number' && rangeBegin < rangeEnd) {
      const content = state.src.slice(rangeBegin, rangeEnd).trim();
      const encoded = Base64.encode(content);

      const token = new state.Token('html_block', '', 0);
      token.map = [startLine, state.line];
      token.content = `<PluginViewSourceDefault display="default">${encoded}</PluginViewSourceDefault>`;
      token.block = true;

      state.tokens.push(token);
    }

    state.line = startLine + 1;

    return true;
  }

  return false;
};
