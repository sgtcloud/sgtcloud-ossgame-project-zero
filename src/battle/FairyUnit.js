/**
 * Created by highkay on 2015/12/29.
 */
var FairyUnit = cc.Node.extend({
    ctor: function () {
        this._super();
        var json = ccs.load(res.fairy01_json);
        this.node = json.node.getChildByName("fairy01");
        this.node.removeFromParent();
        this.animation = json.action;
        this.animationState = 'run';
        {
            //去除CCS导出文件位移会自带缓动效果的问题
            var timelines = this.animation.getTimelines();
            removeCCSAnimationDefaultTween(timelines);
        }
        this.node.runAction(this.animation);

        this.playAnimation("run", true);
        var random = getRandomInt(0, 2);
        this.initFly(random);
        //this.setContentSize(100, 100);
        //var self = this;
        bindTouchEventListener(function () {
            if (this.animationState === 'run') {
                cc.log("点中精灵");
                this.stopAllActions();
                this.playAnimation("die", false);
                this.onDead(this.getPosition());
            }
            return true;
        }.bind(this), this);
        /*fairy.bindClickFairyEvent = function () {
         var listener = cc.EventListener.create({
         event: cc.EventListener.TOUCH_ONE_BY_ONE,
         swallowTouches: false,
         onTouchBegan: function (touch, event) {
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
         return true;
         }
         }
         return false;
         },
         });
         cc.eventManager.addListener(listener, fairy);
         };
         fairy.bindClickFairyEvent();*/
        this.addChild(this.node);
    },
    playAnimation: function (name, flag) {
        this.animation.play(name, flag);
    },
    initFly: function (type) {

        var move1 = cc.moveTo(4, cc.p(0, 40));

        var move2 = cc.moveTo(4, cc.p(640, 40));

        var reversal = cc.callFunc(function () {
            this.node.setScale(-1, 1);
        }, this);
        var normal = cc.callFunc(function () {
            this.node.setScale(1, 1);
        }, this);
        var removeNode = cc.callFunc(function () {
            customEventHelper.sendEvent(EVENT.RESET_FAIRY_COUNTDOWN);
            this.removeFromParent(true);
        }, this);
        var dropMove;
        if (type == 1) {
            this.setPosition(cc.p(640, 180));
            dropMove = cc.jumpTo(0.2, cc.p(640, 40), 0, 1);
            this.sequence = cc.sequence(reversal, dropMove, move1, normal, move2, reversal, move1, removeNode);
        } else {
            this.setPosition(cc.p(0, 180));
            dropMove = cc.jumpTo(0.2, cc.p(0, 40), 0, 1);
            this.sequence = cc.sequence(normal, dropMove, move2, reversal, move1, normal, move2, removeNode);
        }
        this.runAction(this.sequence);
    },
    onDead: function (position) {
        this.animationState = 'die';
        var a = cc.delayTime(0.5);
        var b = cc.fadeTo(1.0, 0);
        //var self = this;
        this.node.runAction(cc.sequence(cc.callFunc(function () {
            this.createChest(position);
        }.bind(this), this), a, b, cc.callFunc(function () {
            player.statistics.total_fairy += 1;
            customEventHelper.sendEvent(EVENT.RESET_FAIRY_COUNTDOWN);
            this.removeFromParent(true);
        }.bind(this), this)));
    },
    createChest: function (position) {
        this.getRandomEvent(function (res) {
            this.chestUnit = new ChestUnit("res/" + res.chestStyle, res);
            this.chestUnit.setPosition(position);
            this.runChest(res);
            //var self = this;
            this.chestUnit.clickChest(function (goods) {
                this.chestUnit.stopAllActions();
                this.chestUnit.playAnimation('open', false);
                this.onOpenChest(goods);
                return false;
            }.bind(this));
            this.getParent().addChild(this.chestUnit, 2011);
        }.bind(this));
    },
    runChest: function (res) {
        var jumpPos = cc.p(Math.random() * 108 - 54, Math.random() * 36 - 16);
        var appear = cc.jumpBy(0.2, jumpPos, 24, 1);
        var delay = cc.delayTime(5);
        //var self = this;
        var removeNode = cc.callFunc(function () {
            //打开
            this.chestUnit.playAnimation('open', false);
            this.onOpenChest(res);
        }.bind(this), this.chestUnit);
        this.chestUnit.runAction(cc.sequence(appear, cc.delayTime(1), delay, removeNode));
    },
    generateLoot: function (rate) {
        var pos = this.getPosition();
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
        //var self = this;
        this.chestUnit.runAction(cc.sequence(cc.callFunc(function () {
            if (res.skill_id == 'gold') {
                cc.log('获取金币');
                this.generateLoot(res.level);
            } else {
                //发送释放buff事件
                cc.log('释放buff');
                customEventHelper.sendEvent(EVENT.CAST_SKILL_READY, {
                    skillId: res.skill_id,
                    level: res.level
                });
            }
            cc.log(res.chestStyle + " , " + res.skill_id + " , " + res.level);
        }.bind(this), this.chestUnit), a, b, cc.callFunc(function () {
            player.statistics.total_chest_open += 1;
            this.chestUnit.removeFromParent(true);
        }.bind(this), this.chestUnit)));
    },
    getRandomEvent: function (callback) {
        var events = CONSTS.click_chest_random_events;
        var chance = new Chance(events);
        var res = chance.next();
        return callback(res);
        /*var total_weight = 0;
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
         }*/
    }
});