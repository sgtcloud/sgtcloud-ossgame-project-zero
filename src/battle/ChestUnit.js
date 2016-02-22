/**
 * Created by highkay on 2015/12/29.
 */

var ChestUnit = CCSUnit.extend({

    ctor: function (battle, ccsRes, goods, chestName) {
        this._super();
        this.battle = battle;
        this.isOpen = false;
        this.initSprite(ccsRes, chestName || "chest", "close");
        this.goods = goods || {};
        bindTouchEventListener(function () {
            if (!this.isOpen) {
                this._onOpenChest();
                return true;
            }
            return false;
        }.bind(this), this);
    },

    onEnter: function () {
        this._super();
        var jump = cc.jumpBy(0.1, cc.p(0, 0), 16, 2);
        this.runAction(jump);
    },

    _onOpenChest: function () {
        this.isOpen = true;
        this.playAnimation("open");
        var delay = cc.delayTime(0.5);
        var fadeOut = cc.fadeOut(0.5);
        //var self = this;
        this.runAction(cc.sequence(cc.callFunc(function () {
            this._generateLoot();
        }.bind(this), this), delay, fadeOut, cc.callFunc(function () {
            player.statistics.total_chest_open += 1;
            this.removeFromParent(true);
        }.bind(this), this)));
    },

    CHEST_LOOT_ZORDER_OFFET: 1,

    _generateLoot: function () {
        if(player.resource.hasOwnProperty(this.goods.skill_id)){
            cc.log('获取金币');
            var goldValue = Math.floor(PlayerData.getStageData().getMoneyTreeRatio() * this.goods.level);
            //toggleTip({'delay':2.0,'text':'恭喜获得： '+ CONSTS.resources_mapping[goods.propId] + " * " + goods.num + '花费'+ CONSTS.resources_mapping[price.unit] + " * " + price.value});
            this.battle.addSpriteRelatedNodes(this, Loot.generateLoots({
                "unit": "gold",
                "value": goldValue
            }), this.CHEST_LOOT_ZORDER_OFFET);
        } else {
            //发送释放buff事件
            cc.log('释放buff');
            customEventHelper.sendEvent(EVENT.CAST_SKILL_READY, {
                skillId: this.goods.skill_id,
                level: this.goods.level
            });
        }
        if (this.goods.skill_id == 'gold') {

        }
        else {

        }
        cc.log(this.goods.chestStyle + " , " + this.goods.skill_id + " , " + this.goods.level);
    }
});
