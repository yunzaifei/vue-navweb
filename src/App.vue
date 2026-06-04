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
  @import './style/app.less';
</style>
