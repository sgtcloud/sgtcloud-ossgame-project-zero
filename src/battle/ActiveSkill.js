/**
 * 英雄单体
 life_value 提升生命值
 life_rate 提升生命比例
 attack_value 提升秒伤值
 attack_rate 提升秒伤比例
 tap_value 提升秒伤比例
 tap_rate 提升点伤比例
 ctr_chance 暴击概率
 ctr_modify 暴击倍率
 atk_period 攻速（攻击间隔周期）

 全局
 globe_life_value
 globe_life_rate
 globe_attack_value
 globe_attack_rate
 globe_tap_value
 globe_tap_rate
 globe_atk_period_rate
 globe_ctr_chance_rate
 globe_ctr_modify_rate
 globe_gold_rate 提升金币获得比例

 buff
 tmp_attack_rate 临时提升秒伤比例
 tmp_tap_rate 临时提升点伤比例
 tmp_atk_period_rate 临时提升攻速比例
 tmp_ctr_chance_rate 临时提升暴击概率
 tmp_ctr_modify_rate 临时提升暴击倍率

 主动技能
 single_damage_once 单次单体伤害 （原来的magma_blaster，需要修改！）
 multi_damage_once 单次全体伤害
 buff_gold_rate 限定时间内提升金币获得比例
 multi_damage_continuous 持续群体伤害
 multi_recover_once 单次全体回复生命
 buff_tap_rate 限定时间内提升点伤比例
 buff_attack_rate 限定时间内提升秒伤比例
 buff_atk_period_rate 限定时间内提升攻速比例
 buff_ctr_chance_rate 限定时间内提升暴击概率
 buff_ctr_modify_rate 限定时间内提升暴击倍率
 * @constructor
 */

