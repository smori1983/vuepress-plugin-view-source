const { Base64 } = require('js-base64');

module.exports = (md) => {
  md.block.ruler.before('paragraph', 'vuepress_plugin_view_source', entirePage);
  md.block.ruler.before('paragraph', 'vuepress_plugin_view_source_range', range);
};

// Pattern for entire page display:
// - [[source]]
// - [[source:container]]
const regexpEntirePageDisplay = /^\[\[source(:(container))?]]$/;

const entirePage = (state, startLine, endLine, silent) => {
  const lineText = state.src.slice(state.bMarks[startLine], state.eMarks[startLine]);

  const matched = regexpEntirePageDisplay.exec(lineText);

  if (matched === null) {
    return false;
  }

  const display = matched[2] || 'default';

  pushToken(state, startLine, state.src, display);

  state.line = startLine + 1;

  return true;
};

// Pattern for range begin and end:
// - [[source(<id>):begin]]
// - [[source(<id>):end]]
const regexpRangeBeginEnd = /^\[\[source\([\da-z_]+\):(begin|end)]]$/;

// Pattern for range display:
// - [[source(<id>)]]
// - [[source(<id>):container]]
const regexpRangeDisplay = /^\[\[source\(([\da-z_]+)\)(:(container))?]]$/;

const range = (state, startLine, endLine, silent) => {
  const lineText = state.src.slice(state.bMarks[startLine], state.eMarks[startLine]);

  // Do not leave begin and end markers.
  if (regexpRangeBeginEnd.test(lineText)) {
    state.line = startLine + 1;
    return true;
  }

  const matched = regexpRangeDisplay.exec(lineText);

  if (matched === null) {
    return false;
  }

  const id = matched[1];
  const display = matched[3] || 'default';
  const markerBegin = `[[source(${id}):begin]]`;
  const markerEnd = `[[source(${id}):end]]`;

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
    pushToken(state, startLine, state.src.slice(rangeBegin, rangeEnd).trim(), display);
  }

  state.line = startLine + 1;

  return true;
};

const pushToken = (state, line, content, display) => {
  const encoded = Base64.encode(content);

  const token = new state.Token('html_block', '', 0);
  token.map = [line, line + 1];
  token.content = `<PluginViewSourceDefault display="${display}">${encoded}</PluginViewSourceDefault>`;
  token.block = true;

  state.tokens.push(token);
};
