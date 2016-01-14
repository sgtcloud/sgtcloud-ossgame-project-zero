/**
 * Created by highkay on 2015/12/29.
 */

//英雄扩展类
var HeroUnit = BattleUnit.extend({
    ctor: function (battle, data) {
        this._super(battle, data, BattleConsts.Camp.Player);
        this.recover = 0;
        this.cooldown = 0;
        this.data = data;

        //血条的NODE
        var lifeNode = ccs.csLoader.createNode(res.hero_blood_json);
        lifeNode.setAnchorPoint(0.5, 0.5);
        this.addChild(lifeNode);

        //血条组件的引用
        this.lifeBar = lifeNode.getChildByName('root').getChildByName('blood_bar');
        //刷新刷条
        this.refreshLifeBar = function () {
            var max = this.data.getLife();
            this.lifeBar.setPercent(this.data.getCurrentLife() / max * 100);
        };
        this.getLife = function () {
            return this.data.getCurrentLife();
        };
        this.isDead = function () {
            return this.data.getCurrentLife() <= 0;
        };
        this.onAttacked = function () {
            var target = battle.findNextEnemy();
            if (target) {
                this.playAnimation('atk');
                var rand = Math.random();
                var ctr_chance = this.data.getCtrChance();
                //cc.log("ctr:" + rand + "/" + ctr_chance);
                if (rand < ctr_chance) {
                    customEventHelper.sendEvent(EVENT.SHOCK_BATTLE_FIELD, 2);
                    target.doDamage(this.data.getAttack(), this.data.getCtrModify());
                } else {
                    target.doDamage(this.data.getAttack());
                }
            }
        };
        this.changeLife = function (val) {
            this.data.changeLife(val);
        };
        this.onDamaged = function () {
            this.refreshLifeBar();
        };
        this.onDead = function () {
            this.recover = this.data.getRecover();
            customEventHelper.sendEvent(EVENT.HERO_DIE, this.data);
            battle.onHeroDead(this);
            //var lost = battle.checkPlayerLost();
            //if(lost){
            //  battle.resetBattle();
            //}
        };
        //复活时被调用的
        this.onRecover = function () {
            this.changeLife(this.getMaxLife());
            this.reset();
            this.refreshLifeBar();
            battle.onHeroRecover(this);
        };
        this.reset = function () {
            this.animateTime = 0;
            this.node.runAction(cc.fadeIn(1.0));
            this.playAnimation('stand');
        }
        //使用主动技能时被调用
        this.onUseSkill = function () {

        };
        //复活的当前时间
        this.getRecover = function () {
            return this.recover;
        };
        //技能的当前CD
        this.getCooldown = function () {
            return this.cooldown;
        };
        //复活倒计时逻辑
        this.onUpdateDead = function (dt) {
            this.recover = Math.max(0, this.recover - dt);
            if (this.recover <= 0) {
                customEventHelper.sendEvent(EVENT.HERO_REVIVE, this.data);
                this.onRecover();
            } else {
                customEventHelper.sendEvent(EVENT.HERO_REVIVE_COUNTDOWN, {
                    id: this.data.getId(),
                    recover: this.recover
                });
            }
        };
        this.isActive = function () {
            return !this.data.isLocked();
        };
        this.refreshLifeBar();

        var self = this;
        customEventHelper.bindListener(EVENT.HERO_UPGRADE, function (event) {
            // 暂时不需要改
        });
        customEventHelper.bindListener(EVENT.HERO_SKILL_UPGRADE, function (event) {
            self.data.refreshProps();
            PlayerData.refreshGlobeProps();
        });
        customEventHelper.bindListener(EVENT.HERO_EQUIP_UPGRADE, function (event) {
            self.data.refreshProps();
            PlayerData.refreshGlobeProps();
        });
    }
});