# vuepress-plugin-view-source


VuePress plugin to display markdown source in the page.

Visit [online demo](https://smori1983.github.io/vuepress-plugin-view-source-demo/).


## Overview

This plugin is useful when you need to display markdown source in the page.


## Markdown notations

There are 2 types of notations provided on how to display the source.

| type        | notation                     | description                                                |
|-------------|------------------------------|------------------------------------------------------------|
| entire page | `[[source]]`                 | Display source of entire page.                             |
|             | `[[source:container]]`       | Display source of entire page as container.                |
| range       | `[[source(<id>):begin]]`     | Specify beginning line.                                    |
|             | `[[source(<id>):end]]`       | Specify ending line.                                       |
|             | `[[source(<id>)]]`           | Display source between begin and end markers.              |
|             | `[[source(<id>):container]]` | Display source between begin and end markers as container. |

### `<id>`

It is necessary to define id to identify begin and end markers in the markdown file.

Available characters: lowercase alphabets, digits, underscore.
