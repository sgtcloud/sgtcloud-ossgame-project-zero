/**
 * Created by highkay on 2016/1/14.
 */

//主动技能效果
var ActiveSkill = cc.Node.extend({

    ctor: function (skill, battle) {
        this._super();
        //this.reuse(unit, val);
        this.skill = skill;
        this.battle = battle;
        if (skill && battle) {
            var effects = skill.traverseSkillEffects();
            for (var j in effects) {
                // this is an once damage skill effect
                if (effects[j].type === "magma_blaster") {
                    this.loadSkillEffectRes(res.skill_magma_blaster);
                    this.target = battle.findNextEnemy();
                    this.damage = effects[j].value;
                }
            }
        }
    },

    loadSkillEffectRes: function (name) {
        this.skillEffectSprite = ccs.load(name);
        this.hitEffect = this.skillEffectSprite.node;
        this.hitAction = this.skillEffectSprite.action;
        this.hitEffect.setVisible(false);
        this.hitEffect.runAction(this.hitAction);
        this.addChild(this.hitEffect);
    },

    runSkillEffect: function (pos, anim) {
        this.setPosition(pos);
        this.hitEffect.setVisible(true);
        this.hitAction.play(anim, false);
        this.hitAction.setLastFrameCallFunc(function () {
            this.removeFromParent(true);
            this.onCastFinish();
        }.bind(this));
    },

    cast: function () {
        if (this.target) {
            this.runSkillEffect(this.target.getPosition(), "boom");
        }
        this.target.doDamage(this.damage);
    },

    onCastFinish: function () {
    }

});

var TapSkill = ActiveSkill.extend({

    ctor: function () {
        this._super(null, null);
        this.loadSkillEffectRes(res.tap_effect_json);
    },

    cast: function (target, pos) {
        this.target = target;
        this.runSkillEffect(pos, "boom" + getRandomInt(1, 4));
        this.target.doDamage(PlayerData.getTotalHit());
    },
});