//主动技能效果
var ActiveSkill = cc.Class.extend({

    TYPE_ONCE: "TYPE_ONCE",
    TYPE_BUFF: "TYPE_BUFF",
    TYPE_CONTINUOUS: "TYPE_CONTINUOUS",

    ctor: function (skill, battle, firstCastTime) {
        //this.reuse(unit, val);
        this.skill = skill;
        this.battle = battle;
        this.firstCastTime = firstCastTime;
        if (skill && battle) {
            this.duration = skill.getLevelData().duration;
            var effects = skill.traverseSkillEffects();
            for (var j in effects) {
                this.effect = effects[j].type;
                this.updateTargets();
                // this is an once damage skill effect
                if (effects[j].type === "single_damage_once") {
                    this.type = this.TYPE_ONCE;
                    this.effectValue = effects[j].value;
                    this.loadSkillEffectRes(res.skill_magma_blaster, this.targets.length, "boom");
                    this.shock = 2;
                } else if (effects[j].type === "multi_damage_once") {
                    this.type = this.TYPE_ONCE;
                    this.effectValue = effects[j].value;
                    this.loadSkillEffectRes(res.skill_tornado_shock, this.targets.length, "boom");
                    this.shock = 2;
                } else if (effects[j].type === "multi_recover_once") {
                    this.type = this.TYPE_ONCE;
                    this.effectValue = effects[j].value * -1;
                    this.loadSkillEffectRes(res.skill_cure_totem, this.targets.length, "boom");
                } else if (effects[j].type.indexOf("buff") === 0) {
                    this.type = this.TYPE_BUFF;
                    this.effectValue = effects[j].value;
                    this.loadSkillEffectRes("res/icon/skills/" + skill.getIcon(), this.targets.length, "boom");
                } else if (effects[j].type === "multi_damage_continuous") {
                    this.type = this.TYPE_CONTINUOUS;
                    this.effectValue = effects[j].value;
                    this.loadSkillEffectRes(res.skill_fury_crawl, this.targets.length, "boom");
                } else if (effects[j].type === "fs_damage_once") {
                    this.type = this.TYPE_ONCE;
                    this.effectValue = effects[j].value;
                    this.loadSkillEffectRes(res.skill_big_bang, this.targets.length, "boom");
                } else {
                    cc.log("not a active skill effect:" + effects[j].type);
                }
            }
        }
    },

    loadSkillEffectRes: function (name, num, defaultAnimName) {
        this.hitEffects = [];
        for (var i = 0; i < num; i++) {
            if (name.lastIndexOf("json") != -1) {
                this.hitEffects[i] = new CCSUnit();
                this.hitEffects[i].initSprite(name, null, defaultAnimName);
            } else {
                this.hitEffects[i] = new cc.Sprite(name);
            }
        }
    },

    EFFECT_ZORDER_OFFSET: 2,

    runSkillEffect: function (target, effect, anim) {
        if (this.type !== this.TYPE_BUFF) {
            effect.playAnimation(anim, false, function () {
                // count all the effects animations are finished
                this.effectAnimFinishCount++;
                if (this.effectAnimFinishCount >= this.targets.length) {
                    this.onCastFinish();
                }
            }.bind(this));
        }
        this.battle.addSpriteRelatedNode(target, effect, this.EFFECT_ZORDER_OFFSET);
    },

    updateTargets: function () {
        if (this.effect === "single_damage_once") {
            this.targets = [this.battle.findNextEnemy()];
        } else if (this.effect === "multi_recover_once") {
            this.targets = this.battle.getAllHeroes().getAllLived();
        } else if (this.effect.indexOf("buff") === 0) {
            this.targets = this.battle.getAllHeroes().getAllLived();
        } else {
            this.targets = this.battle.getAllEnemies().getAllLived();
        }
    },

    cast: function () {
        var heroShowUnit = CCSUnit.create(res.hero101skill01);
        heroShowUnit.setPosition(320, 0);
        //heroShowUnit.runAction(cc.speed(heroShowUnit.animation, 2));
        heroShowUnit.playAnimation('show', false, function () {
            heroShowUnit.removeFromParent(true);
        });
        this.battle.addSprite(heroShowUnit, 3000);
        if (!this.firstCastTime) {
            this.firstCastTime = new Date().getTime();
        }
        if (this.targets.length !== 0) {
            this.effectAnimFinishCount = 0;
            for (var i in this.targets) {
                if (this.type !== this.TYPE_BUFF && this.targets[i]) {
                    this.runSkillEffect(this.targets[i], this.hitEffects[i], "boom");
                    this.targets[i].doDamage(this.effectValue);
                }
            }
            if (this.shock) {
                customEventHelper.sendEvent(EVENT.SHOCK_BATTLE_FIELD, this.shock);
            }
            if (this.type === this.TYPE_BUFF) {
                this.startBuffEffect();
                scheduleOnce(this, function () {
                    this.onCastFinish();
                    this.clearBuffEffect();
                }, this.duration);
            }
        } else {
            this.waitForNextCast();
        }
    },

    waitForNextCast: function () {
        schedule(this, function () {
            this.updateTargets();
            if (this.targets.length !== 0) {
                this.recast();
            }
        }.bind(this), 0, 0.1);
    },

    onCastFinish: function () {
        for (var i in this.hitEffects) {
            this.hitEffects[i].stopAllActions();
            this.hitEffects[i].removeFromParent();
        }
        if (this.type === this.TYPE_CONTINUOUS) {
            var skillEndTime = new Date().getTime();
            var consumeTime = (skillEndTime - this.firstCastTime ) / 1000;
            if (this.duration > consumeTime) {
                this.waitForNextCast();
            }
        }
    },

    recast: function () {
        var recast = new ActiveSkill(this.skill, this.battle, this.firstCastTime);
        recast.cast();
        unschedule(this);
    },

    startBuffEffect: function () {
        if (PlayerData[this.effect]) {
            PlayerData[this.effect] += this.effectValue;
        }
        for (var i in this.targets) {
            this.hitEffects[i].setScale(0.3);
            this.hitEffects[i].runAction(cc.sequence(cc.fadeIn(0.3), cc.delayTime(this.duration - 0.3 - 1), cc.blink(1, 10)));
            this.targets[i].addBuff(this.hitEffects[i]);
        }
    },

    clearBuffEffect: function () {
        if (PlayerData[this.effect]) {
            PlayerData[this.effect] -= this.effectValue;
        }
        for (var i in this.targets) {
            this.targets[i].removeBuff(this.hitEffects[i]);
        }
    }

});

var TapSkill = ActiveSkill.extend({

    ctor: function (battle, target) {
        this._super(null, battle);
        this.targets = [target];
        this.loadSkillEffectRes(res.tap_effect_json, 1);
        this.type = this.TYPE_ONCE;
    },

    TAP_ZORDER_OFFSET: 999,

    cast: function (pos) {
        this.effectAnimFinishCount = 0;
        this.hitEffects[0].playAnimation("boom" + getRandomInt(1, 4), false, function () {
            // count all the effects animations are finished
            this.effectAnimFinishCount++;
            if (this.effectAnimFinishCount >= this.targets.length) {
                this.onCastFinish();
            }
        }.bind(this));
        this.hitEffects[0].setPosition(pos);
        this.battle.addSprite(this.hitEffects[0], this.TAP_ZORDER_OFFSET);
        this.targets[0].doDamage(PlayerData.getTotalHit(true));
    }
});