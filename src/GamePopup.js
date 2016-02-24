var GamePopup = cc.Layer.extend({
    _listener: null,
    ctor: function(layer,pos,isSwallow) {
        this._super(cc.color.RED);
        this.ignoreAnchorPointForPosition(false);   //忽略锚点设置为false，默认为true，锚点(0, 0)
        this.setOpacity(128);       //透明度
        if(typeof isSwallow === 'undefined'){
            this.isSwallow = true;
        }else{
            this.isSwallow = isSwallow;
        }
        this.target = layer;
        this.pos = pos;
        var self = this;
        this._listener = new cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var locationInNode = self.target.convertToNodeSpace(touch.getLocation());
                var s = self.target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
                if (!self.isSwallow && !cc.rectContainsPoint(rect, locationInNode)) {
                    self.target.removeFromParent();
                    self.removeFromParent();
                    return false;
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
    }

});
var gamePopup;
GamePopup.openPopup = function (layer,pos,isSwallow){
    gamePopup = new GamePopup(layer,pos,isSwallow);
    popup(gamePopup,101);
};
GamePopup.closePopup = function (layer){
    layer.removeFromParent();
    gamePopup.removeFromParent();
};