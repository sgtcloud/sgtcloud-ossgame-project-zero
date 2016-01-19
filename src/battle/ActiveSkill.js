/**
 * Created by highkay on 2016/1/14.
 */

//主动技能效果
var ActiveSkill = cc.Class.extend({

    TYPE_DAMAGE: "TYPE_DAMAGE",
    TYPE_BUFF: "TYPE_BUFF",
    TYPE_CONTINUOUS: "TYPE_CONTINUOUS",

    ctor: function (skill, battle) {
        //this.reuse(unit, val);
        this.skill = skill;
        this.battle = battle;
        if (skill && battle) {
            this.duration = skill.getLevelData().duration;
            var effects = skill.traverseSkillEffects();
            for (var j in effects) {
                this.effect = effects[j].type;
                // this is an once damage skill effect
                if (effects[j].type === "single_damage_once") {
                    this.type = this.TYPE_DAMAGE;
                    this.targets = [battle.findNextEnemy()];
                    this.effectValue = effects[j].value;
                    this.loadSkillEffectRes(res.skill_magma_blaster, this.targets.length);
                } else if (effects[j].type === "multi_damage_once") {
                    this.type = this.TYPE_DAMAGE;
                    this.targets = battle.getAllEnemies().getAllLived();
                    this.effectValue = effects[j].value;
                    this.loadSkillEffectRes(res.skill_fury_crawl, this.targets.length);
                } else if (effects[j].type.indexOf("buff") === 0) {
                    this.type = this.TYPE_BUFF;
                    this.targets = battle.getAllHeroes().getAllLived();
                    this.effectValue = effects[j].value;
                    this.loadSkillEffectRes("res/icon/skills/" + skill.getIcon(), this.targets.length);
                } else if (effects[j].type === "multi_damage_continuous") {
                    this.targets = battle.getAllEnemies().getAllLived();
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
        this.effectAnimCount = 0;
        if (this.hitActions[index]) {
            this.hitActions[index].play(anim, false);
            this.hitActions[index].setLastFrameCallFunc(function () {
                this.effectAnimCount++;
                if (this.effectAnimCount >= this.targets.length) {
                    if (this.type === this.TYPE_CONTINUOUS) {
                        var consumeTime = (this.skillStartTime - Date.parse(new Date())) / 1000;
                        this.duration -= consumeTime;
                        if (this.duration > 0) {
                            this.effectAnimCount = 0;
                            this.cast(node);
                            return;
                        }
                    }
                    this.onCastFinish();
                }
            }.bind(this));
        } else {
            scheduleOnce(this, function () {
                this.onCastFinish();
                this.clearBuffEffect();
            }, this.duration);
        }
        this.hitEffects[index].setPosition(pos);
        node.addChild(this.hitEffects[index], 2000 + i);
    },

    cast: function (node) {
        if (this.targets) {
            for (var i in this.targets) {
                if (this.type === this.TYPE_DAMAGE) {
                    this.runSkillEffect(node, this.targets[i].getPosition(), i, "boom");
                    this.hitEffects[i].runAction(cc.fadeIn(1));
                    this.targets[i].doDamage(this.effectValue);
                    customEventHelper.sendEvent(EVENT.SHOCK_BATTLE_FIELD, 2);
                } else if (this.type === this.TYPE_CONTINUOUS) {
                    this.skillStartTime = Date.parse(new Date());
                    this.runSkillEffect(node, this.targets[i].getPosition(), i, "boom");
                    this.hitEffects[i].runAction(cc.fadeIn(1));
                    this.targets[i].doDamage(this.effectValue);
                    customEventHelper.sendEvent(EVENT.SHOCK_BATTLE_FIELD, 2);
                } else if (this.type === this.TYPE_BUFF) {
                    // reuse the skill icon,scale to 30% to show on the top of the heroes
                    this.hitEffects[i].setScale(0.3);
                    var pos = cc.p(this.targets[i].getPositionX(), this.targets[i].getPositionY() + 100/*this.targets[i].height*/);
                    var showUp = cc.moveBy(0.3, cc.p(0, 12));
                    // least duration of a buff skill must be 1.3s
                    this.hitEffects[i].runAction(cc.sequence(cc.spawn(showUp, cc.fadeIn(0.3)), cc.delayTime(this.duration - 0.3 - 1), cc.blink(1, 10)));
                    this.runSkillEffect(node, pos, i, "boom");
                }
            }
        }
        if (this.type === this.TYPE_BUFF) {
            this.startBuffEffect();
        }
    },

    onCastFinish: function () {
        for (var i in this.hitEffects) {
            this.hitEffects[i].stopAllActions();
            this.hitEffects[i].removeFromParent();
        }
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
    },

    cast: function (node, target, pos) {
        this.targets.push(target);
        this.runSkillEffect(node, pos, 0, "boom" + getRandomInt(1, 4));
        this.targets[0].doDamage(PlayerData.getTotalHit());
    },
});