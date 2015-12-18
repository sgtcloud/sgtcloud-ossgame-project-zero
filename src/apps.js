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
}

function showCover() {
    var scene = ccs.csLoader.createNode(res.cover_scene_json);

    var loginBtn = scene.getChildByName("root").getChildByName("cover_login_btn");
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
