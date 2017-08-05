<template>
    <div class="menu table">
        <div class="tb-cell"></div>
        <div class="tb-cell fix">
            <span>利用GitHubGist自定义导航页</span>
            <ul>
                <li>
                    <a href="https://gist.github.com/" target="_blank">GitHubGist</a>
                </li>
                <li>
                    <a href="https://developer.github.com/v3/gists" target="_blank">Gists API</a>
                </li>
                <li>
                    <a href="#" target="_blank">Help</a>
                </li>
                <li>
                    <a href="#" id="login"  @click="openModal">Setting</a>
                </li>
            </ul>
        </div>
        <div class="tb-cell"></div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'menu',
    methods: {
        openModal(){
            let modal = document.getElementById('gistModal');
            modal.style.display = "block";
        }
    }
}
</script>

<style lang="stylus">
    @import '../style/menu'
</style>