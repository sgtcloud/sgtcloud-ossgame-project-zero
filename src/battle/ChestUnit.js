/**
 * Created by highkay on 2015/12/29.
 */

var ChestUnit = cc.Node.extend({
    ctor: function (ccsRes,goods,state,chestName) {
        this._super();
        var json = ccs.load(ccsRes);
        this.node = json.node;
        this.animation = json.action;
        this.animationState = state || 'close';
        this.chest = this.node.getChildByName(chestName || "chest");
        this.goods = goods || {};
        {
            //去除CCS导出文件位移会自带缓动效果的问题
            var timelines = this.animation.getTimelines();
            removeCCSAnimationDefaultTween(timelines);
        }
        this.node.runAction(this.animation);

        if(this.animationState == 'open'){
            this.playAnimation('open',false);
        }

        this.addChild(this.node);
    },
    playAnimation: function (name, falg) {
        this.animation.play(name, falg);
    },
    clickChest:  function (callback) {
        var self = this;
        var listener = cc.EventListener.create({
            event: cc.EventListener.MOUSE,
            swallowTouches: true,
            onMouseDown: function (touch, event) {
                if (self.animationState == 'close') {
                    var touchPosition = self.chest.convertToNodeSpace(touch.getLocation());
                    var s = self.chest.getContentSize();
                    var rect = cc.rect(0, 0, s.width, s.height);
                    if (cc.rectContainsPoint(rect, touchPosition)) {
                        return callback(self.goods);
                    }
                }
                return false;
            },
        });
        cc.eventManager.addListener(listener, this);
    }
});
