# vuepress-plugin-view-source


VuePress plugin to display markdown source in the page.

Visit [online demo](https://smori1983.github.io/vuepress-plugin-view-source-demo/).


## Overview

This plugin is useful when you need to display markdown source in the page.


## Markdown notations

| type        | notation                     | description                                     |
|-------------|------------------------------|-------------------------------------------------|
| entire page | `[[source]]`                 | Display source of entire page.                  |
|             | `[[source:container]]`       | Display source of entire page as container.     |
| range       | `[[source(<id>):begin]]`     | Beginning line for source identified by `<id>`. |
|             | `[[source(<id>):end]]`       | Ending line for source identified by `<id>`.    |
|             | `[[source(<id>)]]`           | Display source for `<id>`.                      |
|             | `[[source(<id>):container]]` | Display source for `<id>` as container.         |

### `<id>`

Available characters: lowercase alphabets, digits, underscore.
