<template>
  <div id="app">
    <v-menu></v-menu>
    <v-search></v-search>
    <v-content></v-content>
    <v-footer></v-footer>
  </div>
</template>

<script>
import vMenu from './components/menu.vue'
import vSearch from './components/search.vue'
import vContent from './components/content.vue'
import vFooter from './components/footer'

export default {
  name: 'app',
  components: {
    vMenu,
    vSearch,
    vContent,
    vFooter
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
