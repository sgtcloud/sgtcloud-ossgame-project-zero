# Alpha挂机

[在线文档地址](https://www.gitbook.com/book/sgtcloud/project-nova-0-doc/details)

### 目录规划

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

### gfx

包含所有设计文档所述的原始图片素材，例如psd/png/jpg/tga等，和cocos studio制作的ui和精灵工程文件，例如ccs/cbs等。详细的介绍请看目录下的README.md。

```
├── stage/          #战斗场景
├── character/      #角色精灵
├── enemy/          #敌人精灵
├── effect/         #游戏特效
├── icon/           #图标文件
├── title/          #标题界面
├── loading/        #加载界面
├── ui/             #ui资源
|   ├──charactUI/   #角色界面
|   ├──itemUI/      #物品界面
|   ├──skillUI/     #技能界面
|   ├──arenaUI/     #竞技场界面
|   ├──rankUI/      #排行界面
|   ├──shopUI/      #商店界面
|   ├──...          #其他界面
├── README.md       #图片资源使用说明
```

### sfx

包含所有未经剪辑的声音素材，例如mp3/wav/ogg等。详细的介绍请看目录下的README.md。

### data

包含所有设计文档所述的数据源文件，例如xls/csv等。详细的介绍请看目录下的README.md。

### lib

包含因为一些原因在index中引入的例如jquery或者特定用途（例如统计分析）的本地js库文件。

### 项目的构建和发布

##### 构建工具

项目可以直接通过cocos的构建工具进行项目的构建（build）和发布（release）。
在开始构建的时候还考虑到了多渠道发布的需求，所以同时提供了[gulp](http://gulpjs.com/)实现的工具链。

##### 联网功能依赖

游戏的联网相关功能都是由[sgtcloud](http://www.sgtcloud.cn/)提供的[sgtcloud-html5-sdk](https://github.com/sgtcloud/sgtcloud-html5-sdk)，自行调试和进行二次开发的时候请务必申请自己的appid参数。
