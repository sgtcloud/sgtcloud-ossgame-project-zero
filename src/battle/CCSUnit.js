/**
 * 包装ccs动画的精灵类，作为所有Unit的父类
 * Created by highkay on 2016/2/15.
 */
var CCSUnit = cc.Node.extend({

    ctor: function () {
        this._super();
    },

    /**
     * 根据json文件创建动画精灵
     *
     * @param file
     * @param nodeName
     * @param defaultAnimName
     */
    initSprite: function (file, nodeName, defaultAnimName) {
        var json = ccs.load(file);
        node = nodeName ? json.node.getChildByName(nodeName) : json.node;
        node.removeFromParent();
        this.animation = json.action;
        {
            //去除CCS导出文件位移会自带缓动效果的问题
            var timelines = this.animation.getTimelines();
            removeCCSAnimationDefaultTween(timelines);
        }
        node.runAction(this.animation);
        this.setContentSize(node.getContentSize());
        this.addChild(node);
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

    /**
     * 播放动画，必须在ccs中编辑动画名称
     *
     * @param name 动画名称
     * @param loop 是否循环
     * @param callback 动画播放完毕回调
     */
    playAnimation: function (name, loop, callback) {
        if (callback) {
            var done = false;
            this.animation.setLastFrameCallFunc(function () {
                // prevent to be called twice
                if (!loop && !done) {
                    done = true;
                    callback();
                }
            });
        }
        this.animation.play(name, loop);
    }

});

/**
 * 创建unit的快速方法
 * @param file
 * @param nodeName
 * @returns {*}
 */
CCSUnit.create = function (file, nodeName) {
    var unit = new CCSUnit();
    unit.initSprite(file, nodeName);
    return unit;
};