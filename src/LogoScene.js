var LogoLayer = cc.Layer.extend({
  touchListener:null,
  ctor:function () {
    this._super();
    var size = cc.winSize;

    var touchLabel = new cc.LabelTTF("点击屏幕开始游戏", "Arial", 38);
    // position the label on the center of the screen
    touchLabel.x = size.width / 2;
    touchLabel.y = size.height / 2;
    // add the label as a child to this layer
    this.addChild(touchLabel);

    this.touchListener = cc.EventListener.create({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,                       // 设置是否吞没事件，在 onTouchBegan 方法返回 true 时吞掉事件，不再向下传递。
        onTouchBegan: function (touch, event) {   //实现 onTouchBegan 事件处理回调函数
            var target = event.getCurrentTarget();  // 获取事件所绑定的 target, 通常是cc.Node及其子类

            // 获取当前触摸点相对于按钮所在的坐标
            var locationInNode = target.convertToNodeSpace(touch.getLocation());
            var s = target.getContentSize();
            var rect = cc.rect(0, 0, s.width, s.height);

            if (cc.rectContainsPoint(rect, locationInNode)) {       // 判断触摸点是否在按钮范围内
                cc.log("sprite began... x = " + locationInNode.x + ", y = " + locationInNode.y);
                showScene('cover');
                return true;
            }
            return false;
        },
    });
    cc.eventManager.addListener(this.touchListener,this);

    return true;
  },
  onExit:function(){
    console.log('onExit');
    cc.eventManager.removeListener(this.touchListener);
  }
});

var LogoScene = cc.Scene.extend({
  onEnter:function(){
    this._super();
    this.addChild(new LogoLayer());
  }
});
