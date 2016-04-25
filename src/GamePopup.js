var GamePopup = cc.Layer.extend({
    _listener: null,
    ctor: function(layer,pos,isSwallow) {
        this._super();
        this.setAnchorPoint(cc.p(0,0));
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
                var locationInNode = self/*.target*/.convertToNodeSpace(touch.getLocation());
                var s = self.target.getContentSize();
                var rect = cc.rect(self.target.x, self.target.y, s.width, s.height);
                if (!self.isSwallow && !cc.rectContainsPoint(rect, locationInNode)) {
                    scheduleOnce(this,function(){
                        self.target.removeFromParent();
                        self.removeFromParent();
                    },0.1);
                    return true;
                }
                return true;
            }
        });
        //添加触摸监听
        cc.eventManager.addListener(this._listener, this);
        //初始化对话框
        this._initDialog();
    },
    //初始化对话框
    _initDialog: function()
    {
        var winSize = cc.winSize;
        if(this.pos){
            this.target.setPosition(this.pos);
        }else{
            //背景
            this.target.setPosition(cc.p((this.width-this.target.width) / 2, (this.height-this.target.height) / 2));
        }
        this._colorLayer = new cc.LayerColor(cc.color.BLACK, 640, 960);
        this._colorLayer.setPosition(cc.p(0,0));
        this.setAnchorPoint(cc.p(0,0));
        this._colorLayer.setOpacity(150);
        //this._listener.setSwallowTouches(true);
        this.addChild(this._colorLayer,0);
        this.addChild(this.target,1);
    }
});
GamePopup.openPopup = function (layer,pos,isSwallow){
    popup(new GamePopup(layer,pos,isSwallow),101);
};
GamePopup.closePopup = function (layer){
    if(layer.parent){
        layer.parent.removeFromParent();
    }
};