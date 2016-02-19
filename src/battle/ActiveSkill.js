/**
 * Created by highkay on 2016/1/14.
 */

//主动技能效果
var ActiveSkill = cc.Class.extend({

    TYPE_ONCE: "TYPE_ONCE",
    TYPE_BUFF: "TYPE_BUFF",
    TYPE_CONTINUOUS: "TYPE_CONTINUOUS",
    shock: 0,

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
                    this.loadSkillEffectRes(res.skill_magma_blaster, this.targets.length);
                    this.shock = 2;
                } else if (effects[j].type === "multi_damage_once") {
                    this.type = this.TYPE_ONCE;
                    this.effectValue = effects[j].value;
                    this.loadSkillEffectRes(res.skill_tornado_shock, this.targets.length);
                    this.shock = 2;
                } else if (effects[j].type === "multi_recover_once") {
                    this.type = this.TYPE_ONCE;
                    this.effectValue = effects[j].value * -1;
                    this.loadSkillEffectRes(res.skill_cure_totem, this.targets.length);
                } else if (effects[j].type.indexOf("buff") === 0) {
                    this.type = this.TYPE_BUFF;
                    this.effectValue = effects[j].value;
                    this.loadSkillEffectRes("res/icon/skills/" + skill.getIcon(), this.targets.length);
                } else if (effects[j].type === "multi_damage_continuous") {
                    this.type = this.TYPE_CONTINUOUS;
                    this.effectValue = effects[j].value;
                    this.loadSkillEffectRes(res.skill_fury_crawl, this.targets.length);
                } else {
                    cc.log("not a active skill effect:" + effects[j].type);
                }
            }
        }
    },

    loadSkillEffectRes: function (name, num) {
        this.hitEffects = [];
        for (var i = 0; i < num; i++) {
            if (name.lastIndexOf("json") != -1) {
                this.hitEffects[i] = new CCSUnit();
                this.hitEffects[i].initSprite(name, null, "boom");
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
            if (this.shock > 0) {
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

    ctor: function (battle) {
        this._super(null, battle);
        this.targets = [];
        this.loadSkillEffectRes(res.tap_effect_json, 1);
        this.type = this.TYPE_ONCE;
    },

    cast: function (target) {
        this.effectAnimFinishCount = 0;
        this.runSkillEffect(target, this.hitEffects[0], "boom" + getRandomInt(1, 4));
        target.doDamage(PlayerData.getTotalHit());
    }
});