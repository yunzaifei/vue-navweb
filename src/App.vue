<template>
  <div id="app">
    <v-menu></v-menu>
    <v-search></v-search>
    <v-content></v-content>
  </div>
</template>

<script>
import vMenu from './components/menu.vue'
import vSearch from './components/search.vue'
import vContent from './components/content.vue'

export default {
  name: 'app',
  components: {
    vMenu,
    vSearch,
    vContent
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style lang="stylus">
  @import 'style/app'
</style>
