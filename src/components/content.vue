<template>
    <div class="content">
        <div class="table all">
            <div class="tb-cell"></div>
            <div class="center">
                <div class="edit">
                    <span class="icon-plus" title="新增" @click="showModifyModal('add')"></span>
                    <span class="icon-wrench" title="编辑" @click="showEdit"></span>
                </div>
                <template v-for="(group, groupIndex) in webgroup" :key="group.description">
                    <div class="web-group">
                        <div class="web-des" draggable="true"
                        @dragstart="dragStart($event, groupIndex)" 
                        @dragover="dragOver($event)" @dragleave="dragLeave($event)" 
                        @drop="drop($event, groupIndex)">
                            {{group.description}}
                        </div>
                        <div class="webs">
                            <ul>
                                <li class="li-drag" v-for="(web, webIndex) in group.webs" :key="`${group.description}-${web.url}-${webIndex}`" draggable="true"
                                @dragstart="dragStart($event, groupIndex, webIndex)" 
                                @dragover="dragOver($event)" @dragleave="dragLeave($event)" 
                                @drop="drop($event, groupIndex, webIndex)">
                                    <img class="web-fav" :src="'http://www.google.com/s2/favicons?domain='+web.url" >
                                    <a :href="web.url" target="_blank">{{web.description}}</a>
                                    <span class="icon-pencil opacity" title="修改" v-if="isEdit" @click="showModifyModal('update', groupIndex, webIndex)"></span>
                                    <span class="icon-bin opacity" title="删除" v-if="isEdit" @click="delWeb(groupIndex, webIndex)"></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </template>
            </div>
            <div class="tb-cell"></div>
        </div>
        
        <div id="gistModal" v-show="settingsOpen" class="modal">
            <div class="modal-content">
                <span class="close" @click="settingsOpen = false">&times;</span>
                创建<a href="https://github.com/settings/tokens" target="_blank">GitHub token</a> 
                <br><br>
                提交token创建新的Gist: <input class="input_long" type="text" v-model="token" /> 
                <input class="input_btn" type="button" value="提交" @click="creatGist" />
                <br><br>
                已生成Gist，对它进行手动 <label><input type="checkbox" v-model="isGist" >编辑</label>
                <div v-show="isGist">
                    <br>
                    请输入GitHubGists ID：<input class="input_long" type="text" :disabled="!isGist" v-model="gistID" />
                    <br><br>
                    请输入filename：<input class="input_normal" type="text" :disabled="!isGist" v-model="filename" /> 
                    <input class="input_btn" type="button" value="修改" :disabled="!isGist" @click="setGistID" />
                </div>
            </div>
        </div>
        <div id="modifyModal" v-show="isModifyOpen" class="modal">
            <div class="modal-content">
                <span class="close" @click="isModifyOpen = false">&times;</span>
                <datalist id="group_list">
                    <option v-for="group in grouplist" :key="group" :value="group" />
                </datalist>
                选择分类：<input id="group_description" class="input_normal" type="text" list="group_list" v-model="modifyWeb.groupDescription" />     
                <br>
                <br>
                描述：<input id="web_description" class="input_normal" type="text" v-model="modifyWeb.webDescription" />
                网址：<input id="web_url" class="input_long" type="text" v-model="modifyWeb.webUrl" />
                <input class="input_btn" type="button" value="提交" @click="modifyModal" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, shallowRef } from 'vue'
import axios from 'axios'
import { applyWebEdit, buildGroupList, moveGroup, moveWeb } from '../utils/webgroup'

let gIndex_start = undefined
let wIndex_start = undefined
let gIndex_end = undefined
let wIndex_end = undefined
let dragType = ''

const settingsOpen = defineModel('settingsOpen', { type: Boolean, default: false })

const webgroup = ref([])
const gistID = shallowRef('')
const filename = shallowRef('')
const token = shallowRef('')
const isGist = shallowRef(false)
const isEdit = shallowRef(false)
const isModifyOpen = shallowRef(false)
const modifyWeb = reactive({
    type: 'add',
    groupIndex: -1,
    webIndex: -1,
    groupDescription: '',
    webDescription: '',
    webUrl: ''
})

const grouplist = computed(() => buildGroupList(webgroup.value))

onMounted(() => {
    getGistID()
    fetchData()
})

function fetchData(){
    if(gistID.value){
        let seconds = (new Date() - new Date(localStorage.getItem('updatetime')))/1000
        let data = localStorage.getItem('content')
        if(seconds > 60){
            axios.get('https://api.github.com/gists/' + gistID.value)
            .then(function(res){
                data = res.data.files[filename.value].content
                setData(data)
            })
            .catch(function(err){
                console.log('fetchData error: '+err)
            })
        }else{
            setData(data)
        }
    }
}

function setData(data){
    webgroup.value = JSON.parse(data)
}

function getGistID(){
    gistID.value = localStorage.getItem('gistID') || ''
    filename.value = localStorage.getItem('filename') || ''
    token.value = localStorage.getItem('token') || ''
}

function setGistID(){
    if(gistID.value && filename.value && token.value){
        localStorage.setItem('gistID', gistID.value)
        localStorage.setItem('filename', filename.value)
        localStorage.setItem('token', token.value)
    }
    fetchData()
    settingsOpen.value = false
}

