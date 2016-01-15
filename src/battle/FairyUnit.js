/**
 * Created by highkay on 2015/12/29.
 */
var FairyUnit = cc.Node.extend({
    ctor: function () {
        this._super();
        var json = ccs.load(res.fairy01_json);
        this.node = json.node;
        this.animation = json.action;
        this.animationState = 'run';
        var fairy = this.node.getChildByName("fairy01");

        {
            //去除CCS导出文件位移会自带缓动效果的问题
            var timelines = this.animation.getTimelines();
            removeCCSAnimationDefaultTween(timelines);
        }
        this.node.runAction(this.animation);

        this.playAnimation("run", true);
        var random = getRandomInt(0,2);
        this.initFly(random);
        var self = this;
        this.bindClickFairyEvent = function () {
            var listener = cc.EventListener.create({
                event: cc.EventListener.MOUSE,
                swallowTouches: true,
                onMouseDown: function (touch, event) {
                    //self.FairyUnit.convert
                    if(self.animationState == 'run'){
                        var touchPosition = fairy.convertToNodeSpace(touch.getLocation());
                        var s = fairy.getContentSize();
                        //var self_ui = ccui.helper.doLayout(fairy);
                        var rect = cc.rect(0, 0, s.width, s.height);
                        if (cc.rectContainsPoint(rect, touchPosition)) {
                            cc.log("点中精灵");
                            self.stopAllActions();
                            self.playAnimation("die", false);
                            self.onDead(self.getPosition());
                        }
                        return true;
                    }else{
                        return false;
                    }
                },
            });
            cc.eventManager.addListener(listener, this);
        };
        this.bindClickFairyEvent();
        this.addChild(this.node);
    },
    playAnimation: function (name, falg) {
        this.animation.play(name, falg);
    },
    initFly: function(type){

        var move1 = cc.moveTo(4, cc.p(0, 300));

        var move2 = cc.moveTo(4, cc.p(600, 300));

        var reversal = cc.callFunc(function () {
            this.node.setScale(-1, 1);
        }, this);
        var normal = cc.callFunc(function () {
            this.node.setScale(1, 1);
        }, this);
        var removeNode = cc.callFunc(function () {
            this.parent.reset();
            this.removeFromParent(true);
        }, this);
        if(type == 1){
            this.dropMove = cc.jumpTo(0.2,cc.p(600,300),0,1);
            this.sequence = cc.sequence(reversal, this.dropMove, move1, normal, move2, reversal, move1, removeNode);
        }else{
            this.dropMove = cc.jumpTo(0.2,cc.p(0,300),0,1);
            this.sequence = cc.sequence(normal, this.dropMove, move2, reversal, move1, normal, move2, removeNode);
        }
        this.runAction(this.sequence);
    },

    onDead: function (position) {
        this.animationState = 'die';
        var a = cc.delayTime(0.5);
        var b = cc.fadeTo(1.0, 0);
        this.node.runAction(cc.sequence(cc.callFunc(function(){
            this.parent.addChild(new ChestUnit(position));
        },this) ,a,b, cc.callFunc(function () {
            this.removeFromParent(true);
        }, this)));
    }
});
/*var FairyUnit = FlySpirit.extend({
 ctor: function () {
 this._super(res.fairy01_json);
 this.playAnimation("run",true);
 var self = this;
 this.bindClickFairyEvent = function () {
 var listener = cc.EventListener.create({
 event: cc.EventListener.MOUSE,
 swallowTouches: true,
 onMouseDown: function (touch, event) {
 //self.FairyUnit.convert
 var touchPosition = self.parent.convertToNodeSpace(touch.getLocation());
 var selfPosition = self.parent.convertToNodeSpace(self.getPosition());

 var s = self.getContentSize();
 var rect = cc.rect(0, 0, s.width, s.height);
 if (cc.rectContainsPoint(rect, touchPosition)){
 cc.log("获取金币");
 self.stopAllActions();
 self.playAnimation("die",false);
 self.onDead();
 }
 //self.FairyUnit.removeFromParent(true);
 //self.FairyUnit.flyAway();
 //self.ChestUnit.stopAllActions();
 //self.ChestUnit.downOut();
 //self.removeFromParent(true);
 return true;
 },
 });
 cc.eventManager.addListener(listener, this);
 };
 this.bindClickFairyEvent();
 },
 flyAway:function(){
 var move1 = cc.moveTo(2, cc.p(0, 600));
 this.runAction(cc.sequence(move1 , cc.callFunc(function () {
 this.removeFromParent(true);
 }, this)));
 },
 onDead:function(){
 var a = cc.delayTime(0.5);
 var b = cc.fadeTo(0.5, 0);
 this.runAction(cc.sequence(a,b,cc.callFunc(function () {
 this.removeFromParent(true);
 }, this)));
 }
 });
 var ChestUnit = FlySpirit.extend({
 ctor: function () {
 this._super(res.chest03_json);
 },
 downOut:function(){
 var move1= cc.moveTo(2, cc.p(330, 450));
 var move2 = cc.moveTo(2, cc.p(330, 0));
 this.runAction(cc.sequence(move1,cc.callFunc(function () {
 this.playAnimation("open",false);

 }, this),move2,cc.callFunc(function () {
 this.removeFromParent(true);
 }, this)));

 }
 });*/
