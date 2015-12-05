var Effects = {};


var player
var game;


function loadGame(callback,context){
  cc.loader.load(["res/data/record.json"],function(err,data){
    player = new Player(data[0]);

    // console.log(datas.heros);
    callback.call(context);
  });
}
function initGame(){
  // game = new GameScene();
  game = new BattleScene();
}
function initSpriteFrames(){
  Effects.player_hit = [];
  for(var i in player_hit_frames){
    // new cc.SpriteFrame("res/grossini_dance.png",cc.rect(0,0,90,128));
    var frame = new cc.SpriteFrame(res.player_hit_png,cc.rect(i*192,0,192,192));
    cc.spriteFrameCache.addSpriteFrame(frame,player_hit_frames[i]);
    Effects.player_hit[i];
  }

  for(var i in skill_0_frames){
    var frame = new cc.SpriteFrame(res.skill_0_png,cc.rect(i*192,0,192,192));
    cc.spriteFrameCache.addSpriteFrame(frame,skill_0_frames[i]);
  }
}

function showCover(){
  var scene = ccs.csLoader.createNode(res.cover_scene_json);

  var loginBtn = scene.getChildByName("cover_login_btn");
  bindButtonCallback(loginBtn,function(){
    showGame();
  });

  cc.director.runScene(scene);
}
function showGame(){
  cc.director.runScene(game);
  // var scene = ccs.csLoader.createNode(res.game_scene_json);
  // var playerPane = scene.getChildByName("player_pane");
  // var listPane = scene.getChildByName("list_pane");
  // var heroList = listPane.getChildByName("hero_list");
  // var updatePlayer = function(){
  //   playerPane.getChildByName("player_name").setString(player.name);
  // };

  // console.log(heroList);

  // console.log(view);

  // var default_item = new ccui.Layout();
  // default_item.setTouchEnabled(true);
  // default_item.setContentSize(cc.size(640,200));
  // default_item.width = heroList.width;
  // heroList.setItemModel(default_item);
  //
  // for (var i = 0; i < 20; ++i) {
  //   heroList.pushBackDefaultItem();
  // }
  // for (var i = 0; i < 20; ++i) {
  //   var layer = new ccui.Layout();
  //   var view = ccs.csLoader.createNode(res.hero_view_json);
  //   layer.addChild(view);
  //   heroList.insertCustomItem(layer);
  // }
  //       for (var i = 0; i < 20; ++i) {
  //         // var lblLayer=new ccui.Layout();
  //         heroList.insertCustomItem(view);
  //       }
  // heroList.insertDefaultItem(2);
  // heroList.insertCustomItem(view);

  // heroList.addChild(view);


}


function bindButtonCallback(button,callback){
  button.addTouchEventListener(function(sender, type){
    switch(type) {
      case ccui.Widget.TOUCH_ENDED:
        callback.call(sender);
        break;
    }
  }, button);
}
