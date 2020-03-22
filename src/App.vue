<template>
  <div id="app">
    <component :is="layout">
      <router-view></router-view>
    </component>
  </div>
</template>

<script>
const deafult_layout = 'default'

export default {
  computed: {
    layout() {
      return (this.$route.meta.layout || deafult_layout) + '-layout'
    }
  }
}
</script>

<style lang="scss">
@import "assets/scss/app";

#app,
.main {
  height: 100%;
}
</style>