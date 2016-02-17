var game;
var $$ = {};
$$.extend = function (a, b) {
    if (typeof (b) === "undefined") {
        b = {};
    }
    for (var i in a) {
        if (!b[i])
            b[i] = a[i];
    }
    return b;
}

var CONSTS = {
    "FAIRY_SPECIFIC_ZORDER": 2000,
    "MAX_ATTACHMENTS_ON_SPRITE": 10,
    "offline_reward_min_time": 60,
    "offline_reward_max_time": 86400,
    "money_tree_one_price": 5,
    "flySpirit_interval_time": 10,
    "click_chest_random_events": [
        {
            "f": {
                "skill_id": "s10007",
                "level": 2,
                "chestStyle": "chest01.json"
            },
            "w": 4
        },
        {
            "f": {
                "skill_id": "s10007",
                "level": 3,
                "chestStyle": "chest01.json"
            },
            "w": 4
        },
        {
            "f": {
                "skill_id": "s10007",
                "level": 4,
                "chestStyle": "chest01.json"
            },
            "w": 4
        },
        {
            "f": {
                "skill_id": "s10003",
                "level": 2,
                "chestStyle": "chest01.json"
            },
            "w": 4
        },
        {
            "f": {
                "skill_id": "s10003",
                "level": 3,
                "chestStyle": "chest01.json"
            },
            "w": 4
        },
        {
            "f": {
                "skill_id": "s10003",
                "level": 4,
                "chestStyle": "chest01.json"
            },
            "w": 4
        },
        {
            "f": {
                "skill_id": "s10106",
                "level": 2,
                "chestStyle": "chest01.json"
            },
            "w": 4
        },
        {
            "f": {
                "skill_id": "s10106",
                "level": 3,
                "chestStyle": "chest01.json"
            },
            "w": 4
        },
        {
            "f": {
                "skill_id": "s10106",
                "level": 4,
                "chestStyle": "chest01.json"
            },
            "w": 4
        },
        {
            "f": {
                "skill_id": "s10105",
                "level": 2,
                "chestStyle": "chest01.json"
            },
            "w": 4
        },
        {
            "f": {
                "skill_id": "s10105",
                "level": 3,
                "chestStyle": "chest01.json"
            },
            "w": 4
        },
        {
            "f": {
                "skill_id": "s10105",
                "level": 4,
                "chestStyle": "chest01.json"
            },
            "w": 4
        },
        {
            "f": {
                "skill_id": "gold",
                "level": 3,
                "chestStyle": "chest01.json"
            },
            "w": 13
        },
        {
            "f": {
                "skill_id": "gold",
                "level": 5,
                "chestStyle": "chest01.json"
            },
            "w": 13
        },
        {
            "f": {
                "skill_id": "gold",
                "level": 7,
                "chestStyle": "chest01.json"
            },
            "w": 13
        },
        {
            "f": {
                "skill_id": "gold",
                "level": 10,
                "chestStyle": "chest01.json"
            },
            "w": 13
        }
    ]
};

//为了显示CD和复活的时候显示的格式
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //�·�
        "d+": this.getDate(), //��
        "h+": this.getHours(), //Сʱ
        "m+": this.getMinutes(), //��
        "s+": this.getSeconds(), //��
        "q+": Math.floor((this.getMonth() + 3) / 3), //����
        "S": this.getMilliseconds() //����
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
function initGame() {
    PlayerData.init();
    game = new MainScene();
}
function validateAmountNotEnough(upgradeLevelData) {
    var amount = PlayerData.getAmountByUnit(upgradeLevelData['unit']);
    return amount < upgradeLevelData['value'];
}
function validateResourceNotEnough(nextlevelData, upgrade_btn, text) {
    var flag = validateAmountNotEnough(nextlevelData)
    if (flag) {
        upgrade_btn.setEnabled(false);
        upgrade_btn.setBright(false);
        text.setColor(cc.color(255, 0, 0));
    } else {
        upgrade_btn.setEnabled(true);
        upgrade_btn.setBright(true);
        text.setColor(cc.color(255, 255, 255));
    }
    return flag;
}

function addPlayer(playerName, callback) {

    var sgtPlayer = new sgt.Player();
    sgtPlayer.name = playerName;
    sgtPlayer.userId = sgt.context.user.userid;
    sgtPlayer.level = 1;
    sgtPlayer.avatarUrl = "h102.png";
    sgt.PlayerService.create(sgtPlayer, function (result, data) {
        if (result) {
            //初始化角色存档
            sgt.context.playerData.player = data;

            console.log("创建角色result:" + result + ",data:" + data);
            return callback(true);
        } else {
            console.log('创建角色失败！');
            return callback(false);
        }
    });
}
//识别 MicroMessenger 这个关键字来确定是否微信内置的浏览器
function is_weixin() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}

