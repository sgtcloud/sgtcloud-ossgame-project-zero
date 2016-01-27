/**
 * Created by highkay on 2016/1/14.
 */

//主动技能效果
var ActiveSkill = cc.Class.extend({

    TYPE_ONCE: "TYPE_ONCE",
    TYPE_BUFF: "TYPE_BUFF",
    TYPE_CONTINUOUS: "TYPE_CONTINUOUS",
    shock: 0,

    ctor: function (skill, battle, duration) {
        //this.reuse(unit, val);
        this.skill = skill;
        this.battle = battle;
        if (skill && battle) {
            this.duration = duration || skill.getLevelData().duration;
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
        this.hitActions = [];
        for (var i = 0; i < num; i++) {
            if (name.lastIndexOf("json") != -1) {
                var skillEffectSprite = ccs.load(name);
                this.hitEffects[i] = skillEffectSprite.node;
                this.hitActions[i] = skillEffectSprite.action;
                this.hitEffects[i].runAction(this.hitActions[i]);
            } else {
                this.hitEffects[i] = new cc.Sprite(name);
            }
        }
    },

    runSkillEffect: function (node, pos, index, anim) {
        if (this.type !== this.TYPE_BUFF) {
            this.hitActions[index].play(anim, false);
            this.hitActions[index].setLastFrameCallFunc(function () {
                this.effectAnimFinishCount++;
                if (this.effectAnimFinishCount >= this.targets.length) {
                    this.onCastFinish();
                }
            }.bind(this));
        }
        this.hitEffects[index].setPosition(pos);
        node.addChild(this.hitEffects[index], 2000 + i);
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

    cast: function (node) {
        this.node = node;
        if (this.targets) {
            this.effectAnimFinishCount = 0;
            this.skillStartTime = new Date().getTime();
            for (var i in this.targets) {
                if (this.type !== this.TYPE_BUFF) {
                    this.runSkillEffect(node, this.targets[i].getPosition(), i, "boom");
                    this.hitEffects[i].runAction(cc.fadeIn(1));
                    this.targets[i].doDamage(this.effectValue);
                } else if (this.type === this.TYPE_BUFF) {
                    // reuse the skill icon,scale to 30% to show on the top of the heroes
                    // todo show more than one icon together
                    this.hitEffects[i].setScale(0.3);
                    var pos = cc.p(this.targets[i].getPositionX(), this.targets[i].getPositionY() + 100/*this.targets[i].height*/);
                    var showUp = cc.moveBy(0.3, cc.p(0, 12));
                    // least duration of a buff skill must be 1.3s
                    this.hitEffects[i].runAction(cc.sequence(cc.spawn(showUp, cc.fadeIn(0.3)), cc.delayTime(this.duration - 0.3 - 1), cc.blink(1, 10)));
                    this.runSkillEffect(node, pos, i, "boom");
                }
            }
            if (this.shock > 0) {
                customEventHelper.sendEvent(EVENT.SHOCK_BATTLE_FIELD, this.shock);
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

    onCastFinish: function () {
        for (var i in this.hitEffects) {
            this.hitEffects[i].stopAllActions();
            this.hitEffects[i].removeFromParent();
        }
        if (this.type === this.TYPE_CONTINUOUS) {
            var skillEndTime = new Date().getTime();
            var consumeTime = (skillEndTime - this.skillStartTime ) / 1000;
            this.duration -= consumeTime;
            if (this.duration > 0) {
                this.updateTargets();
                if (this.targets.length === 0) {
                    scheduleOnce(this, function () {
                        this.recast();
                    }.bind(this), 1);
                } else {
                    this.recast();
                }
            }
        }
    },

    recast: function () {
        var recast = new ActiveSkill(this.skill, this.battle, this.duration);
        recast.cast(this.node);
        unschedule(this);
    },

    startBuffEffect: function () {
        if (this.effect === "buff_gold_rate") {
            PlayerData.tmp_gold_rate += this.effectValue;
        } else if (this.effect === "buff_tap_rate") {
            PlayerData.tmp_tap_rate += this.effectValue;
        } else if (this.effect === "buff_attack_rate") {
            PlayerData.tmp_attack_rate += this.effectValue;
        } else if (this.effect === "buff_atk_period_rate") {
            PlayerData.tmp_atk_period_rate += this.effectValue;
        } else if (this.effect === "buff_ctr_chance_rate") {
            PlayerData.tmp_ctr_chance_rate += this.effectValue;
        } else if (this.effect === "buff_ctr_modify_rate") {
            PlayerData.tmp_ctr_modify_rate += this.effectValue;
        }
    },

    clearBuffEffect: function () {
        if (this.effect === "buff_gold_rate") {
            PlayerData.tmp_gold_rate -= this.effectValue;
        } else if (this.effect === "buff_tap_rate") {
            PlayerData.tmp_tap_rate -= this.effectValue;
        } else if (this.effect === "buff_attack_rate") {
            PlayerData.tmp_attack_rate -= this.effectValue;
        } else if (this.effect === "buff_atk_period_rate") {
            PlayerData.tmp_atk_period_rate -= this.effectValue;
        } else if (this.effect === "buff_ctr_chance_rate") {
            PlayerData.tmp_ctr_chance_rate -= this.effectValue;
        } else if (this.effect === "buff_ctr_modify_rate") {
            PlayerData.tmp_ctr_modify_rate -= this.effectValue;
        }
    }

});

var TapSkill = ActiveSkill.extend({

    ctor: function () {
        this._super(null, null);
        this.targets = [];
        this.loadSkillEffectRes(res.tap_effect_json, 1);
        this.type = this.TYPE_ONCE;
    },

    cast: function (node, target, pos) {
        this.effectAnimFinishCount = 0;
        this.targets.push(target);
        this.runSkillEffect(node, pos, 0, "boom" + getRandomInt(1, 4));
        this.targets[0].doDamage(PlayerData.getTotalHit());
    },
});