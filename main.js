/**
 * A brief explanation for "project.json":
 * Here is the content of project.json file, this is the global configuration for your game, you can modify it to customize some behavior.
 * The detail of each field is under it.
 {
    "project_type": "javascript",
    // "project_type" indicate the program language of your project, you can ignore this field

    "debugMode"     : 1,
    // "debugMode" possible values :
    //      0 - No message will be printed.
    //      1 - cc.error, cc.assert, cc.warn, cc.log will print in console.
    //      2 - cc.error, cc.assert, cc.warn will print in console.
    //      3 - cc.error, cc.assert will print in console.
    //      4 - cc.error, cc.assert, cc.warn, cc.log will print on canvas, available only on web.
    //      5 - cc.error, cc.assert, cc.warn will print on canvas, available only on web.
    //      6 - cc.error, cc.assert will print on canvas, available only on web.

    "showFPS"       : true,
    // Left bottom corner fps information will show when "showFPS" equals true, otherwise it will be hide.

    "frameRate"     : 60,
    // "frameRate" set the wanted frame rate for your game, but the real fps depends on your game implementation and the running environment.

    "id"            : "gameCanvas",
    // "gameCanvas" sets the id of your canvas element on the web page, it's useful only on web.

    "renderMode"    : 0,
    // "renderMode" sets the renderer type, only useful on web :
    //      0 - Automatically chosen by engine
    //      1 - Forced to use canvas renderer
    //      2 - Forced to use WebGL renderer, but this will be ignored on mobile browsers

    "engineDir"     : "frameworks/cocos2d-html5/",
    // In debug mode, if you use the whole engine to develop your game, you should specify its relative path with "engineDir",
    // but if you are using a single engine file, you can ignore it.

    "modules"       : ["cocos2d"],
    // "modules" defines which modules you will need in your game, it's useful only on web,
    // using this can greatly reduce your game's resource size, and the cocos console tool can package your game with only the modules you set.
    // For details about modules definitions, you can refer to "../../frameworks/cocos2d-html5/modulesConfig.json".

    "jsList"        : [
    ]
    // "jsList" sets the list of js files in your game.
 }
 *
 */

cc.game.onStart = function () {
    if (!cc.sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
    {
        spinner.stop();
        document.body.removeChild(document.getElementById("cocosLoading"));
    }
    //Network.initAndAutoLogin();
    // Pass true to enable retina display, disabled by default to improve performance
    cc.view.enableRetina(cc.sys.os === cc.sys.OS_IOS ? true : false);
    // Adjust viewport meta
    cc.view.adjustViewPort(true);
    // Setup the resolution policy and design resolution size
    cc.view.setDesignResolutionSize(640, 960, cc.ResolutionPolicy.SHOW_ALL);
    // The game will be resized when browser size change
    cc.view.resizeWithBrowserSize(true);
    //var items = ["1", "2"];
// 1.我们用setTimeout来模拟异步
// 2.同时为了说明“并行迭代存在异步的情况下，每个元素的迭代完成的时间将无法保证”
// 我们让第一个元素延时300ms执行，第二个延时200ms，第三个延时100ms
    /*async.each(items, function (item, callback) {
        if(item == '1'){
            LoaderScene.preload(g_resources,function(){
                callback();
            },this);
        }else{
            Network.initAndAutoLogin();
            callback();
        }
    }, function (err) {
        // err是由迭代器的回调函数传入
        if (err) {
            // 在迭代某个元素是传入了err.
            // 官网的注释说是传入错误的话，后面的迭代将会终止，而事实并未终止，"1 is processed!"依旧被输出了.
            console.log('Failed to process : ' + err);
        } else {
            console.log('All items have been processed successfully');
        }
    });*/
    //localStorage
    async.parallel([function(cb){
        LoaderScene.preload(g_resources,cb,this);
    } ,function(cb){
        Network.initAndAutoLogin();
         cb(null,'initAndAutoLogin');
    }],function(err){
        if(err){
            console.log('出错了');
        }else{
            console.log('成功了');
        }
    });
    //load resources
    /*async.map(null, [Network.initAndAutoLogin(), LoaderScene.preload(g_resources)], function (result) {
        console.log(result);
        //console.log(err);
        //console.log(args);
        if (Network.isLoginSuccess()) {
            initDatas();
            showCover();
        }
    }.bind(this));*/
    /* LoaderScene.preload(g_resources, function () {
     // cc.director.runScene(new HelloWorldScene());
     if (Network.isLoginSuccess()) {
     initDatas();
     showCover();
     }
     }, this);*/
};
cc.game.run();
