<template>
    <div class="menu table">
        <div class="tb-cell"></div>
        <div class="tb-cell fix">
            <span>云在飞的导航页</span>
            <ul>
                <li>
                    <a href="http://yunzaifei.github.io/" target="_blank">博客</a>
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

<style lang="stylus">
    @import '../style/menu'
</style>
