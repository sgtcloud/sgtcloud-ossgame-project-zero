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
    "offline_reward_min_time": 60,
    "offline_reward_max_time": 86400,
    "money_tree_one_price": 5,
    "flySpirit_interval_time": 180,
    "click_chest_random_events": [{
        "f": {
            "skill_id": "s10107",
            "level": 2,
            "chestStyle": "chest01.json"
        },
        "w": 5
    }, {
        "f": {
            "skill_id": "s10107",
            "level": 3,
            "chestStyle": "chest01.json"
        },
        "w": 4
    }, {
        "f": {
            "skill_id": "s10107",
            "level": 4,
            "chestStyle": "chest01.json"
        },
        "w": 3
    }, {
        "f": {
            "skill_id": "s10107",
            "level": 5,
            "chestStyle": "chest01.json"
        },
        "w": 2
    }, {
        "f": {
            "skill_id": "s10101",
            "level": 2,
            "chestStyle": "chest01.json"
        },
        "w": 1
    }, {
        "f": {
            "skill_id": "s10101",
            "level": 3,
            "chestStyle": "chest01.json"
        },
        "w": 4
    }, {
        "f": {
            "skill_id": "gold",
            "level": 2,
            "chestStyle": "chest01.json"
        },
        "w": 6
    }]
}

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
    game = new MainScene();
    PlayerData.init();
}

function showCover() {
    var scene = ccs.csLoader.createNode(res.cover_scene_json);

    var loginBtn = scene.getChildByName("root").getChildByName("cover_login_btn");
    bindButtonCallback(loginBtn, function () {
        initDatas();
        initGame();
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

    var mouseDownEventListener = cc.EventListener.create({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: false,
        onTouchBegan: function (touch, event) {
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