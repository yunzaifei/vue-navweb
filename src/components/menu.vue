<template>
  <div class="menu table">
    <div class="tb-cell"></div>
    <div class="tb-cell fix">
      <span>云在飞的导航页</span>
      <ul>
        <li>
          <a href="//game.yunzaifei.com" target="_blank">游戏</a>
        </li>
        <li>
          <a href="//yunzaifei.github.io" target="_blank">博客</a>
        </li>
        <li>
          <a href="https://github.com/yunzaifei" target="_blank">GitHub</a>
        </li>
        <li>
          <a href="https://github.com/yunzaifei/vue-navweb" target="_blank">帮助</a>
        </li>
        <li>
          <a href="#" id="login" @click.prevent="emit('openSettings')">设置</a>
        </li>
      </ul>
    </div>
    <div class="tb-cell"></div>
  </div>
</template>

<script setup>
const emit = defineEmits(['openSettings'])
</script>

<style lang="less">
.menu {
  width: 100%;
  min-width: 1000px;
  height: 50px;
  color: #ffffff;
  background-color: #3c4146;
}

.fix {
  width: 1000px;

  span {
    padding: 10px 0 0 0;
    position: fixed;
    font-size: 15px;
  }

  ul {
    float: right;

    li {
      margin: 10px 0 10px 20px;

      a {
        color: #ffffff;
      }

      a:hover {
        color: #bbc3bf;
      }
    }
  }
}
</style>
