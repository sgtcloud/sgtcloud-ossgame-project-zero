/**
 * Created by highkay on 2016/2/15.
 */
var UNIT_STATE_UNAVAILABLE = 0;
var UNIT_STATE_READY = 1;
var UNIT_STATE_ALIVE = 2;
var UNIT_STATE_DEAD = 3;

var Unit = cc.Node.extend({

    state: UNIT_STATE_UNAVAILABLE,

    ctor: function () {
        this._super();
    },

    //setPosition: function (pos) {
    //    if (this.node) {
    //        this.node.setPosition(pos);
    //    }
    //},
    //
    //getPosition: function () {
    //    return this.node.getPosition();
    //},
    //
    //runAction: function (action) {
    //    if (this.node) {
    //        this.node.runAction(action);
    //    }
    //},

    isAvailable: function () {
        return this.state === UNIT_STATE_ALIVE;
    },

    initSprite: function (file, nodeName) {
        var json = ccs.load(res[file]);
        this.node = nodeName ? json.node.getChildByName(nodeName) : json.node;
        this.animation = json.action;
        {
            //去除CCS导出文件位移会自带缓动效果的问题
            var timelines = this.animation.getTimelines();
            removeCCSAnimationDefaultTween(timelines);
        }
        this.node.runAction(this.animation);
        this.setContentSize(this.node.getContentSize());
        this.addChild(this.node);
    },

    //执行动画
    playAnimation: function (name, loop, callback) {
        this.animateState = name;
        this.animation.play(name, loop);
        if (callback) {
            this.animation.setLastFrameCallFunc(callback);
        }
    },

    //removeSelf: function () {
    //    for(var i in attachments){
    //        this.removeAttachedUnit(attachments[i]);
    //    }
    //    if (this.node) {
    //        this.node.removeFromParentAndCleanup();
    //    }
    //},
    //
    //removeAttachedUnit: function (unit) {
    //    unit.removeSelf();
    //    attachments.remove(unit);
    //},
    //
    //onAttached: function (unit) {
    //    if(this.parent){
    //        var pos = this.getPosition();
    //        var offsetPos = unit.getPosition();
    //        unit.setPosition(cc.p(pos.x + offsetPos.x, pos.y + offsetPos.y));
    //        this.parent.addChild(unit.node, this.zOrder + attachments.length);
    //    }
    //},
    //
    //attachments: [],
    //
    //attachUnit: function (unit) {
    //    attachments.push(unit);
    //    this.onAttached(unit);
    //},
    //
    //attachParentNode: function (parent) {
    //    this.parent = parent;
    //    this.parent.addChild(this.node, zOrder);
    //},
    //
    //zOrder: 0
});

Unit.create = function (file) {
    var unit = new Unit();
    unit.initSprite(file);
    return unit;
};