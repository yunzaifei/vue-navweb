# vue-navweb
利用github gists存储数据的自定义导航页

示例网站：[http://yunzaifei.com](http://yunzaifei.com)

先来张效果图
![](http://i.imgur.com/FcCiiEc.png)

## 说明

> 利用github gists api生成自定义导航页

> 项目由vue-cli生成，项目结构参考vue-cli init webpack xxx结构

> 字体图标使用icommon的字体图标

> 获取网站图标使用[https://api.byi.pw/favicon/?url=blog.icewingcc.com](https://api.byi.pw/favicon)格式获取

> 头部搜索栏默认使用google搜索，如果没有自带翻墙的朋友可以手动在"src/components/menu.vue"文件中改成其他搜索

## 安装启动

``` bash
# 安装依赖项
npm install

# 启动服务默认打开localhost:8080
npm start

# 打包生成dist文件夹
npm run build

```

## 使用
1. 必须有github帐号，在“Settings>Personal access tokens”中生成github token（生成token时勾选Gists），链接：[https://github.com/settings/tokens/new](https://github.com/settings/tokens/new)

2. 点击生成网页中Setting填写上一步生成的token，提交生成gist（如果已经有gist或者想自己在github gist网页手动生成，可以不点提交按钮）

3. 生成gist后，勾选“编辑”，可以看到gitsID和filename（也可以在这里填写或修改gitsID和filename）

4. 如果想在其他浏览器或电脑中使用，请把token，gistID和filename填写后点击“修改”按钮即可

5. 生成的dist文件夹中的文件可以放入IIS或其他文件服务器中进行访问

# License
MIT
