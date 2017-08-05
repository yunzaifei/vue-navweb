<template>
    <div class="content">
        <div class="table all">
            <div class="tb-cell"></div>
            <div class="center">
                <div class="edit">
                    <span class="icon-plus" title="新增" @click="showModifyModal('add')"></span>
                    <span class="icon-wrench" title="编辑" @click="showEdit"></span>
                </div>
                <template v-for="(group, groupIndex) in webgroup">
                    <div class="web-group">
                        <div class="web-des" draggable="true"
                        @dragstart="dragStart($event, groupIndex)" 
                        @dragover="dragOver($event)" @dragleave="dragLeave($event)" 
                        @drop="drop($event, groupIndex)">
                            {{group.description}}
                        </div>
                        <div class="webs">
                            <ul>
                                <li class="li-drag" v-for="(web, webIndex) in group.webs" draggable="true" 
                                @dragstart="dragStart($event, groupIndex, webIndex)" 
                                @dragover="dragOver($event)" @dragleave="dragLeave($event)" 
                                @drop="drop($event, groupIndex, webIndex)">
                                    <img class="web-fav" :src="'https://api.byi.pw/favicon/?url='+web.url" :alt="web.description">
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
        
        <div id="gistModal" class="modal">
            <div class="modal-content">
                <span class="close" @click="closeModal('gistModal')">&times</span>
                创建<a href="https://github.com/settings/tokens" target="_blank">GitHub token</a> 
                <br><br>
                提交token创建新的Gist: <input class="input_long" type="text" v-model="token" /> 
                <input class="input_btn" type="button" value="提交" @click="creatGist" />
                <br><br>
                已生成Gist，对它进行手动 <input type="checkbox" v-model="isGist" >编辑</input>
                <div v-show="isGist">
                    <br>
                    请输入GitHubGists ID：<input class="input_long" type="text" :disabled="!isGist" v-model="gistID" />
                    <br><br>
                    请输入filename：<input class="input_normal" type="text" :disabled="!isGist" v-model="filename" /> 
                    <input class="input_btn" type="button" value="修改" :disabled="!isGist" @click="setGistID" />
                </div>
            </div>
        </div>
        <div id="modifyModal" class="modal">
            <div class="modal-content">
                <span class="close" @click="closeModal('modifyModal')">&times</span>
                <datalist id="group_list">
                    <option v-for="group in grouplist" :value="group" />
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

<script>
import axios from 'axios'

let gIndex_start = undefined
let wIndex_start = undefined
let gIndex_end = undefined
let wIndex_end = undefined
let dragType = ''

