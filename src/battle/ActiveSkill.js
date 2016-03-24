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

    ctor: function (playerId , skill, battle, firstCastTime) {
        //this.reuse(unit, val);
        this.skill = skill;
        this.battle = battle;
        this.playerId = playerId;
        this.firstCastTime = firstCastTime;
        if (this.skill && this.battle) {
            this.duration = this.skill.getLevelData().duration;
            this.preshow = this.skill.getPreShow();
            this.type = this.skill.getEffectType();
            this.targetType = this.skill.getEffectTarget();
            this.affectDelay = this.skill.getAffectDelay();
            var effects = this.skill.traverseSkillEffects();
            for (var j in effects) {
                this.effectValue = effects[j].value;
                this.effect = effects[j].type;
            }
        }
    },

    loadSkillEffectRes: function (filename, num, defaultAnimationName) {
        this.skillEffects = [];
        for (var i = 0; i < num; i++) {
            if (filename) {
                this.skillEffects[i] = new CCSUnit();
                this.skillEffects[i].initSprite(filename, null, defaultAnimationName);
            }
        }
    },

    loadBuffIcons: function (filename, num) {
        this.buffIcons = [];
        for (var i = 0; i < num; i++) {
            if (filename) {
                this.buffIcons[i] = new cc.Sprite(filename);
            }
        }
    },

    EFFECT_ZORDER_OFFSET: 2,
    EFFECT_FS_ZORDER_OFFSET: 2000,

    playSkillEffectOnTarget: function (target, effect, anim) {
        effect.playAnimation(anim, false, function () {
            // count all the effects animations are finished
            this.effectAnimFinishCount++;
            if (this.effectAnimFinishCount >= this.targets.length) {
                this.onCastFinish();
            }
        }.bind(this));
        this.battle.addSpriteRelatedNode(target, effect, this.EFFECT_ZORDER_OFFSET);
    },

    ONE_ENEMY: 'ONE_ENEMY',
    MULTI_HERO: 'MULTI_HERO',
    ONE_HERO: 'ONE_HERO',
    MULTI_ENEMY: 'MULTI_ENEMY',

    updateTargets: function () {
        //由于当前竞技双方各一人，只需随机找到对方一个英雄即可
        if(this.battle.arenaBattle){
            this.targets = [this.battle.findRandomHero(this.playerId)];
        }else if (this.targetType === this.ONE_ENEMY) {
            this.targets = [this.battle.findNextEnemy()];
        } else if (this.targetType === this.MULTI_HERO) {
            this.targets = this.battle.getAllHeroes().getAllLived();
        } else if (this.targetType === this.ONE_HERO) {
            this.targets = [this.battle.findRandomHero()];
        } else if (this.targetType === this.MULTI_ENEMY) {
            this.targets = this.battle.getAllEnemies().getAllLived();
        }
    },

    cast: function () {
        if (this.preshow) {
            this.battle.pauseAllSprites();
            var heroShowUnit = CCSUnit.create('res/' + this.preshow);
            heroShowUnit.setPosition(320, 0);
            //heroShowUnit.runAction(cc.speed(heroShowUnit.animation, 2));
            heroShowUnit.playAnimation('show', false, function () {
                heroShowUnit.removeFromParent(true);
                this.battle.resumeAllSprites();
                this._cast();
            }.bind(this));
            this.battle.addSprite(heroShowUnit, 3000);
        } else {
            this._cast();
        }
    },

    affectTargets: function () {
        for (var i in this.targets) {
            if (this.type !== this.TYPE_BUFF && this.targets[i]) {
                this.targets[i].doDamage(this.effectValue);
            }
        }
    },

    playEffectAnimationOnTargets: function (pos, anim) {
        this.effectAnimFinishCount = 0;
        if (pos) {
            for (var i in this.skillEffects) {
                this.skillEffects[i].setPosition(pos);
                this.skillEffects[i].playAnimation(anim, false, function () {
                    this.onCastFinish();
                }.bind(this));
                this.battle.addSprite(this.skillEffects[i], this.EFFECT_FS_ZORDER_OFFSET);
            }
        } else {
            for (var i in this.targets) {
                if (this.targets[i]) {
                    this.playSkillEffectOnTarget(this.targets[i], this.skillEffects[i], anim);
                }
            }
        }
        if (this.type === this.TYPE_BUFF) {
            this.startBuffEffect();
            scheduleOnce(this, function () {
                this.onCastFinish();
                this.clearBuffEffect();
            }, this.duration);
        }
    },

    initRes: function () {
        // 'fs_enemy_once' is special , it is one effect animation but damage all enemies
        var effectResNum = (this.effect === 'fs_enemy_once' ? 1 : this.targets.length);
        this.loadSkillEffectRes('res/' + this.skill.getEffectRes(), effectResNum, "boom");
        if (this.type === this.TYPE_BUFF) {
            this.loadBuffIcons('res/icon/skills/' + this.skill.getIcon(), effectResNum);
        }
    },

    _cast: function () {
        this.updateTargets();
        if (!this.firstCastTime) {
            this.firstCastTime = new Date().getTime();
        }
        if (this.targets.length > 0) {
            this.initRes();
            if (this.effect === 'fs_damage_once') {
                var pos = this.battle.enemyUnits.getCenterPos();
            }
            this.playEffectAnimationOnTargets(pos, "boom");
            //this.affectDelay = 0.5;
            //if (this.affectDelay) {
            //    scheduleOnce(this, this.affectTargets, this.affectDelay);
            //} else {
            //}
        } else {
            this.waitForNextCast();
        }
    },

    waitForNextCast: function () {
        schedule(this, function () {
            this.updateTargets();
            if (this.targets.length > 0) {
                this.recast();
            }
        }.bind(this), 0, 0.1);
    },

    releaseEffectAnimations: function () {
        for (var i in this.skillEffects) {
            this.skillEffects[i].stopAllActions();
            this.skillEffects[i].removeFromParent();
        }
    },

    onCastFinish: function () {
        this.affectTargets();
        this.releaseEffectAnimations();
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
        recast._cast();
        unschedule(this);
    },

    startBuffEffect: function () {
        if (PlayerData[this.effect]) {
            PlayerData[this.effect] += this.effectValue;
        }
        for (var i in this.targets) {
            this.buffIcons[i].setScale(0.3);
            this.buffIcons[i].runAction(cc.sequence(cc.fadeIn(0.3), cc.delayTime(this.duration - 0.3 - 1), cc.blink(1, 10)));
            this.targets[i].addBuff(this.buffIcons[i]);
        }
    },

    clearBuffEffect: function () {
        if (PlayerData[this.effect]) {
            PlayerData[this.effect] -= this.effectValue;
        }
        for (var i in this.targets) {
            this.targets[i].removeBuff(this.buffIcons[i]);
        }
    }

});

var TapSkill = ActiveSkill.extend({

    ctor: function (battle, target) {
        this._super(null,null, battle);
        this.type = this.TYPE_ONCE;
        this.targetType = this.ONE_ENEMY;
    },

    cast: function (pos) {
        this.updateTargets();
        this.effectValue = PlayerData.getTotalHit(true);
        this.loadSkillEffectRes(res.tap_effect_json, 1);
        this.playEffectAnimationOnTargets(pos, 'boom' + getRandomInt(1, 4));
    }
});