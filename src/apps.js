var Effects = {};


var player
var game;


function loadGame(callback, context) {
    cc.loader.load(["res/data/record.json"], function (err, data) {
        player = new Player(data[0]);

        // console.log(datas.heros);
        callback.call(context);
    });
}
function initGame() {
    // game = new GameScene();
    game = new BattleScene();
}
function initSpriteFrames() {
    Effects.player_hit = [];
    for (var i in player_hit_frames) {
        // new cc.SpriteFrame("res/grossini_dance.png",cc.rect(0,0,90,128));
        var frame = new cc.SpriteFrame(res.player_hit_png, cc.rect(i * 192, 0, 192, 192));
        cc.spriteFrameCache.addSpriteFrame(frame, player_hit_frames[i]);
        Effects.player_hit[i];
    }

    for (var i in skill_0_frames) {
        var frame = new cc.SpriteFrame(res.skill_0_png, cc.rect(i * 192, 0, 192, 192));
        cc.spriteFrameCache.addSpriteFrame(frame, skill_0_frames[i]);
    }
}

function showCover() {
    var scene = ccs.csLoader.createNode(res.cover_scene_json);

    var loginBtn = scene.getChildByName("cover_login_btn");
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
