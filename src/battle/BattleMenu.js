var MenuBtn = function (btn) {
    this.button = btn.getChildByName('btn');
}
//UI的Menu父类
var BattleMenu = cc.Node.extend({
    ctor: function (battle, res) {
        this._super();
        var layer = ccs.csLoader.createNode(res);
        this.addChild(layer);
        this.root = layer.getChildByName('root');

        //大部分Menu有显示玩家金钱的组件，但是位置不同，所以写了这个组件作为父类
        //这里是处理刷新金钱的显示
        //this.playerGoldText = this.root.getChildByName('goldLayer').getChildByName('root').getChildByName('gold_text');
        /*this.updatePlayerGoldText = function () {
         this.playerGoldText.setString(player.getGold());
         };*/

        this.onHeroDead = function () {
        }
        this.onHeroRecover = function () {
        }
    }
});
//UI上显示的技能ICON
var SkkillIcon = function (battle, root, index) {
    this.button = root.getChildByName('skill_btn');
    this.deadTimeTitle = root.getChildByName('die_text');
    this.deadTimeText = root.getChildByName('die_time_text');
    this.coolTimeText = root.getChildByName('CD_time_text');

    this.deadTimeTitle.setVisible(false);
    this.deadTimeText.setVisible(false);
    this.coolTimeText.setVisible(false);

    this.button.addClickEventListener(function () {
        cc.log("you click skill_btn" + index);
    });

    this.setVisible = function (visit) {
        root.setVisible(visit);
    }
    this.showDead = function () {
        this.deadTimeTitle.setVisible(true);
        this.deadTimeText.setVisible(true);
        this.coolTimeText.setVisible(false);
    }
    this.showCooldown = function () {
        this.deadTimeTitle.setVisible(false);
        this.deadTimeText.setVisible(false);
        this.coolTimeText.setVisible(true);
    }
    this.showActive = function () {
        this.deadTimeTitle.setVisible(false);
        this.deadTimeText.setVisible(false);
        this.coolTimeText.setVisible(false);
    }
    this.setDeadTime = function (time) {
        this.deadTimeText.setString(time);
    }
    this.setCoolTime = function (time) {
        this.coolTimeText.setString(time);
    }
    this.setEnabled = function (state) {
        this.button.setEnabled(state);
        this.button.setBright(state);
    }
}
var SkillListMenu = BattleMenu.extend({
    ctor: function (battlePanel) {
        var skillBtnNum = 7;
        this._super(battlePanel, res.skill_layer_json);
        var skills = [];
        for (var i = 0; i < skillBtnNum; i++) {
            var pane = this.root.getChildByName('skill' + (i + 1)).getChildByName('root');
            var skill = new SkkillIcon(battlePanel, pane, i);
            if (i < player.heroes.length) {
                skill.setVisible(true);
            } else {
                skill.setVisible(false);
            }
            skills[i] = skill;
        }
        function format(time) {
            return new Date(time).Format('mm:ss');
        }

        //为了显示CD和复活的时候显示的格式
        Date.prototype.Format = function (fmt) { //author: meizz
            var o = {
                "M+": this.getMonth() + 1, //�·�
                "d+": this.getDate(), //��
                "h+": this.getHours(), //Сʱ
                "m+": this.getMinutes(), //��
                "s+": this.getSeconds(), //��
                "q+": Math.floor((this.getMonth() + 3) / 3), //����
                "S": this.getMilliseconds() //����
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }

        this.refreshSkillState = function () {
            for (var i = 0; i < skillBtnNum; i++) {
                skills[i].setVisible(false);
            }
            battlePanel.foreachHeroSprite(function (hero, i) {
                var skill = skills[i];
                skill.setVisible(true);
                skill.setEnabled(true);
                if (hero.isDead()) {
                    skill.showDead();
                } else {
                    if (hero.getCooldown() > 0) {
                        skill.showCooldown();
                    } else {
                        skill.showActive();
                    }
                }
            });
        }

        this.update = function (dt) {
            battlePanel.foreachHeroSprite(function (hero, i) {
                var skill = skills[i];
                if (hero.isDead()) {
                    skill.setDeadTime(format(hero.getRecover() * 1000));
                } else if (hero.getCooldown() > 0) {
                    skill.setCoolTime(format(hero.getCooldown() * 1000));
                }
            });
        }
        this.onHeroDead = function (_hero) {
            this.refreshSkillState();
        }
        this.onHeroRecover = function (hero) {
            this.refreshSkillState();
        }

        this.refreshSkillState();
        this.scheduleUpdate();
    }
});


var HeroListMenu = BattleMenu.extend({
    ctor: function (battle) {
        this._super(battle, res.hero_layer_json);

        this.heroList = this.root.getChildByName('hero_list');

        var heroTemp = ccs.csLoader.createNode(res.hero_view_json).getChildByName('root');
        var skillTemp = ccs.csLoader.createNode(res.skill_view_json).getChildByName('root');
        var that = this;

        function setElement(root, target, listener) {
            var btnlayer = root.getChildByName('btn')
            var btn = btnlayer.getChildByName('btn');//升级按钮
            var gold = btnlayer.getChildByName('gold');//消耗金币
            var gold_text = btnlayer.getChildByName('gold_text');//消耗金币
            var upMax_text = btnlayer.getChildByName('upMax_text');//已满级
            var diamond_text = btnlayer.getChildByName('diamond_text');//钻石文字
            var diamond = btnlayer.getChildByName('diamond');//钻石图标
            var buff_text = btnlayer.getChildByName('buff_text');//buff文字
            var buffNum_text = btnlayer.getChildByName('buffNum_text');//buff数
            var lock = btnlayer.getChildByName('lock');
            var level_text = btnlayer.getChildByName('level_text');
            lock.setVisible(false);
            level_text.setVisible(false);
            upMax_text.setVisible(false);
          //  diamond_text.setVisible(false);
           // diamond.setVisible(false);
            var elements = {
                gold: gold,
                goldText: gold_text,
                upMaxText: upMax_text,
                lock: lock,
                levelText: level_text,
                buffText: buff_text,
                buffNum: buffNum_text,
                btn: btn
            }
            initView(root, target, elements, listener)
        }

        function initView(root, target, elements, listener) {
            if (target.isMaxLevel()) {
                elements.btn.setEnabled(false);
                elements.btn.setBright(false);
                elements.upMaxText.setVisible(true);
                elements.buffText.setVisible(false);
                elements.buffNum.setVisible(false);
                elements.gold.setVisible(false);
                elements.goldText.setVisible(false);
            } else {
                var nextlevelData = target.getLevelData(target.getLv() + 1);
                var nextLevelAttack = nextlevelData['attack'];
                var unit = nextlevelData['upgrade']['unit'];
                var amount = PlayerData.getAmountByUnit(unit);
                var nextGoldValue = nextlevelData['upgrade']['value'];
                if (amount < nextGoldValue) {
                    cc.log(unit + ' not enough')
                }
                var levelData = target.getLevelData();
                var levelAttack = levelData['attack'];
                if (nextGoldValue) {
                    elements.goldText.setString(nextGoldValue);
                }
                if (nextLevelAttack) {
                    elements.buffNum.setString('+' + (nextLevelAttack - levelAttack));
                }
                elements.btn.addClickEventListener(function (event) {
                    listener(event, elements)
                })
            }
        }

        function underLevel(root, target, elements) {
            // TODO
        }

        function maxLevel(root, target, elements) {
            if (target.isMaxLevel()) {
                elements.btn.setEnabled(false);
                elements.btn.setBright(false);
                elements.upMaxText.setVisible(true);
                elements.buffText.setVisible(false);
                elements.buffNum.setVisible(false);
                elements.gold.setVisible(false);
                elements.goldText.setVisible(false);
            }
            // TODO
        }

        function validateAmountEnough(upgradeLevelData) {
            var amount = PlayerData.getAmountByUnit(upgradeLevelData['unit']);
            return amount < upgradeLevelData['value'];
        }


        function buildHeroView(hero) {
            var root = heroTemp.clone();
            var name = root.getChildByName('heroName_text');
            var icon = root.getChildByName('hero_icon');
            var lv = root.getChildByName('level_text');
            var dps = root.getChildByName('dps_text');
            var heroName_text=root.getChildByName("heroName_text");
            //var stars = root.getChildByName('stars_fore');
            //var currentLv = hero.getLv();
            var btnlayer = root.getChildByName('btn')
            var die_text = root.getChildByName('die_text')
            var die_time_text = root.getChildByName('die_time_text')
            var btn = btnlayer.getChildByName('btn');//升级按钮
            var gold = btnlayer.getChildByName('gold');//消耗金币
            var gold_text = btnlayer.getChildByName('gold_text');//消耗金币
            var upMax_text = btnlayer.getChildByName('upMax_text');//已满级
            var diamond_text = btnlayer.getChildByName('diamond_text');//钻石文字
            var diamond = btnlayer.getChildByName('diamond');//钻石图标
            var buff_text = btnlayer.getChildByName('buff_text');//buff文字
            var buffNum_text = btnlayer.getChildByName('buffNum_text');//buff数
            var lock = btnlayer.getChildByName('lock');
            var level_text = btnlayer.getChildByName('level_text');
            icon.loadTexture("res/icon/heroes/"+hero.getIcon());
            heroName_text.setString(hero.getName());
            name.setString(hero.getName());
            lv.setString('Lv.' + hero.getLv()+"/"+hero.getMaxLevel());
            dps.setString(hero.getAttack());
            if(hero.getLife()>0){
                die_text.setVisible(false);
                die_time_text.setVisible(false);
            }
            customEventHelper.bindListener(EVENT.HERO_UPGRADE_BTN, function (event) {
                if (!hero.isMaxLevel()) {
                    var nextlevelData = hero.getLevelData(hero.getLv() + 1);
                    if (validateAmountEnough(nextlevelData['upgrade'])) {
                        btn.setEnabled(false);
                        btn.setBright(false);
                        gold_text.setColor(cc.color(255, 0, 0));
                    }else {
                        btn.setEnabled(true);
                        btn.setBright(true);
                        gold_text.setColor(cc.color(255, 255, 255));
                    }
                }
            });

            customEventHelper.bindListener(EVENT.HERO_DIE,function(event){
                die_text.setVisible(true);
                die_time_text.setVisible(true);
            });
            customEventHelper.bindListener(EVENT.HERO_REVIVE,function(event){
                die_text.setVisible(false);
                die_time_text.setVisible(false);
                //hero.getSkills()
            });


            setElement(root, hero, function (event, otherBtn) {
                if(hero.getLife()<=0){

                    return ;
                }
                var eventData = {};
                var levelData = hero.getLevelData();
                var levelAttack = levelData['attack'];
                eventData.heroId = hero.getId();
                var cost = hero.getNextLevelUpgrade();
                cost['value'] = 0 - cost['value'];
                eventData.cost = cost;
                hero.upgrade();
                lv.setString('Lv.' + hero.getLv()+'/'+hero.getMaxLevel());
                dps.setString(hero.getAttack());
                customEventHelper.sendEvent(EVENT.HERO_UPGRADE, eventData);
                if (hero.isMaxLevel()) {
                    otherBtn.btn.setEnabled(false);
                    otherBtn.btn.setBright(false);
                    otherBtn.upMaxText.setVisible(true);
                    otherBtn.buffText.setVisible(false);
                    otherBtn.buffNum.setVisible(false);
                    otherBtn.gold.setVisible(false);
                    otherBtn.goldText.setVisible(false);
                } else {
                    var nextlevelData = hero.getLevelData(hero.getLv() + 1);
                    var nextLevelAmount = nextlevelData['upgrade']['value'];
                    var nextLevelAttack = nextlevelData['attack'];
                    otherBtn.goldText.setString(nextLevelAmount);
                    var diffValue = nextLevelAttack - levelAttack;
                    otherBtn.buffNum.setString((diffValue > 0 ? '+' : '-') + Math.abs(diffValue));
                    customEventHelper.sendEvent(EVENT.GOLD_VALUE_UPDATE);
                }
                cc.log('current hero[' + hero.getId() + ']\'s Lv is ' + hero.getLv());
            });
            for (var i = 0; i < 5; i++) {
                //var star = stars.getChildByName('icon0');
                //if(i<hero.getStar()){
                //  star.setVisible(true);
                //}else{
                //  star.setVisible(false);
                //}
            }

            return root;
        }

        function initSkillView(skill,gold_text,buffNum_text){
            var effects = skill.traverseSkillEffects();
            var nextlevelData = skill.getLevelData(skill.getLv() + 1);
            var nextAmount = nextlevelData['upgrade']['value'];
            var nextEffects = skill.traverseSkillEffects(skill.getLv() + 1);
            gold_text.setString(nextAmount);
            var showEffect = nextEffects[0].value - effects[0].value;
            buffNum_text.setString((showEffect > 0 ? '+' : '-') + Math.abs(showEffect));
        }
        function buildSkillView(skill) {
            var root = skillTemp.clone();
            var icon = root.getChildByName('skill_icon');
            var name = root.getChildByName('skillName_text');
            var desc = root.getChildByName('skill_text');
            var lv = root.getChildByName('skillLevel_text');
            var btnlayer = root.getChildByName('btn')
            var btn = btnlayer.getChildByName('btn');//升级按钮
            var gold = btnlayer.getChildByName('gold');//消耗金币
            var gold_text = btnlayer.getChildByName('gold_text');//消耗金币
            var upMax_text = btnlayer.getChildByName('upMax_text');//已满级
            var diamond_text = btnlayer.getChildByName('diamond_text');//钻石文字
            var diamond = btnlayer.getChildByName('diamond');//钻石图标
            var buff_text = btnlayer.getChildByName('buff_text');//buff文字
            var buffNum_text = btnlayer.getChildByName('buffNum_text');//buff数
            var lock = btnlayer.getChildByName('lock');
            var level_text = btnlayer.getChildByName('level_text');
            icon.loadTexture("res/icon/skills/"+skill.getIcon());
            name.setString(skill.getName());
            desc.setString(skill.getDesc());
            lv.setString('Lv.' +skill.getLv()+"/"+skill.getMaxLevel());
            initSkillView(skill,gold_text,buffNum_text);
            customEventHelper.bindListener(EVENT.HERO_SKILL_UPGRADE_BTN, function (event) {
                if (!skill.isMaxLevel()) {
                    var nextlevelData = skill.getLevelData(skill.getLv() + 1);
                    if (validateAmountEnough(nextlevelData['upgrade'])) {
                        btn.setEnabled(false);
                        btn.setBright(false);
                        gold_text.setColor(cc.color(255, 0, 0));
                    }else {
                        btn.setEnabled(true);
                        btn.setBright(true);
                        gold_text.setColor(cc.color(255, 255, 255));
                    }
                }
            });

            setElement(root, skill, function (event, otherBtn) {
                var eventData = {};
                var cost = skill.getNextLevelUpgrade();
                cost['value'] = -cost['value'];
                eventData.cost = cost;
                eventData.skillId = skill.getId();
                var levelData = skill.getLevelData();
                var effects = skill.traverseSkillEffects();
                skill.upgrade();
                lv.setString('Lv.' +skill.getLv()+"/"+skill.getMaxLevel());
                customEventHelper.sendEvent(EVENT.HERO_SKILL_UPGRADE, eventData);
                //var amount = levelData['upgrade']['value'];
                //var levelAttack=levelData['attack'];

                if (skill.isMaxLevel()) {
                    otherBtn.btn.setEnabled(false);
                    otherBtn.btn.setBright(false);
                    otherBtn.upMaxText.setVisible(true);
                    otherBtn.buffText.setVisible(false);
                    otherBtn.buffNum.setVisible(false);
                    otherBtn.gold.setVisible(false);
                    otherBtn.goldText.setVisible(false);
                } else {
                    var nextlevelData = skill.getLevelData(skill.getLv() + 1);
                    var nextAmount = nextlevelData['upgrade']['value'];
                    var nextEffects = skill.traverseSkillEffects(skill.getLv() + 1);
                    otherBtn.goldText.setString(nextAmount);
                    var showEffect = nextEffects[0].value - effects[0].value;
                    otherBtn.buffNum.setString((showEffect > 0 ? '+' : '-') + Math.abs(showEffect));
                    customEventHelper.sendEvent(EVENT.GOLD_VALUE_UPDATE);
                }
                cc.log('current skill[' + skill.getId() + ']\'s Lv is ' + skill.getLv());
            });

            return root;
        }

        this.views = {};
        {//填充英雄的列表 循环填充英雄+技能
            for (var i = 0; i < player.heroes.length; i++) {
                var heroData = PlayerData.getHeroesData(i);
                var _heroView = buildHeroView(heroData);
                this.heroList.addChild(_heroView);

                this.views.heros = this.views.heros || [];
                this.views.heros[i] = _heroView;

                for (var j = 0; j < heroData.getSkillCount(); j++) {
                    var skillData = heroData.getSkillData(j);
                    var _skillView = buildSkillView(skillData);
                    this.heroList.addChild(_skillView);

                    _heroView.skills = _heroView.skills || [];
                    _heroView.skills[j] = _skillView;
                }
            }
        }
        customEventHelper.sendEvent(EVENT.HERO_UPGRADE_BTN);
        customEventHelper.sendEvent(EVENT.HERO_SKILL_UPGRADE_BTN);
    }

});


var EquipListMenu = BattleMenu.extend({
    ctor: function (battle) {
        this._super(battle, res.equip_layer_json);

        this.heroList = this.root.getChildByName('equip_list');

        var heroView = ccs.csLoader.createNode(res.equip_hero_view_json).getChildByName('root');
        var equipView = ccs.csLoader.createNode(res.equip_view_json).getChildByName('root');

        function buildHeroView(hero) {
            var root = heroView.clone();
            var icon = root.getChildByName('hero_icon');
            var name = root.getChildByName('heroName_text');
            var lv = root.getChildByName('level_text');
            var dps = root.getChildByName('dps_text');
            var tap = root.getChildByName('tatk_text');

            name.setString(hero.getName());
            lv.setString(hero.getLv());
            dps.setString(hero.getAttack());
            tap.setString(hero.getHit());

            return root;
        }

        function buildEquipView(equip) {
            var root = equipView.clone();
            var icon = root.getChildByName('equip_icon');
            var name = root.getChildByName('equipName_text');
            var desc = root.getChildByName('equipBuffDecs_text');
            var lv = root.getChildByName('equipLevel_text');

            name.setString(equip.getName());
            desc.setString(equip.getDesc());
            lv.setString(equip.getLv());

            return root;
        }

        this.views = {};
        {

            for (var i = 0; i < player.heroes.length; i++) {
                var heroData = PlayerData.getHeroesData(i);
                var _heroView = buildHeroView(heroData);
                this.heroList.addChild(_heroView);

                this.views.heros = this.views.heros || [];
                this.views.heros[i] = _heroView;

                for (var j = 0; j < heroData.getEquipCount(); j++) {
                    var equipData = heroData.getEquipData(j);
                    var _equipView = buildEquipView(equipData);
                    this.heroList.addChild(_equipView);

                    _heroView.equips = _heroView.equips || [];
                    _heroView.equips[j] = _equipView;
                }
            }
        }
    }
});