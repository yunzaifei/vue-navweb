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
.search {
  width: 100%;
  min-width: 700px;
  text-align: center;
  margin: 30px 0 10px 0;
}

.search-text {
  width: 559px;
  height: 34px;
}

.search-button {
  width: 50px;
  height: 38px;
}
</style>
