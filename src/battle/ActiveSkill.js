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
                } else if (effects[j].type === "magma_blaster") {
                    this.type = this.TYPE_BUFF;
                    this.targets = battle.getAllHeroes().getAllLived();
                    this.effectValue = effects[j].value;
                    this.loadSkillEffectRes("res/icon/skills/" + skill.getIcon(), this.targets.length);
                } /*else if (effects[j].type === "multi_damage_continuous") {
                 this.targets = battle.getAllEnemies().getAll();
                 this.effectValue = effects[j].value;
                 this.loadSkillEffectRes(res.skill_fury_crawl, this.targets.length);
                 } else if (effects[j].type === "multi_recover_once") {
                 this.targets = battle.getAllEnemies().getAll();
                 this.effectValue = effects[j].value;
                 this.loadSkillEffectRes(res.skill_fury_crawl, this.targets.length);
                 } else if (effects[j].type === "buff_tap_rate") {
                 this.targets = battle.getAllEnemies().getAll();
                 this.effectValue = effects[j].value;
                 this.loadSkillEffectRes(res.skill_fury_crawl, this.targets.length);
                 } else if (effects[j].type === "buff_attack_rate") {
                 this.targets = battle.getAllEnemies().getAll();
                 this.effectValue = effects[j].value;
                 this.loadSkillEffectRes(res.skill_fury_crawl, this.targets.length);
                 } else if (effects[j].type === "buff_atk_period_rate") {
                 this.targets = battle.getAllEnemies().getAll();
                 this.effectValue = effects[j].value;
                 this.loadSkillEffectRes(res.skill_fury_crawl, this.targets.length);
                 } else if (effects[j].type === "buff_ctr_chance_rate") {
                 this.targets = battle.getAllEnemies().getAll();
                 this.effectValue = effects[j].value;
                 this.loadSkillEffectRes(res.skill_fury_crawl, this.targets.length);
                 } else if (effects[j].type === "buff_ctr_modify_rate") {
                 this.targets = battle.getAllEnemies().getAll();
                 this.effectValue = effects[j].value;
                 this.loadSkillEffectRes(res.skill_fury_crawl, this.targets.length);
                 }*/ else {
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
                    this.onCastFinish();
                }
            }.bind(this));
        } else {
            scheduleOnce(this, function () {
                this.onCastFinish();
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
                    //node.addChild(this.hitEffects[i], 1000 + i);
                    //this.hitEffects[i].runAction(cc.fadeIn(1));
                    //this.runSkillEffect(this.targets[i].getPosition(), "boom");
                    //this.targets[i].doDamage(this.effectValue);
                } else if (this.type === this.TYPE_BUFF) {
                    this.hitEffects[i].setScale(0.3);
                    var pos = cc.p(this.targets[i].getPositionX(), this.targets[i].getPositionY() + 100/*this.targets[i].height*/);
                    var showUp = cc.moveBy(0.3, cc.p(0, 12));
                    this.hitEffects[i].runAction(cc.sequence(cc.spawn(showUp, cc.fadeIn(0.3)), cc.delayTime(this.duration - 0.3 - 1), cc.blink(1, 10)));
                    this.runSkillEffect(node, pos, i, "boom");
                    this.targets[i].doDamage(this.effectValue);
                }
            }
        }
    },

    onCastFinish: function () {
        for (var i in this.hitEffects) {
            this.hitEffects[i].stopAllActions();
            this.hitEffects[i].removeFromParent();
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