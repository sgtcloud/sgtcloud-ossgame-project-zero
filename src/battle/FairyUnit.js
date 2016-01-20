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
        var random = getRandomInt(0, 2);
        this.initFly(random);
        var self = this;
        this.bindClickFairyEvent = function () {
            var listener = cc.EventListener.create({
                event: cc.EventListener.MOUSE,
                swallowTouches: true,
                onMouseDown: function (touch, event) {
                    //self.FairyUnit.convert
                    if (self.animationState == 'run') {
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
                    } else {
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
    initFly: function (type) {

        var move1 = cc.moveTo(4, cc.p(0, 280));

        var move2 = cc.moveTo(4, cc.p(600, 280));

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
        if (type == 1) {
            this.setPosition(cc.p(600, 600));
            var dropMove = cc.jumpTo(0.2, cc.p(600, 280), 0, 1);
            this.sequence = cc.sequence(reversal, dropMove, move1, normal, move2, reversal, move1, removeNode);
        } else {
            this.setPosition(cc.p(0, 600));
            var dropMove = cc.jumpTo(0.2, cc.p(0, 280), 0, 1);
            this.sequence = cc.sequence(normal, dropMove, move2, reversal, move1, normal, move2, removeNode);
        }
        this.runAction(this.sequence);
    },
    onDead: function (position) {
        this.animationState = 'die';
        var a = cc.delayTime(0.5);
        var b = cc.fadeTo(1.0, 0);
        var self = this;
        this.node.runAction(cc.sequence(cc.callFunc(function () {
            self.getRandomEvent();
            self.createChest(position);
        }, this), a, b, cc.callFunc(function () {
            self.removeFromParent(true);
        }, this)));
    },
    createChest: function (position) {
        var res = this.getRandomEvent();
        this.chestUnit = new ChestUnit("res/"+res["chestStyle"],res);
        this.chestUnit.setPosition(position);
        this.runChest(res);
        var self = this;
        this.chestUnit.clickChest(function (goods) {
            self.chestUnit.stopAllActions();
            self.chestUnit.playAnimation('open', false);
            self.onOpenChest(goods);
        });
        this.getParent().addChild(this.chestUnit, 2011);
    },
    runChest: function (res) {
        var jumpPos = cc.p(Math.random() * 108 - 54, Math.random() * 36 - 16);
        var appear = cc.jumpBy(0.2, jumpPos, 24, 1);
        var delay = cc.delayTime(5);
        var self = this;
        var removeNode = cc.callFunc(function () {
            //打开
            self.chestUnit.playAnimation('open', false);
            self.onOpenChest(res);
        }, this.chestUnit);
        this.chestUnit.runAction(cc.sequence(appear, cc.delayTime(1), delay, removeNode));
    },
    generateLoot: function (rate) {
        var pos = cc.p(this.chestUnit.getPositionX() + this.chestUnit.getParent().getPositionX(), this.chestUnit.getPositionY() + this.chestUnit.getParent().getPositionY());
        var goldValue = Math.floor(PlayerData.getStageData().getMoneyTreeRatio() * rate);
        Loot.generateLoots({
            "unit": "gold",
            "value": goldValue
        }, pos);
    },
    onOpenChest: function (res) {
        this.chestUnit.animationState = 'open';
        var a = cc.delayTime(0.5);
        var b = cc.fadeTo(0.5, 0);
        var self = this;
        this.chestUnit.runAction(cc.sequence(cc.callFunc(function () {
            //self.getRandomEvent();
            if (res.skill_id == 'gold') {
                cc.log('获取金币');
                self.generateLoot(res.level);
            } else {
                //发送释放buff事件
                cc.log('释放buff');
                customEventHelper.sendEvent(EVENT.CAST_BUFF, {
                    skillId: res.skill_id,
                    level: res.level
                });
            }
            cc.log(res.weight + " , " + res.skill_id + " , " + res.level);
            self.chestUnit.parent.reset();
        }, this.chestUnit), a, b, cc.callFunc(function () {
            self.chestUnit.removeFromParent(true);
        }, this.chestUnit)));
    },
    getRandomEvent: function () {
        var events = CONSTS.click_chest_random_events;
        var total_weight = 0;
        for (var i in events) {
            total_weight += events[i].weight;
        }
        var random = getRandomInt(1, total_weight);
        var temp_weight = 0;
        for (var i in events) {
            var event = events[i];
            temp_weight += event.weight;
            if (random < temp_weight) {
                return event;
                //break;
            }
        }
    }
});