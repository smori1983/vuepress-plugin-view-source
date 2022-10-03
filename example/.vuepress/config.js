module.exports = {
  title: 'vuepress-plugin-view-source',
  dest: 'example/.vuepress/dist',

  themeConfig: {
    search: false,
    sidebar: [
      {
        title: 'Pages',
        collapsable: false,
        sidebarDepth: 0,
        children: [
          '/pages/entire_page.md',
          '/pages/range.md',
        ],
      },
    ],
  },

  plugins: [
    [require('../../src')],
  ],

  markdown: {
    extendMarkdown: (md) => {
      md.set({ breaks: true });
    },
  },
};
