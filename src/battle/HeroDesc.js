var HeroDescScene = cc.Scene.extend({

    onEnter: function (hero, skills) {
        this.heroDesc = new HeroDesc(hero, skills);
        this.heroDesc.setPosition(0, 0);
        this.addChild(this.heroDesc);
    }
});
var HeroDesc = cc.Node.extend({

    ctor: function (hero) {
        this._super();
        this.heroDesc = ccs.csLoader.createNode(res.hero_desc_json);
        this.initData(hero);
    },

    initData: function (hero) {

        var root = this.heroDesc.getChildByName('root');

        var icon = root.getChildByName('hero_icon');
        var heroName_text = root.getChildByName('heroName_text');
        var lv = root.getChildByName('level_text');
        var dps_text = root.getChildByName('dps_text');
        var heroDescText = root.getChildByName('heroDesc_text');
        root.getChildByName('upgrade_btn').setVisible(false);
        root.getChildByName('revive_btn').setVisible(false);
        root.getChildByName('MaxLevel_btn').setVisible(false);
        dps_text.ignoreContentAdaptWithSize(true);
        icon.loadTexture("res/icon/heroes/" + hero.getIcon());
        icon.setTouchEnabled(true);
        heroName_text.setString(hero.getName());
        lv.setString('Lv.' + hero.getLv() + "/" + hero.getMaxLevel());
        dps_text.setString(parseInt(hero.getLife()));
        heroDescText.setString(hero.getDesc());
        for (var i = 0; i < hero.getSkillCount(); i++) {
            var skillData = hero.getSkillData(i);
            var _skillView = buildSkillView(skillData, hero);
            this.heroList.addChild(_skillView);

            root.skills = root.skills || [];
            root.skills[i] = _skillView;
        }
    }
});

