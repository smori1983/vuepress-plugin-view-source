<template>
  <div class="vuepress-plugin-view-source">
    <template v-if="display === 'container'">
      <details class="custom-block details">
        <summary>Source</summary>
        <pre class="source">{{ source }}</pre>
      </details>
    </template>
    <template v-else>
      <pre class="source">{{ source }}</pre>
    </template>
  </div>
</template>

<script>
import { Base64 } from 'js-base64';

export default {
  props: {
    display: {
      type: String,
      required: false,
      default: 'default',
    },
  },
  data() {
    return {
      source: '',
    };
  },
  mounted() {
    this.source = Base64.decode(this.$slots.default[0].text);
  }
};
</script>

<style lang="stylus" scoped>
.vuepress-plugin-view-source {
  .source {
    background-color $codeBgColor
    color: white
  }
}
</style>
