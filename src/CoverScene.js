var CoverLayer = cc.Layer.extend({
  bgSprite:null,
  nameInput:null,
  passwordInput:null,
  ctor:function () {
    this._super();
    var size = cc.winSize;

    // this.bgSprite = new cc.Sprite(res.cover_bg);
    // this.bgSprite.setPosition(size.width/2,size.height/2);
    // this.addChild(this.bgSprite);
    //
    // var inputSize = cc.size(300,60);
    // this.nameInput = cc.EditBox.create(inputSize, cc.Scale9Sprite.create(res.cover_input_frame));
    // this.nameInput.setPlaceholderFontColor(cc.color(200,200,200));
    // this.nameInput.setPlaceHolder("点击输入姓名");
    // this.nameInput.setPosition(size.width/2, 400);
    // this.nameInput.setDelegate(this);
    // this.nameInput.setFontColor(cc.color(255,255,255));
    // this.nameInput.setMaxLength(10);
    // this.addChild(this.nameInput);
    //
    // this.passwordInput = cc.EditBox.create(inputSize, cc.Scale9Sprite.create(res.cover_input_frame));
    // this.passwordInput.setPlaceholderFontColor(cc.color(200,200,200));
    // this.passwordInput.setPlaceHolder("点击输入密码");
    // this.passwordInput.setPosition(size.width/2, 330);
    // this.passwordInput.setDelegate(this);
    // this.passwordInput.setFontColor(cc.color(255,255,255));
    // this.passwordInput.setMaxLength(10);
    // this.addChild(this.passwordInput);
    //
    //
    // var loginButton = new cc.MenuItemImage(
    //   res.cover_login_btn_a,
    //   res.cover_login_btn_b,
    //   function () {
    //     loadGame(function(){
    //       showScene('game');
    //     });
    //   }, this);
    // loginButton.setPosition(size.width/2,240);
    //
    // var menu = new cc.Menu(loginButton);
    // menu.x = 0;
    // menu.y = 0;
    // this.addChild(menu, 1);

    // console.log();
    // console.log();
    return true;
  }
});

var CoverScene = cc.Scene.extend({
  onEnter:function(){
    this._super();

    var node = ccs.csLoader.createNode(res.cover_json);
    this.addChild(node);

    var loginBtn = node.getChildByName("cover_login_btn");

    bindButtonCallback(loginBtn,function(){
      showScene("game");
    });
  }
});
