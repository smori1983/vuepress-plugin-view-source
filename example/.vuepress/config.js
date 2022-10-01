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
          '/pages/page_01.md',
          '/pages/page_02.md',
          '/pages/page_03.md',
          '/pages/page_04.md',
          '/pages/page_05.md',
          '/pages/page_06.md',
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