function openNewNameLayer(scene) {
    var createPlayer = ccs.csLoader.createNode(res.createPlayer);
    //var gamepopup = new GamePopup(createPlayer);
    var root = createPlayer.getChildByName('root');
    var dice = root.getChildByName('dice');
    var name_text = root.getChildByName('name_text');
    var btn = root.getChildByName('btn');
    //popup(gamepopup,100);
    bindButtonCallback(btn, function () {
        var playName = name_text.getString();
        if (cc.isString(playName)) {
            addPlayer(playName, function () {
                createPlayer.removeFromParent(true);
                //gamepopup.removeFromParent(true);
                scene.getChildByName("root").getChildByName("cover_login_btn").setVisible(true);

            })
        } else {
            new Popup1("友情提醒", "角色名字格式不正确");
        }
    });
    bindButtonCallback(dice, function () {
        sgt.RandomNameGroupService.defaultRandomName(function (result, data) {
            name_text.setString(data);
            console.log("result:" + result + "data:" + data);
        });
    });
    sgt.RandomNameGroupService.defaultRandomName(function (result, data) {
        name_text.setString(data);
        console.log("result:" + result + "data:" + data);
    });
    createPlayer.setPosition(cc.p(140, 400));
    scene.addChild(createPlayer, 100);
}

function showCover() {
    var scene = ccs.csLoader.createNode(res.cover_scene_json);
    var loginBtn = scene.getChildByName("root").getChildByName("cover_login_btn");

    if (sgt && cc.isObject(sgt.context.user) && !quickLoginfalg) {
        loginBtn.setVisible(false);
        openNewNameLayer(scene);
    }

    bindButtonCallback(loginBtn, function () {
        showGame();
    });

    cc.director.runScene(scene);

}
function showGame() {
    cc.director.runScene(game);
}

function bindButtonCallback(button, callback) {
    button.addTouchEventListener(function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                callback.call(sender);
                break;
        }
    }, button);
}

function removeCCSAnimationDefaultTween(timelines) {
    for (var i in timelines) {
        var timeline = timelines[i];
        var frames = timeline.getFrames();
        for (var j in frames) {
            var frame = frames[j];
            if (frame.isTween()) {
                frame.setTween(false);
            }
        }
    }
}

function popup(popupMenu, localZOrder) {
    if (cc.director.getRunningScene()) {
        cc.director.getRunningScene().addChild(popupMenu, localZOrder);
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setFont(target) {
    if (target instanceof Array) {
        for (var i in target) {
            target[i].setFontName("微软雅黑");
            target[i].setColor(cc.color(0, 0, 0))
        }
    }
    else {
        target.setFontName("微软雅黑");
        target.setColor(cc.color(0, 0, 0))
    }
}

function setColor(target) {
    if (target instanceof Array) {
        for (var i in target) {
            target[i].setColor(cc.color(0, 0, 0))
        }
    }
    else {
        target.setColor(cc.color(0, 0, 0))
    }
}


function setIgnoreContentAdaptWithSize(target) {
    if (target instanceof Array) {
        for (var i in target) {
            target[i].ignoreContentAdaptWithSize(true);
        }
    }
    else {
        target.ignoreContentAdaptWithSize(true);
    }
}

function scheduleOnce(target, callback, delay) {
    cc.director.getScheduler().schedule(callback, target, 0, 0, delay, false, target.__instanceId);
}

function unschedule(target) {
    cc.director.getScheduler().unschedule(target.__instanceId, target);
}

function bindTouchEventListener(listener, target) {

    var touchDownEventListener = cc.EventListener.create({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: false,
        onTouchBegan: function (touch, event) {
            //cc.log("touch:" + JSON.stringify(touch));
            //cc.log("event:" + event.getCurrentTarget()._name);
            var target = event.getCurrentTarget();
            var locationInNode = target.convertToNodeSpace(touch.getLocation());
            var s = target.getContentSize();
            var rect = cc.rect(0, 0, s.width, s.height);
            if (cc.rectContainsPoint(rect, locationInNode)) {
                //cc.log(locationInNode.x + " " + locationInNode.y);
                return listener(touch, event);
            }
            return false;
        },
        onTouchEnd: function (touch, event) {
            cc.log("onTouchEnd");
            return false;
        }
    });
    cc.eventManager.addListener(touchDownEventListener, target);
}

function bindMouseEventListener(listener, target) {
    var mouseDownEventListener = cc.EventListener.create({
        event: cc.EventListener.MOUSE,
        swallowTouches: false,
        onMouseDown: function (touch, event) {
            var locationInNode = target.convertToNodeSpace(touch.getLocation());
            var s = target.getContentSize();
            var rect = cc.rect(0, 0, s.width, s.height);
            if (cc.rectContainsPoint(rect, locationInNode)) {
                //cc.log(locationInNode.x + " " + locationInNode.y);
                return listener(touch, event);
            }
            return false;
        },
    });
    cc.eventManager.addListener(mouseDownEventListener, target);
}

function loadDynamicTexture(url, listenr, target) {
    cc.textureCache.addImageAsync(url, function (textureBg) {
        if (textureBg) {
            listenr.onLoad(textureBg);
        } else {
            listenr.onError();
        }
    }, target);
}