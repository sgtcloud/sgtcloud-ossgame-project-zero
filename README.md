# 【置顶】内测用户组计划

如果您已经有了切实的项目开发计划，内测用户组正在招募核心开发者，我们会提供您从游戏的开发到上线的一系列的资源支持。详情查看[FAQ](https://github.com/sgtcloud/sgtcloud-ossgame-project-zero/wiki/%E5%86%85%E6%B5%8B%E7%94%A8%E6%88%B7%E7%BB%84%E8%AE%A1%E5%88%92FAQ)，请加qq群468356255，如果不符合要求的建议加入下面提到的用户支持群。

# 使用声明

本软件已经取得软件著作权，受到相关法律条例的保护，在未获得合法授权的情况下请勿私自用于任何用途。

# 如何获得授权

### 非商业使用（教育，培训，私人学习）

* 联系我们，把您的产品基本信息（含产品名称，介绍，截图或者视频，上线地址，联系方式等）通过邮件或者其他方式发送给我们
* 在产品的启动页面上加上我们的[标识素材](http://pan.baidu.com/s/1kTXefyR)
* 无论您的产品收益如何，我们都不收取任何费用

### 商业使用（包含但不限于通过销售，联运，广告等直接或者间接获得商业利益）

* 联系我们，把您的产品基本信息（含产品名称，介绍，截图或者视频，上线地址，联系方式等）通过邮件或者其他方式发送给我们
* 提供贵公司的基本信息，并且签署一份软件授权使用协议，该协议是完全免费的
* 无论您的产品收益如何，我们都不收取任何费用

获得合法授权之后，我们会提供7X24的邮件技术支持和工作时间的全方位开发支持。

邮件联系：sgtcloud@yoedge.com
qq群：383461219

# 点击放置类开源游戏项目

### 产品设计文档

[在线文档地址](https://www.gitbook.com/book/sgtcloud/project-nova-0-doc/details)

### 产品内容和特色

* 5个各具特色的主角
* 40多个可升级技能，10种主动技能，含单体，群体伤害，回复和buff类
* 10多个关卡，5种敌人，10余种掉落奖励
* 30多种可升级装备，每种掉落奖励都可以用来升级对应的装备
* 详尽的数据统计面板和行囊面板
* 离线战斗收益，关掉浏览器也能打怪升级
* 紧张的30秒Boss战，赢取丰厚的关卡掉落
* 在线通关和金币排行榜
* 新手引导

### 在线演示

[点击打开](http://h5.yoedge.com/ossgame/publish/html5/index.html)

或者扫描二维码

![barcode](http://h5.yoedge.com/barcode.png)

### 开发环境和工具列表

* Cocos Framework(>=3.10)+Cocos Studio [下载](http://www.cocos.com/download/#) [网盘分流](http://pan.baidu.com/s/1o7wIylO)
* [xls2json](https://github.com/sgtcloud/xlsx2json)
* [shoebox](http://renderhjs.net/shoebox/)
* Webstorm或者sublime text或者其他的代码编辑器

### 手机浏览器兼容

你可以提交你的测试结果给我们，我们会更新到这张列表中

机型 | UC | 360 | QQ | 猎豹 | 百度 | 搜狗 | 原生 | 微信
------------ | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | -------------
小米 3 | Pass* | Pass | Pass | Pass | Pass | Pass | Pass | Pass
小米 Note Pro | Pass* | Pass | Pass | Pass | Pass | Pass | Pass | Pass
魅蓝 Note | Pass* | Pass | Pass | Pass | Pass | Pass | Pass | Pass
酷派 F1 | Pass* | Pass | Pass | Pass | Pass | Pass | Pass | Pass
IUNI U3 | Pass* | Pass | Pass | Pass | Pass | Pass | Pass | Pass
iPad Air | Pass | Pass | Pass | Pass | Pass | Pass | Pass | Pass
iPhone 5 | Pass | Pass | Pass | Pass | Pass | Pass | Pass | Pass
iPhone 6 Plus | Pass | Pass | Pass | Pass | Pass | Pass | Pass | Pass
iPhone 6S | Pass | Pass | Pass | Pass | Pass | Pass | Pass | Pass
LG Fx0 | N/A | N/A | N/A | N/A | N/A | N/A | Pass | N/A

*需要刷新一次页面才能正常进入

### 获取代码

本项目托管在github上，安装[git](https://git-scm.com/)之后运行。[网盘分流下载](http://pan.baidu.com/s/1mhdPPBq)

    git clone https://github.com/sgtcloud/sgtcloud-ossgame-project-zero.git

### 运行代码

##### 一般方式

1. 原则上所有的http服务器都能运行本项目，例如nginx,apache等，这里用python内置的服务器为例
2. 下载python2.7，如果您已经安装过了完整版cocos，那么就已经包含了该软件
3. 配置python.exe到你的系统变量的PATH
4. 在项目根目录运行'python -m SimpleHTTPServer'
5. 浏览器打开'http://localhost:8080/'

[下载win单文件版python](http://pan.baidu.com/s/1kTRdh3p)

*python自带的简单服务器无法自定义参数，会产生缓存的问题，建议开发中使用功能更完整的服务器软件，例如[nginx](http://nginx.org/en/download.html)

##### webstorm方式

1. 把项目导入webstorm
2. 在index.html文件上右键，Run 'index.html' 即可使用内置的服务器运行项目

### 项目目录

在cocos2d-js默认项目布局上新增加了若干目录，包含了webstorm的项目配置，可以直接导入webstorm。

```
├── doc/    #游戏文档
├── gfx/    #游戏图形素材
├── sfx/    #游戏声音素材
├── data/   #游戏数据素材
├── frameworks/    #cocos引擎文件
├── res/    #游戏资源
├── src/    #游戏源代码
├── lib/    #游戏依赖的三方js库
├── index.html  #游戏入口页面
├── main.js     #cocos引擎入口文件
├── README.md   #项目说明
├── ...     #其他cocos项目文件
```

##### gfx

包含所有设计文档所述的原始图片素材，例如psd/png/jpg/tga等，和cocos studio制作的ui和精灵工程文件，例如ccs/cbs等。详细的介绍请看目录下的README.md。

```
├── Genius/         #角色精灵
├── HookGame/       #所有UI界面和控件
├── cover/          #标题界面
├── loading/        #加载界面
├── README.md       #图片资源使用说明
```

##### sfx

包含所有未经剪辑的声音素材，例如mp3/wav/ogg等。详细的介绍请看目录下的README.md。

##### data

包含所有设计文档所述的数据源文件，例如xls/csv等。详细的介绍请看目录下的README.md。

##### lib

包含因为一些原因在index中引入的例如jquery或者特定用途（例如统计分析）的本地js库文件。

### 项目构建和发布

##### Cocos Console

项目可以直接通过cocos的构建工具进行项目的构建（build）和发布（release）。
直接使用命令行即可发布
```
cocos compile -p web -m release
```
*暂时不支持--advanced参数*

##### gulp

构建的时候还考虑到了多渠道发布的需求，所以同时提供了[gulp](http://gulpjs.com/)实现的工具链。
首先确认自己安装了[Nodejs](http://nodejs.org/)环境。[网盘分流下载](http://pan.baidu.com/s/1gemN1qr)

* 运行

```
    npm install --save-dev
```

安装构建需要的依赖

* 运行

```
    gulp
```

在public/html5下面构建出和cocos一致的发布，使用gulp的构建脚本可以非常容易的定制自己的发布，我们已经加入了发布参数的预处理和资源的压缩（详见根目录的gulpfile.js），我们建议您使用这种方式。

### 定制游戏向导

在开始您的定制之旅前，我建议开发者先花一些时间熟悉Cocos Studio（简称ccs）这款软件，毕竟本项目的所有精灵，动画和UI界面都是通过这个工具来编辑的，磨刀不误砍柴工:）

* [cocos studio官方中文文档](http://www.cocos.com/doc/article/index?type=Cocos%20Studio&url=/doc/cocos-docs-master//manual/studio/v4/chapter0/cocosstudio/zh.md)
* 推荐，内容更新更全面[cocos studio官方英文文档](http://www.cocos2d-x.org/docs/editors_and_tools/studio/)
* [Cocos Studio教程](http://www.cocos.com/doc/tutorial/lists?id=39)
* [Cocos Studio入门教程](http://www.cocos.com/doc/tutorial/lists?id=32)
* [Cocos Studio原创教程实例](http://www.cocos.com/doc/tutorial/lists?id=100)

##### 定制界面注意事项和流程

1. 原则上两条，不要修改控件的层级，基本上保持原始结构，有一个名称为“root”的根节点；不要修改导出的文件名。
2. 把发布之后的res目录复制到根目录的res即可完成定制
3. 复杂的界面建议做一下合图处理，减少图片资源的体积

##### 具体界面注意事项

* [定制Loading界面](https://github.com/sgtcloud/sgtcloud-ossgame-project-zero/wiki/%E5%AE%9A%E5%88%B6Loading%E7%95%8C%E9%9D%A2)
* [定制cover封面](https://github.com/sgtcloud/sgtcloud-ossgame-project-zero/wiki/%E5%AE%9A%E5%88%B6cover%E5%B0%81%E9%9D%A2)
* [定制战斗场景顶部面板](https://github.com/sgtcloud/sgtcloud-ossgame-project-zero/wiki/%E5%AE%9A%E5%88%B6%E6%88%98%E6%96%97%E5%9C%BA%E6%99%AF%E7%9A%84%E9%A1%B6%E9%83%A8%E9%9D%A2%E6%9D%BF)
* [定制战斗场景](https://github.com/sgtcloud/sgtcloud-ossgame-project-zero/wiki/%E5%AE%9A%E5%88%B6%E6%88%98%E6%96%97%E5%9C%BA%E6%99%AF)
* [定制英雄单位](https://github.com/sgtcloud/sgtcloud-ossgame-project-zero/wiki/%E5%AE%9A%E5%88%B6%E8%8B%B1%E9%9B%84%E5%8D%95%E4%BD%8D)


### 项目源代码导读

* 本游戏主要采用了cocos studio作为界面设计工具，加载导出的json文件来完成绝大部分的UI界面工作，例如CCSUnit
* 本游戏参考了mvvm的软件架构模式，分离了model和view model两级模型，一个model一般对应一个view model。例如，Hero和HeroUnit，model都位于model文件夹内，view model则都位于battle文件夹内
* 本游戏采用了事件驱动的方式来解耦各个程序逻辑模块，例如Event
* 本游戏通过sgtcloud提供的baas服务来实现联网逻辑，详见[sgtcloud](http://www.sgtcloud.cn)

##### 根目录

* main.js 程序入口类
* apps.js 程序通用工具类
* Chance.js 随机数工具类
* GamePopup.js 弹窗类
* MainScene.js 构造和初始化主场景所有界面
* LoaderScene.js 首屏加载类，重写了加载逻辑，支持ccs导出的动画和控件作为内容
* Event.js 自定义事件类和工具方法
* Data.js 数据读取工具方法类
* NetWork.js 联网逻辑工具类
* guideConfig.js 引导脚本数据类

##### 数据模型

model目录中的大部分类都是通过加载data目录下的只读数据文件（*.json）和部分存档数据（Player.js中的player）构造出来的逻辑实体

##### 代码导读

[battle模块代码导读](https://github.com/sgtcloud/sgtcloud-ossgame-project-zero/wiki/battle%E6%A8%A1%E5%9D%97%E4%BB%A3%E7%A0%81%E5%AF%BC%E8%AF%BB)
[数据模型导读](https://github.com/sgtcloud/sgtcloud-ossgame-project-zero/wiki/%E6%95%B0%E6%8D%AE%E6%A8%A1%E5%9E%8B)

##### 联网功能依赖

游戏的联网相关功能，包含不限于在线存档，服务器时间校准，签到，排行榜等等功能，都是由[sgtcloud](http://www.sgtcloud.cn/)提供的[sgtcloud-html5-sdk](https://github.com/sgtcloud/sgtcloud-html5-sdk)，自行调试和进行二次开发的时候请务必申请自己的appid参数。

### 项目路线图

* 下一个发布版本为[0.0.5](https://github.com/sgtcloud/sgtcloud-ossgame-project-zero/milestones/0.0.5)
* 后续版本[0.0.6](https://github.com/sgtcloud/sgtcloud-ossgame-project-zero/milestones/0.0.6)

##### 其他待完成开发任务

* 实现基于cocos studio导出控件的事件绑定

欢迎开发者给我们提出你们开发中遇到的问题，有问必答，有求必应：）

# 鸣谢

* [cocos](http://cocos.com/)商标和产品相关权利归触控所有，感谢触控为我们带来免费开源的游戏引擎，也感谢开发团队对我们的无私支持
