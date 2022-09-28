/**
 * @typedef {import('vuepress-types').PluginOptionAPI} PluginOptionAPI
 */

const path = require('path');

/**
 * @param {Object} options
 * @return {PluginOptionAPI}
 */
module.exports = (options) => {
  const {
    markerDefault = '[[source]]',
    markerContainer = '[[source:container]]',
  } = options;

  return {
    name: 'playground-view-source',
    enhanceAppFiles: [
      path.resolve(__dirname, 'enhanceAppFile.js'),
    ],
    extendMarkdown: (md) => {
      md.use(require('./markdown-it-plugin')(markerDefault, markerContainer));
    },
  };
};
