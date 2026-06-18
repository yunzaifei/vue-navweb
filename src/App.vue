<template>
  <div id="app">
    <NavMenu @open-settings="settingsOpen = true" />
    <NavSearch />
    <NavContent v-model:settings-open="settingsOpen" />
    <NavFooter />
  </div>
</template>

<script setup>
import { shallowRef } from 'vue'
import NavContent from './components/content.vue'
import NavFooter from './components/footer.vue'
import NavMenu from './components/menu.vue'
import NavSearch from './components/search.vue'

const settingsOpen = shallowRef(false)
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}

body {
  background-image: url("/images/body.jpg");
  background-size: cover;
}

a {
  text-decoration: none;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  user-select: none;
  /* Required to make elements draggable in old WebKit */
  -khtml-user-drag: element;
  -webkit-user-drag: element;
}

ul li {
  list-style-type: none;
  float: left;
  cursor: pointer;
}

#app {
  font-family: 'Microsoft YaHei', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.table {
  display: table;
  width: 100%;
  height: 100%;
}

.tb-cell {
  display: table-cell;
}

</style>
