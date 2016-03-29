/**
 * 小精灵vm类
 *
 * Created by highkay on 2015/12/29.
 */
var FairyUnit = CCSUnit.extend({

    ctor: function (battle) {
        this._super();
        this.battle = battle;
        this.debug = true;
        this.initSprite(res.fairy01_json, "fairy01");
        this.setAnchorPoint(cc.p(0.5, 0));
        this.playAnimation("run", true);
        var random = getRandomInt(0, 2);
        this.initRoute(random);
        bindTouchEventListener(function () {
            if (!this.dead) {
                //cc.log("点中精灵");
                this.stopAllActions();
                this.playAnimation("die", false);
                this.onDead();
                return true;
            }
            return false;
        }.bind(this), this, true);

        customEventHelper.bindListener(EVENT.FIGHT_ARENA_BATTLE, function () {
            this.removeFromParent(true);
        }.bind(this));

    },

    initRoute: function (type) {

        var move1 = cc.moveTo(4, cc.p(0, 40));

        var move2 = cc.moveTo(4, cc.p(640, 40));

        var reversal = cc.scaleTo(0, -1, 1);
        var normal = cc.scaleTo(0, 1, 1);
        var removeNode = cc.callFunc(function () {
            customEventHelper.sendEvent(EVENT.RESET_FAIRY_COUNTDOWN);
            this.removeFromParent();
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

    onDead: function () {
        this.dead = true;
        var delay = cc.delayTime(0.5);
        var disappear = cc.fadeOut(1.0);
        this.stopAllActions();
        this.runAction(cc.sequence(cc.callFunc(function () {
            this._createChest();
        }.bind(this), this), delay, disappear, cc.callFunc(function () {
            player.statistics.total_fairy += 1;
            customEventHelper.sendEvent(EVENT.RESET_FAIRY_COUNTDOWN);
            this.removeFromParent();
        }.bind(this), this)));
    },

    _createChest: function () {
        var loot = this._generateChestLoots();
        var chestUnit = new ChestUnit(this.battle, "res/" + loot.chestStyle, loot);
        this.battle.addSpriteRelatedNode(this, chestUnit, 1);
    },

    _generateChestLoots: function () {
        return new Chance(CONSTS.click_chest_random_events).next();
    }
});