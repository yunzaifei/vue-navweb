<template>
  <div class="search">
    <!--如果不能访问Google，请将action中网址改为百度或其他-->
    <form v-if="isGoogle" method="get" action="https://www.google.com/search" target="_blank">
      <input class="search-text" type="text" name="q" />
      <input class="search-button" type="submit" value="搜索" />
    </form>
  </div>
</template>

<script setup>
const isGoogle = true
</script>

<style lang="less">
@import '../style/search.less';
</style>
