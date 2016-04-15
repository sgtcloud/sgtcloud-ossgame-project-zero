/*var HeroDescScene = cc.Scene.extend({
    ctor: function (hero) {
        this._super();
        this.heroDesc = new HeroDesc(hero);
        this.heroDesc.setPosition(0,0);
        this.addChild(this.heroDesc);
    },
    onEnter: function () {

    }
});*/
var HeroDesc = cc.Node.extend({

    ctor: function () {
        this._super();
    },
    initData: function (hero) {
        this.heroDesc = ccs.csLoader.createNode(res.hero_desc_json);
        var skillDescRoot = ccs.csLoader.createNode(res.skill_desc_json).getChildByName('root');
        var root = this.heroDesc.getChildByName('root');
        var skillList = root.getChildByName('skill').getChildByName('skill_list');
        var heroLayer = root.getChildByName('hero');

        var icon = heroLayer.getChildByName('hero_icon');
        var heroName_text = heroLayer.getChildByName('heroName_text');
        var lv = heroLayer.getChildByName('heroLevel_text');
        var heroDescText = heroLayer.getChildByName('heroDesc_text');
        var heroProperty = root.getChildByName('heroProperty').getChildByName('root');
        var atkText = heroProperty.getChildByName('atk_text');
        var tapText = heroProperty.getChildByName('tap_text');
        var lifeText = heroProperty.getChildByName('life_text');
        var atkPeriodText = heroProperty.getChildByName('atk_period_text');
        var ctrChanceText = heroProperty.getChildByName('ctr_chance_text');
        var ctrModifyText = heroProperty.getChildByName('ctr_modify_text');

        setIgnoreContentAdaptWithSize([atkText,tapText,lifeText,atkPeriodText,ctrChanceText,ctrModifyText]);
        icon.loadTexture("res/icon/heroes/" + hero.getIcon());
        heroName_text.setString(hero.getName());
        lv.setString('Lv.' + hero.getLv() + "/" + hero.getMaxLevel());
        heroDescText.setString(hero.getDesc());
        setFont([heroName_text,/*lv,*/heroDescText]);
        atkText.setString(hero.getAttack());
        tapText.setString(hero.getHit());
        lifeText.setString(parseInt(hero.getLife()));
        ctrChanceText.setString(hero.getCtrChance()*100+"%");
        ctrModifyText.setString(hero.getCtrModify()*100+"%");
        atkPeriodText.setString(hero.getAnimateDelay());
        cc.log(hero.getAttack() +","+hero.getHit()+","+hero.getLife()+","+hero.getCtrChance()+","+hero.getCtrModify()+","+hero.getAnimateDelay());
        skillList.removeAllChildren();
        for (var i = 0; i < hero.getSkillCount(); i++) {
            var skillData = hero.getSkillData(i);
            var skillRoot = skillDescRoot.clone();
            var skillIcon = skillRoot.getChildByName('skill_icon');
            var skillNameText = skillRoot.getChildByName('skillName_text');
            var skillLevelText = skillRoot.getChildByName('skillLevel_text');
            var skillDescText = skillRoot.getChildByName('skillDesc_text');
            skillIcon.loadTexture("res/icon/skills/" + skillData.getIcon());
            skillNameText.setString(skillData.getName());
            skillLevelText.setString('Lv.' + skillData.getLv() + "/" + skillData.getMaxLevel());
            skillDescText.setString(/*skillData.getDesc()*/this._buildSkillDesc(skillData));
            setFont([skillNameText,/*skillLevelText,*/skillDescText]);
            skillList.addChild(skillRoot);
        }
        var backBtn = root.getChildByName('btn').getChildByName('back_btn');
        backBtn.addClickEventListener(function(){
            GamePopup.closePopup(this.heroDesc);
        }.bind(this));
        GamePopup.openPopup(this.heroDesc);
    },
    //根据模板生成技能效果描述
    _buildSkillDesc: function(skill) {
        var effects = skill.traverseSkillEffects();
        return buildDesc(effects, skill.getDesc(), {"duration": skill.getLevelData()['duration']});
    }
});