function showModifyModal(type, groupIndex, webIndex){
    modifyWeb.type = type
    if(type === "add"){
        modifyWeb.groupIndex = -1
        modifyWeb.webIndex = -1
        modifyWeb.groupDescription = ''
        modifyWeb.webDescription = ''
        modifyWeb.webUrl = ''
    }else if(type === "update"){
        modifyWeb.groupIndex = groupIndex
        modifyWeb.webIndex = webIndex
        modifyWeb.groupDescription = webgroup.value[groupIndex].description
        modifyWeb.webDescription = webgroup.value[groupIndex].webs[webIndex].description
        modifyWeb.webUrl = webgroup.value[groupIndex].webs[webIndex].url
    }
    isModifyOpen.value = true
}

function delWeb(groupIndex, webIndex){
    let webs = webgroup.value[groupIndex].webs
    let isDel = confirm('确定删除网站<' + webs[webIndex].description + '>?')
    if(isDel){
        if(webs.length == 1){
            webgroup.value.splice(groupIndex, 1)
        }else{
            webs.splice(webIndex, 1)
        }
        updateGist()
    }
}

function modifyModal(){
    let groupDescription = modifyWeb.groupDescription.toString().replace(/\s+/g,"")
    if(!groupDescription || groupDescription == ''){
        return alert("网站分类不能为空！")
    }
    let webDescription = modifyWeb.webDescription.toString().replace(/\s+/g,"")
    if(!webDescription || webDescription == ''){
        return alert("网站描述不能为空！")
    }
    let webUrl = modifyWeb.webUrl.toString().replace(/\s+/g,"")
    if(!webUrl || webUrl == ''){
        return alert("网站网址不能为空！")
    }

    webgroup.value = applyWebEdit(webgroup.value, modifyWeb)
    updateGist()
    isModifyOpen.value = false
}

function showEdit(){
    isEdit.value = !isEdit.value
}

function creatGist(){
    let updateTime = new Date()
    localStorage.setItem('updatetime', updateTime)
    let content = '[{"description":"论坛","webs":[{"url":"https://github.com","description":"GitHub"}]},{"description":"工具","webs":[{"url":"https://gist.github.com/","description":"GitHub Gists"}]}]'
    localStorage.setItem('content', content)
    localStorage.setItem('token', token.value)
    filename.value = 'webgroup'
    localStorage.setItem('filename', filename.value)
    axios({
        url: 'https://api.github.com/gists',
        method: 'POST',
        headers: {Authorization: "token " + token.value},
        data: {
            description: "创建新的gist，创建时间：" + updateTime,
            public: false,
            files:{
                webgroup: {
                    content: content
                }
            }
        }
    }).then(function(res){
        gistID.value = res.data.id
        let data = res.data.files[filename.value].content
        setData(data)
        localStorage.setItem('gistID', gistID.value)
    }).catch(function(err){
        console.log('creatGist error: '+err)
    })

    settingsOpen.value = false
}

function updateGist(){
    let updateTime = new Date()
    let content = JSON.stringify(webgroup.value)
    localStorage.setItem('updatetime', updateTime)
    localStorage.setItem('content', content)
    axios({
        url: 'https://api.github.com/gists/' + gistID.value,
        method: 'PATCH',
        headers: {Authorization: "token " + token.value},
        data: {
            description: "修改时间：" + updateTime,
            files:{
                [filename.value]: {
                    content: content
                }
            },
            content: content
        }
    }).then(function(){
        fetchData()
    }).catch(function(err){
        console.log('updateGist error: '+err)
    })
}

function dragStart(event, groupIndex, webIndex) {
    gIndex_start = groupIndex
    wIndex_start = webIndex
    dragType = event.currentTarget.nodeName
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/html', event.currentTarget.outerHTML)

    event.currentTarget.classList.add('drag')
}

function dragOver(event) {
    if (event.preventDefault) {
        event.preventDefault()
    }
    let type = event.currentTarget.nodeName
    if(dragType === type){
        if(type === 'LI'){
            event.currentTarget.classList.add('over-left')
        }else{
            event.currentTarget.classList.add('over-top')
        }
        event.dataTransfer.dropEffect = 'move'
    }
    return false
}

function dragLeave(event) {
    let type = event.currentTarget.nodeName
    if(dragType === type){
        if(type === 'LI'){
            event.currentTarget.classList.remove('over-left')
        }else{
            event.currentTarget.classList.remove('over-top')
        }
        event.currentTarget.classList.remove('drag')
    }
}

function drop(event, groupIndex, webIndex) {
    if (event.stopPropagation) {
        event.stopPropagation()
    }
    let type = event.currentTarget.nodeName
    if(dragType === type){
        gIndex_end = groupIndex
        wIndex_end = webIndex
        if(type === 'LI'){
            webgroup.value = moveWeb(webgroup.value, {
                fromGroupIndex: gIndex_start,
                fromWebIndex: wIndex_start,
                toGroupIndex: gIndex_end,
                toWebIndex: wIndex_end,
            })
        }else{
            webgroup.value = moveGroup(webgroup.value, gIndex_start, gIndex_end)
        }

        if(type === 'LI'){
            event.currentTarget.classList.remove('over-left')
        }else{
            event.currentTarget.classList.remove('over-top')
        }
        event.currentTarget.classList.remove('drag')

        updateGist()
    }

    return false
}
</script>

<style lang="less">
    @import '../style/content.less';
</style>