export default {
    name: 'content',
    data() {
        return {
            webgroup: [],
            grouplist: [],
            gistID: '',
            filename: '',
            token: '',
            isGist: false,
            isEdit: false,
            modifyWeb: {
                type: 'add',
                groupIndex : -1,
                webIndex: -1,
                groupDescription: '',
                webDescription: '',
                webUrl: ''
            }
        }
    },
    created() {
        this.getGistID()
        this.fetchData()
    },
    methods: {
        fetchData(){
            if(this.gistID){
                let self = this
                //console.log(localStorage.getItem('updatetime'))
                let seconds = (new Date() - new Date(localStorage.getItem('updatetime')))/1000
                //console.log('seconds:'+seconds)
                let data = localStorage.getItem('content')
                if(seconds > 60){
                    axios.get('https://api.github.com/gists/' + self.gistID)
                    .then(function(res){
                        //console.log(res.data.files[self.filename].content)
                        data = res.data.files[self.filename].content
                        
                        self.setData(data)
                    })
                    .catch(function(err){
                        console.log('fetchData error: '+err)
                    })
                }else{
                    self.setData(data)
                }
            }
        },
        setData(data){
            this.webgroup = JSON.parse(data)
            let grouplist = []
            this.webgroup.forEach(function(item){
                if(item.description){
                    grouplist.push(item.description)
                }
            })
            this.grouplist = grouplist
        },
        getGistID(){
            this.gistID = localStorage.getItem('gistID')
            this.filename = localStorage.getItem('filename')
            this.token = localStorage.getItem('token')
        },
        setGistID(){
            if(this.gistID && this.filename && this.token){
                localStorage.setItem('gistID', this.gistID)
                localStorage.setItem('filename', this.filename)
                localStorage.setItem('token', this.token)
            }
            this.fetchData()
            this.closeModal('gistModal')
        },
        closeModal(elementID){
            let modal = document.getElementById(elementID)
            modal.style.display = "none"
        },
        showModifyModal(type, groupIndex, webIndex){
            this.modifyWeb.type = type
            if(type === "add"){
                this.modifyWeb.groupIndex = -1
                this.modifyWeb.webIndex = -1
                this.modifyWeb.groupDescription = ''
                this.modifyWeb.webDescription = ''
                this.modifyWeb.webUrl = ''
            }else if(type === "update"){
                this.modifyWeb.groupIndex = groupIndex
                this.modifyWeb.webIndex = webIndex
                this.modifyWeb.groupDescription = this.webgroup[groupIndex].description
                this.modifyWeb.webDescription = this.webgroup[groupIndex].webs[webIndex].description
                this.modifyWeb.webUrl = this.webgroup[groupIndex].webs[webIndex].url
            }
            let modal = document.getElementById('modifyModal')
            modal.style.display = "block"
        },
        delWeb(groupIndex, webIndex){
            let webs = this.webgroup[groupIndex].webs
            let isDel = confirm('确定删除网站<' + webs[webIndex].description + '>?')
            if(isDel){
                if(webs.length == 1){
                    this.webgroup.splice(groupIndex, 1)
                }else{
                    webs.splice(webIndex, 1)
                }
                this.updateGist()
            }
        },
        modifyModal(){
            let type = this.modifyWeb.type
            let groupIndex = this.modifyWeb.groupIndex
            let webIndex = this.modifyWeb.webIndex
            let groupDescription = this.modifyWeb.groupDescription.toString().replace(/\s+/g,"")
            if(!groupDescription || groupDescription == ''){
                return alert("网站分类不能为空！")
            }
            let webDescription = this.modifyWeb.webDescription.toString().replace(/\s+/g,"")
            if(!webDescription || webDescription == ''){
                return alert("网站描述不能为空！")
            }
            let webUrl = this.modifyWeb.webUrl.toString().replace(/\s+/g,"")
            if(!webUrl || webUrl == ''){
                return alert("网站网址不能为空！")
            }
            if(this.grouplist.indexOf(groupDescription) == -1){
                this.webgroup.push({
                    description: groupDescription,
                    webs: [{
                        url: webUrl,
                        description: webDescription
                    }]
                })
            }else{
                let index = this.grouplist.indexOf(groupDescription)
                if(index != groupIndex){
                    if(type === 'update'){
                        this.webgroup[groupIndex].webs.splice(webIndex, 1)
                    }
                    this.webgroup[index].webs.push(
                    {
                        url: webUrl,
                        description: webDescription
                    }
                )
                }else{
                    this.webgroup[groupIndex].webs[webIndex].description = webDescription
                    this.webgroup[groupIndex].webs[webIndex].url = webUrl
                }
            }
            this.updateGist()
            this.closeModal('modifyModal')
        },
        showEdit(){
            this.isEdit = !this.isEdit
        },
        creatGist(){
            let updateTime = new Date()
            localStorage.setItem('updatetime', updateTime)
            let content = '[{"description":"论坛","webs":[{"url":"https://github.com","description":"GitHub"}]},{"description":"工具","webs":[{"url":"https://gist.github.com/","description":"GitHub Gists"}]}]'
            localStorage.setItem('content', content)
            localStorage.setItem('token', this.token)
            this.filename = 'webgroup'
            localStorage.setItem('filename', this.filename)
            let self = this
            axios({
                url: 'https://api.github.com/gists',
                method: 'POST',
                headers: {Authorization: "token " + self.token},
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
                //console.log('creatGist: ' + JSON.stringify(res.data))
                self.gistID = res.data.id
                let data = res.data.files[self.filename].content
                self.setData(data)
                localStorage.setItem('gistID', self.gistID)
            }).catch(function(err){
                console.log('creatGist error: '+err)
            })
            
            this.closeModal('gistModal')
        },
        updateGist(){
            let self = this
            let updateTime = new Date()
            let content = JSON.stringify(self.webgroup)
            localStorage.setItem('updatetime', updateTime)
            localStorage.setItem('content', content)
            axios({
                url: 'https://api.github.com/gists/' + self.gistID,
                method: 'PATCH',
                headers: {Authorization: "token " + self.token},
                data: {
                    description: "修改时间：" + updateTime,                    
                    files:{
                        [self.filename]: {
                            content: content
                        }
                    },
                    content: content
                }
            }).then(function(res){
                //console.log('updateGist: ' + (res.data))
                self.fetchData()
            }).catch(function(err){
                console.log('updateGist error: '+err)
            })
        },
        dragStart(event, groupIndex, webIndex) {
            gIndex_start = groupIndex
            wIndex_start = webIndex
            dragType = event.currentTarget.nodeName
            event.dataTransfer.effectAllowed = 'move'
            event.dataTransfer.setData('text/html', event.currentTarget.outerHTML)

            event.currentTarget.classList.add('drag')
        },
        dragOver(event) {
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
        },
        dragLeave(event) {
            let type = event.currentTarget.nodeName
            if(dragType === type){
                if(type === 'LI'){
                    event.currentTarget.classList.remove('over-left') 
                }else{
                    event.currentTarget.classList.remove('over-top')
                }
                event.currentTarget.classList.remove('drag') 
            }
        },
        drop(event, groupIndex, webIndex) {
            if (event.stopPropagation) {
                event.stopPropagation()
            }
            let type = event.currentTarget.nodeName
            if(dragType === type){
                gIndex_end = groupIndex
                wIndex_end = webIndex
                if(type === 'LI'){
                    let item = this.webgroup[gIndex_start].webs[wIndex_start]
                    this.webgroup[gIndex_start].webs.splice(wIndex_start, 1)
                    if(gIndex_start != gIndex_end){
                        this.webgroup[gIndex_end].webs.splice(wIndex_end, 0, item)
                    }else{
                        if(wIndex_end > wIndex_start){
                            this.webgroup[gIndex_start].webs.splice(wIndex_end - 1, 0, item)
                        }else{
                            this.webgroup[gIndex_start].webs.splice(wIndex_end, 0, item)
                        }
                    }
                    if(this.webgroup[gIndex_start].webs.length == 0){
                        this.webgroup.splice(gIndex_start, 1)
                    }
                }else{
                    let item = this.webgroup[gIndex_start]
                    this.webgroup.splice(gIndex_start, 1)
                    if(gIndex_end > gIndex_start){
                        this.webgroup.splice(gIndex_end - 1, 0, item)
                    }else{
                        this.webgroup.splice(gIndex_end, 0, item)
                    }
                }
                
                if(type === 'LI'){
                    event.currentTarget.classList.remove('over-left') 
                }else{
                    event.currentTarget.classList.remove('over-top')
                }
                event.currentTarget.classList.remove('drag')

                this.updateGist()
            }
            
            return false
        }
    }
}
</script>

<style lang="stylus">
    @import '../style/content'
</style>