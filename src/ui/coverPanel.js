/**
 * Created by peisy on 2016/04/18.
 */
var CoverPanel = function () {
    var json = ccs.load(res.cover_scene_json);
    var scene = json.node.getChildByName('root');
    scene.setAnchorPoint(cc.p(0, 0));
    scene.runAction(json.action);
    var loginBtn = scene.getChildByName("cover_login_btn");
    var btn = loginBtn.getChildByName('btn');
    var chooseBtn = scene.getChildByName('choose');
    var text = chooseBtn.getChildByName('text');
    var state = chooseBtn.getChildByName('state');
    var list_btn = chooseBtn.getChildByName('list_btn');
    var full = chooseBtn.getChildByName('full');
    tipTemplate = ccs.load(res.tips).node.getChildByName("root");
    window.tip2 = new Tip(scene);
    chooseBtn.setVisible(false);
    btn.setEnabled(false);
    btn.setBright(false);
    this.initData = function () {
        var tasks = Network.getAnnounces();
        tasks.push(function (cb) {
            var done = false;
            json.action.setLastFrameCallFunc(function () {
                if (!done) {
                    done = true;
                    cb();
                }
            });
            json.action.play('show', false);
        }, function (cb) {
            Network.getServerList(true, cb);
        });
        async.parallel(tasks, function (err) {
            if (err) {
                console.log(err);
            } else {
                this.RefreshStatus();
            }
        }.bind(this));
    };
    this.RefreshStatus = function () {
        NoticePanel.open();
        btn.setEnabled(true);
        btn.setBright(true);
        chooseBtn.setVisible(true);
        var server;
        if (PlayerData.servers) {
            server = PlayerData.servers[0];
            full.setVisible(false);
            state.setVisible(true);
        } else {
            var servers = PlayerData.getLocalServerList();
            server = servers[servers.length - 1];
            state.setVisible(false);
            full.setVisible(false);
        }
        Network.setServerInfo(server);
        text.setString(server.name);
        chooseBtn.setTouchEnabled(false);
        loginBtn.setTouchEnabled(false);
        btn.setTouchEnabled(false);
        bindTouchEventListener(function () {
            ChooseServerPanel.open(chooseBtn);
            return true;
        }, chooseBtn);
        bindButtonCallback(list_btn, function () {
            ChooseServerPanel.open(chooseBtn);
        });
        bindTouchEventListener(function(){
            this.EnterGame();
            return true;
        }.bind(this), loginBtn);
    };
    this.EnterGame = function () {
        SgtApi.CreateServices();
        Network.updateLocalServerList();
        Network.getPlayerSave(function (result) {
            if (result) {
                console.log(JSON.stringify(result));
                return false;
            }
            //判断当前用户是否存在角色
            if (!PlayerData.modelPlayer) {
                loginBtn.setVisible(false);
                chooseBtn.setVisible(false);
                Network.openNewNameLayer(scene, createPlayerComplete);
            } else {
                var mark = localStorage.getItem('mark-sgt-html5-game');
                if (mark) {
                    tip2.toggle({'delay': 30, 'text': '正在加载角色数据并初始化游戏。。。。。。'});
                    initGame(createPlayerComplete);
                    tip2.stopAllActions();
                    tip2.setVisible(false);
                } else {
                    async.series({
                        "flag1": function (callback) {
                            tip2.toggle({'delay': 30, 'text': '正在加载角色数据并初始化游戏。。。。。。'});
                            cc.loader.load(getSecondResource(), function () {
                                initGame(createPlayerComplete);
                                tip2.stopAllActions();
                                tip2.setVisible(false);
                                callback(null, "flag1");
                            });
                        }, "flag2": function (callback) {
                            //异步加载全部资源
                            cc.loader.load(full_resouces, function () {
                                localStorage.setItem('mark-sgt-html5-game', 1);
                                console.log("flag2正在执行好了");
                                callback(null, "flag2");
                            });
                        }
                    }, function (callback) {
                        console.log(callback);
                    });
                }
            }
            return true;
        });
    };
    this.initData();
    cc.director.runScene(scene);
};
