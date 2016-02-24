/**
 * 包装ccs动画的精灵类，作为所有父类
 * Created by highkay on 2016/2/15.
 */
var CCSUnit = cc.Node.extend({

    ctor: function () {
        this._super();
    },

    initSprite: function (file, nodeName, defaultAnimName) {
        var json = ccs.load(file);
        this.node = nodeName ? json.node.getChildByName(nodeName) : json.node;
        this.node.removeFromParent();
        this.animation = json.action;
        {
            //去除CCS导出文件位移会自带缓动效果的问题
            var timelines = this.animation.getTimelines();
            removeCCSAnimationDefaultTween(timelines);
        }
        this.node.runAction(this.animation);
        this.setContentSize(this.node.getContentSize());
        this.addChild(this.node);
        if (this.debug) {
            var debugRect = new cc.DrawNode();
            this.addChild(debugRect);
            debugRect.clear();
            debugRect.ctor();
            debugRect.drawRect(cc.p(0, 0), cc.p(this.getContentSize().width, this.getContentSize.height), cc.color(0, 255, 0), 5, cc.color(0, 255, 0));
        }
        if (defaultAnimName) {
            this.playAnimation(defaultAnimName);
        }
    },

    //执行动画
    playAnimation: function (name, loop, callback) {
        if (callback) {
            var done = false;
            this.animation.setLastFrameCallFunc(function () {
                // prevent to be called twice
                if(!loop && !done){
                    done = true;
                    callback();
                }
            });
        }
        this.animation.play(name, loop);
    }

});

CCSUnit.create = function (file, nodeName) {
    var unit = new CCSUnit();
    unit.initSprite(file, nodeName);
    return unit;
};