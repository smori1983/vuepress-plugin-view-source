const { Base64 } = require('js-base64');

module.exports = (md) => {
  md.block.ruler.before('paragraph', 'vuepress_plugin_view_source', entirePage);
  md.block.ruler.before('paragraph', 'vuepress_plugin_view_source_range', range);
};

// '[[source]]' and '[[source:container]]'
const regexpEntirePage = /^\[\[source(:(container))?]]$/;

const entirePage = (state, startLine, endLine, silent) => {
  const lineText = state.src.slice(state.bMarks[startLine], state.eMarks[startLine]);

  let matched;
  if ((matched = regexpEntirePage.exec(lineText)) === null) {
    return false;
  }

  const display = matched[2] || 'default';

  state.line = startLine + 1;

  const encoded = Base64.encode(state.src);

  const token = new state.Token('html_block', '', 0);
  token.map = [startLine, state.line];
  token.content = `<PluginViewSourceDefault display="${display}">${encoded}</PluginViewSourceDefault>`;
  token.block = true;

  state.tokens.push(token);

  return true;
};

// '[[source:<id>:begin]]' and '[[source:<id>:end]]'
const regexpBeginEnd = /^\[\[source:[\da-z_]+:(begin|end)]]$/;

// '[[source:<id>:show]]' or '[[source:<id>:show:container]]'
const regexpOutput = /^\[\[source:([\da-z_]+):show(:(container))?]]$/;

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
    const display = matched[3] || 'default';
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
      token.content = `<PluginViewSourceDefault display="${display}">${encoded}</PluginViewSourceDefault>`;
      token.block = true;

      state.tokens.push(token);
    }

    state.line = startLine + 1;

    return true;
  }

  return false;
};
