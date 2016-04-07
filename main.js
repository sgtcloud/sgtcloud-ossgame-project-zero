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
    // Pass true to enable retina display, disabled by default to improve performance
    cc.view.enableRetina(cc.sys.os === cc.sys.OS_IOS ? true : false);
    // Adjust viewport meta
    cc.view.adjustViewPort(true);
    // Setup the resolution policy and design resolution size
    cc.view.setDesignResolutionSize(640, 960, cc.ResolutionPolicy.SHOW_ALL);
    // The game will be resized when browser size change
    cc.view.resizeWithBrowserSize(true);
    //localStorage
    var mark = localStorage.getItem('mark-sgt-html5-game');
    async.parallel([function (cb) {
        if (mark) {
            getFirstResources(false);
            LoaderScene.preload(full_resouces, cb, this);
        } else {
            localStorage.setItem('mark-sgt-html5-game', 1);
           cb();
        }
    }, function (cb) {
        Network.initAndAutoLogin(cb);
        // cb(null,'initAndAutoLogin');
    }], function (err) {
        if (err) {
            console.log('出错了' + JSON.stringify(err));
        } else {
            if (!mark) {
                console.log('成功了');
                if (PlayerData.modelPlayer) {
                    getFirstResources(true, false);
                } /*else {
                    getFirstResources(true, true);
                }*/
                async.series({
                        "flag1": function (callback) {
                            LoaderScene.preload(first_resources, function () {
                                initDatas();
                                showCover();
                                callback(null,"flag1");
                            }, this);
                        }, "flag2": function (callback) {
                        //异步加载全部资源
                        cc.loader.load(full_resouces, function () {
                             callback(null,"flag2");
                        });
                    }
                }, function (callback) {
                    console.log(callback);
                });
            } else {
                initDatas();
                showCover();
            }
        }

    });
    getFirstResources(true, false);

    /* LoaderScene.preload(g_resources, function () {
     // cc.director.runScene(new HelloWorldScene());
     if (Network.isLoginSuccess()) {
     initDatas();
     showCover();
     }
     }, this);*/
};
cc.game.run();
