const { Base64 } = require('js-base64');

module.exports = (md) => {
  md.block.ruler.before('paragraph', 'vuepress_plugin_view_source', blockRule);
};

const blockRule = (state, startLine) => {
  const rules = [
    entirePage,
    rangeBeginEnd,
    range,
  ];

  const lineText = state.src.slice(state.bMarks[startLine], state.eMarks[startLine]);

  for (let i = 0; i < rules.length; i++) {
    if (rules[i](state, startLine, lineText)) {
      return true;
    }
  }

  return false;
};

// Pattern for entire page display:
// - [[source]]
// - [[source:container]]
const regexpEntirePageDisplay = /^\[\[source(:(container))?]]$/;

const entirePage = (state, startLine, lineText) => {
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

/**
 * Do not leave begin and end markers.
 */
const rangeBeginEnd = (state, startLine, lineText) => {
  if (regexpRangeBeginEnd.test(lineText)) {
    state.line = startLine + 1;

    return true;
  }

  return false;
};

// Pattern for range display:
// - [[source(<id>)]]
// - [[source(<id>):container]]
const regexpRangeDisplay = /^\[\[source\(([\da-z_]+)\)(:(container))?]]$/;

const range = (state, startLine, lineText) => {
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
      continue;
    }

    if (text === markerEnd) {
      rangeEnd = state.bMarks[line] - 1;
      break;
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
