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
//自动登录业务
function autoLoginService() {
    SgtApi.UserService.quickLogin(function(result, data) {
        if (result) {
            if (user !== null) {
                console.log(data);
                //登陆成功
            }
        }
    });
}
function autoWxLoginService(wxInfo){
    wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: wxInfo.result.wxAppId, // 必填，公众号的唯一标识
        timestamp: wxInfo.result.timestamp, // 必填，生成签名的时间戳
        nonceStr: wxInfo.result.noncestr, // 必填，生成签名的随机串
        signature: wxInfo.result.signature, // 必填，签名，见附录1
        jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo','onMenuShareQZone','chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
    if (SgtApi.context.openid) {
        SgtApi.UserService.login3rd(SgtApi.User.WECHAT_MP,function(result,data){
            if (!result) {
                sgt.WxCentralService.getUserInfo(function(result, data) {
                    if(result){
                        var user = new SgtApi.User();
                        user.userName = data.openid;
                        user.nickName = data.nickname;
                        user.registryType = SgtApi.User.WECHAT_MP;//注册类型
                        SgtApi.UserService.regist(user, function (result, data) {
                            console.log(data);
                            //登陆成功
                        });
                    }else{
                        //重现授权
                        sgt.WxCentralService.auth(wxInfo.result.wxAppId, 'snsapi_userinfo');
                    }
                });
            }else{
                console.log(data);
                //登陆成功
            }
        });
    }else{
        sgt.WxCentralService.auth(wxInfo.result.wxAppId, 'snsapi_userinfo');
    }
}
cc.game.onStart = function () {
    if (!cc.sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
        document.body.removeChild(document.getElementById("cocosLoading"));
    if(SgtApi){
        SgtApi.init({appId:'h5html',async:true});
        if (is_weixin() && typeof wx != "undefined") {
            SgtApi.WxCentralService.getSignature(function(result, data) {
                autoWxLoginService(data);
            });
        }else{
            autoLoginService();
        }
    }
    // Pass true to enable retina display, disabled by default to improve performance
    cc.view.enableRetina(true);
    // Adjust viewport meta
    cc.view.adjustViewPort(true);
    // Setup the resolution policy and design resolution size
    cc.view.setDesignResolutionSize(640, 960, cc.ResolutionPolicy.SHOW_ALL);
    // The game will be resized when browser size change
    cc.view.resizeWithBrowserSize(true);
    //load resources
    LoaderScene.preload(g_resources, function () {
        // cc.director.runScene(new HelloWorldScene());
        showCover();
    }, this);
};
cc.game.run();
