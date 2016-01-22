var GamePopup = cc.Layer.extend({
    _listener: null,
    ctor: function(layer,pos,isSwallow) {
        this._super(cc.color.RED);
        this.ignoreAnchorPointForPosition(false);   //忽略锚点设置为false，默认为true，锚点(0, 0)
        this.setOpacity(128);       //透明度
        this.isSwallow = isSwallow || true;
        this.target = layer;
        this.pos = pos;
        var self = this;
        this._listener = new cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: this.isSwallow,
            onTouchBegan: function (touch, event) {
                var locationInNode = self.target.convertToNodeSpace(touch.getLocation());
                var s = self.target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
                if (!cc.rectContainsPoint(rect, locationInNode)) {
                    self.target.removeFromParent();
                    self.hidden();
                }
                return true;
            }
        });
        //添加触摸监听
        cc.eventManager.addListener(this._listener, this.target);
        //初始化对话框
        this._initDialog();
    },
    //初始化对话框
    _initDialog: function()
    {
        if(this.pos){
            this.target.setPosition(this.pos);
        }else{
            var winSize = cc.winSize;
            //背景
            this.target.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
        }
        this.addChild(this.target,0);
        this.setVisible(true);
        this._listener.setSwallowTouches(this.isSwallow);
    },

    _onCallback: function()
    {
        this.hidden();
    },

    //弹出
    popup: function()
    {
        this.setVisible(true);
        this._listener.setSwallowTouches(this.isSwallow);
        //this._listener.setSwallowTouches(true);

        /*var bg = this.getChildByTag(101);
        bg.setScale(0);
        var scaleTo = new cc.ScaleTo(1.0, 1);
        var rotateBy = new cc.RotateBy(1.0, 360, 0);
        var spawn = new cc.Spawn(scaleTo, rotateBy);
        bg.runAction(spawn);*/
    },

    //隐藏
    hidden: function()
    {
        this.setVisible(false);
        //this.onExit();
    },

    onExit: function()
    {
        this._super();
        //移除触摸监听
        cc.eventManager.removeListeners(cc.EventListener.TOUCH_ONE_BY_ONE, true);
    }
});
