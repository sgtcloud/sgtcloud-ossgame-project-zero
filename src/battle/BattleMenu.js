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
                var buff_text = btnlayer.getChildByName('buff_text');//buff文字
                var buffNum_text = btnlayer.getChildByName('buffNum_text');//buff数
                var lock = btnlayer.getChildByName('lock');
                var level_text = btnlayer.getChildByName('level_text');
                var add = btnlayer.getChildByName('add');
                var cut = btnlayer.getChildByName('cut');
                lock.setVisible(false);
                level_text.setVisible(false);
                upMax_text.setVisible(false);
                gold_text.ignoreContentAdaptWithSize(true);
                var elements = {
                    gold: gold,
                    goldText: gold_text,
                    upMaxText: upMax_text,
                    lock: lock,
                    levelText: level_text,
                    buffText: buff_text,
                    buffNum: buffNum_text,
                    btn: btn,
                    add: add,
                    cut: cut
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
                    elements.add.isVisible() && elements.add.setVisible(false);
                    elements.cut.isVisible() && elements.cut.setVisible(false);
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
                        elements.buffNum.setString(Math.abs(nextLevelAttack - levelAttack));
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

            function setFont(target) {
                if (target instanceof Array) {
                    for (var i in target) {
                        target[i].setFontName("微软雅黑");
                        target[i].setColor(cc.color(0, 0, 0))
                    }
                }
                else {
                    target.setFontName("微软雅黑");
                    target.setColor(cc.color(0, 0, 0))
                }
            }

            function buildHeroView(hero) {
                var root = heroTemp.clone();
                var icon = root.getChildByName('hero_icon');
                var lv = root.getChildByName('level_text');
                var dps_text = root.getChildByName('dps_text');
                var dps = root.getChildByName('dps');
                var heroName_text = root.getChildByName("heroName_text");
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
                var revive_text = btnlayer.getChildByName('revive_text');
                var per = btnlayer.getChildByName('per');
                per.setVisible(false);
                buffNum_text.ignoreContentAdaptWithSize(true);
                dps.ignoreContentAdaptWithSize(true);
                dps_text.ignoreContentAdaptWithSize(true);
                diamond_text.setVisible(false);
                diamond.setVisible(false);
                icon.loadTexture("res/icon/heroes/" + hero.getIcon());
                heroName_text.setString(hero.getName());
                lv.setString('Lv.' + hero.getLv() + "/" + hero.getMaxLevel());
                dps_text.setString(parseInt(hero.getAttack()));
                setFont([heroName_text, lv, buff_text]);
                if (hero.getLife() > 0) {
                    die_text.setVisible(false);
                    die_time_text.setVisible(false);
                    revive_text.setVisible(false);
                }
                customEventHelper.bindListener(EVENT.HERO_UPGRADE_BTN, function (event) {
                    if (!hero.isMaxLevel()) {
                        var nextlevelData = hero.getLevelData(hero.getLv() + 1);
                        if (validateAmountEnough(nextlevelData['upgrade'])) {
                            btn.setEnabled(false);
                            btn.setBright(false);
                            gold_text.setColor(cc.color(255, 0, 0));
                        } else {
                            btn.setEnabled(true);
                            btn.setBright(true);
                            gold_text.setColor(cc.color(255, 255, 255));
                        }
                    }
                });

                customEventHelper.bindListener(EVENT.HERO_DIE, function (event) {
                    die_text.setVisible(true);
                    die_time_text.setVisible(true);
                    revive_text.setVisible(true);
                });
                customEventHelper.bindListener(EVENT.HERO_REVIVE, function (event) {
                    die_text.setVisible(false);
                    die_time_text.setVisible(false);
                    revive_text.setVisible(false);
                });


                setElement(root, hero, function (event, otherBtn) {
                    if (hero.getLife() <= 0) {
                        return;
                    }
                    var eventData = {};
                    var levelData = hero.getLevelData();
                    var levelAttack = levelData['attack'];
                    eventData.heroId = hero.getId();
                    var cost = hero.getNextLevelUpgrade();
                    cost['value'] = 0 - cost['value'];
                    eventData.cost = cost;
                    hero.upgrade();
                    lv.setString('Lv.' + hero.getLv() + '/' + hero.getMaxLevel());
                    dps_text.setString(parseInt(hero.getAttack()));
                    customEventHelper.sendEvent(EVENT.HERO_UPGRADE, eventData);
                    if (hero.isMaxLevel()) {
                        event.setEnabled(false);
                        event.setBright(false);
                        otherBtn.upMaxText.setVisible(true);
                        otherBtn.buffText.setVisible(false);
                        otherBtn.buffNum.setVisible(false);
                        otherBtn.gold.setVisible(false);
                        otherBtn.goldText.setVisible(false);
                        otherBtn.add.isVisible() && otherBtn.add.setVisible(false);
                        otherBtn.cut.isVisible() && otherBtn.cut.setVisible(false);
                    } else {
                        var nextlevelData = hero.getLevelData(hero.getLv() + 1);
                        var nextLevelAmount = nextlevelData['upgrade']['value'];
                        var nextLevelAttack = nextlevelData['attack'];
                        otherBtn.goldText.setString(nextLevelAmount);
                        var diffValue = nextLevelAttack - levelAttack;
                        showAddOrCut(otherBtn.add, otherBtn.cut, diffValue);
                        otherBtn.buffNum.setString(Math.abs(diffValue));
                        customEventHelper.sendEvent(EVENT.GOLD_VALUE_UPDATE);
                    }
                    cc.log('current hero[' + hero.getId() + ']\'s Lv is ' + hero.getLv());
                });

                return root;
            }

            function showAddOrCut(add, cut, showEffect) {
                if (showEffect > 0) {
                    add.isVisible() || add.setVisible(true);
                    cut.isVisible() && cut.setVisible(false);
                } else {
                    add.isVisible() && add.setVisible(false);
                    cut.isVisible() || cut.setVisible(true);
                }
            }

            function initSkillView(hero, skill, elements) {
                if (!canUnlockSkill(hero, skill)) {
                    elements.lock.setVisible(true);
                    elements.btn.setEnabled(false);
                    elements.btn.setBright(false);
                    elements.level_text.setVisible(true);
                    elements.gold.setVisible(false);
                    elements.gold_text.setVisible(false);
                    elements.buff_text.setVisible(false);
                    elements.buffNum_text.setVisible(false);
                    elements.add.setVisible(false);
                    elements.cut.setVisible(false);
                } else {
                    unlockAndInitSkill(skill, elements);
                }
            }

            function unlockAndInitSkill(skill, elements) {
                elements.lock.setVisible(false);
                elements.btn.setEnabled(true);
                elements.btn.setBright(true);
                elements.level_text.setVisible(false);
                elements.gold.setVisible(true);
                elements.gold_text.setVisible(true);
                elements.buff_text.setVisible(true);
                elements.buffNum_text.setVisible(true);
                var gold_text = elements.gold_text, buffNum_text = elements.buffNum_text, add = elements.add, cut = elements.cut;
                var effects = skill.traverseSkillEffects();
                var nextlevelData = skill.getLevelData(skill.getLv() + 1);
                var nextAmount = nextlevelData['upgrade']['value'];
                var nextEffects = skill.traverseSkillEffects(skill.getLv() + 1);
                gold_text.setString(nextAmount);
                var showEffect = nextEffects[0].value - effects[0].value;
                buffNum_text.ignoreContentAdaptWithSize(true);
                elements.buff_text.setString(SkillEffectMappings[nextEffects[0]['type']]['name']);
                showAddOrCut(add, cut, showEffect);
                if (SkillEffectMappings[nextEffects[0]['type']]['type'] === 'rate') {
                    elements.per.setVisible(true);
                } else {
                    elements.per.setVisible(false);
                }
                buffNum_text.setString(Math.abs(parseInt(showEffect)));
            }

            //根据模板生成技能效果描述
            function buildSkillDesc(skill, levelData) {
                var effects = skill.traverseSkillEffects();
                var effectsObj = {};
                for (var i in effects) {
                    var map = SkillEffectMappings[effects[i]['type']];
                    var alas = map['name'];
                    // var obj= effectsObj[effects[i]['name']]={};
                    var value = effects[i]['value'];
                    effectsObj[effects[i]['name']] = {}
                    effectsObj[effects[i]['name']]['name'] = alas;
                    effectsObj[effects[i]['name']]['value'] = map['type'] === 'rate' ? (value + '%') : value;
                }
                var desc = skill.getDesc().mapping(effectsObj)
                return desc;
            }

            function canUnlockSkill(hero, skill) {
                var heroLv = hero.getLv();
                var unlockLevel = skill.getUnlockLevel();
                return !(heroLv < unlockLevel);
            }

            function buildSkillView(skill, hero) {
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
                var add = btnlayer.getChildByName('add');
                var cut = btnlayer.getChildByName('cut');
                var level_text = btnlayer.getChildByName('level_text');//解锁等级
                icon.loadTexture("res/icon/skills/" + skill.getIcon());
                name.setString(skill.getName());
                desc.setString(buildSkillDesc(skill));
                lv.setString('Lv.' + skill.getLv() + "/" + skill.getMaxLevel());
                level_text.setString("Lv." + skill.getUnlockLevel())
                level_text.setColor(cc.color(255, 0, 0));
                var per = btnlayer.getChildByName('per');
                per.setVisible(false);
                per.ignoreContentAdaptWithSize(false);
                setFont([name, desc, lv, level_text, buff_text]);
                var elements = {};
                elements.gold_text = gold_text;
                elements.gold = gold;
                elements.buffNum_text = buffNum_text;
                elements.buff_text = buff_text;
                elements.add = add;
                elements.cut = cut;
                elements.btn = btn;
                elements.lock = lock;
                elements.level_text = level_text;
                elements.per = per;
                initSkillView(hero, skill, elements);
                customEventHelper.bindListener(EVENT.HERO_SKILL_UPGRADE_BTN, function (event) {
                        if (canUnlockSkill(hero, skill)) {
                            if (!skill.isMaxLevel()) {
                                var nextlevelData = skill.getLevelData(skill.getLv() + 1);
                                if (validateAmountEnough(nextlevelData['upgrade'])) {
                                    btn.setEnabled(false);
                                    btn.setBright(false);
                                    gold_text.setColor(cc.color(255, 0, 0));
                                } else {
                                    btn.setEnabled(true);
                                    btn.setBright(true);
                                    gold_text.setColor(cc.color(255, 255, 255));
                                }
                            }
                        }
                    }
                );
                customEventHelper.bindListener(EVENT.HERO_UPGRADE, function () {
                    if (canUnlockSkill(hero, skill) && elements.lock.isVisible()) {
                        unlockAndInitSkill(skill, elements);
                    }
                })
                setElement(root, skill, function (event, otherBtn) {
                    var eventData = {};
                    var cost = skill.getNextLevelUpgrade();
                    cost['value'] = -cost['value'];
                    eventData.cost = cost;
                    eventData.skillId = skill.getId();
                    var levelData = skill.getLevelData();
                    var effects = skill.traverseSkillEffects();
                    skill.upgrade();
                    desc.setString(buildSkillDesc(skill));
                    lv.setString('Lv.' + skill.getLv() + "/" + skill.getMaxLevel());
                    customEventHelper.sendEvent(EVENT.HERO_SKILL_UPGRADE, eventData);
                    if (skill.isMaxLevel()) {
                        otherBtn.btn.setEnabled(false);
                        otherBtn.btn.setBright(false);
                        otherBtn.upMaxText.setVisible(true);
                        otherBtn.buffText.setVisible(false);
                        otherBtn.buffNum.setVisible(false);
                        otherBtn.gold.setVisible(false);
                        otherBtn.goldText.setVisible(false);
                        otherBtn.add.isVisible() && otherBtn.add.setVisible(false);
                        otherBtn.cut.isVisible() && otherBtn.cut.setVisible(false);
                        per.setVisible(false);
                    } else {
                        var nextlevelData = skill.getLevelData(skill.getLv() + 1);
                        var nextAmount = nextlevelData['upgrade']['value'];
                        var nextEffects = skill.traverseSkillEffects(skill.getLv() + 1);
                        otherBtn.goldText.setString(nextAmount);
                        var showEffect = nextEffects[0].value - effects[0].value;
                        showAddOrCut(otherBtn.add, otherBtn.cut, showEffect);
                        otherBtn.buffNum.setString(Math.abs(parseInt(showEffect)));
                        otherBtn.buffText.setString(SkillEffectMappings[nextEffects[0]['type']]['name']);
                        if (SkillEffectMappings[nextEffects[0]['type']]['type'] === 'rate') {
                            per.setVisible(true);
                            var x=otherBtn.buffNum.getPositionX()+ otherBtn.buffNum.getWidth();
                            per.setPositionX(x+1);
                        }else {
                            per.setVisible(false);
                        }
                        customEventHelper.sendEvent(EVENT.GOLD_VALUE_UPDATE);
                    }
                    cc.log('current skill[' + skill.getId() + ']\'s Lv is ' + skill.getLv());
                });
                if (!canUnlockSkill(hero, skill)) {
                    elements.lock.setVisible(true);
                    elements.btn.setEnabled(false);
                    elements.btn.setBright(false);
                    elements.level_text.setVisible(true);
                    elements.gold.setVisible(false);
                    elements.gold_text.setVisible(false);
                    elements.buff_text.setVisible(false);
                    elements.buffNum_text.setVisible(false);
                    elements.add.setVisible(false);
                    elements.cut.setVisible(false);
                }
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
                        var _skillView = buildSkillView(skillData, heroData);
                        this.heroList.addChild(_skillView);

                        _heroView.skills = _heroView.skills || [];
                        _heroView.skills[j] = _skillView;
                    }
                }
            }
            customEventHelper.sendEvent(EVENT.HERO_UPGRADE_BTN);
            customEventHelper.sendEvent(EVENT.HERO_SKILL_UPGRADE_BTN);
        }

    })
    ;


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
            //var tap = root.getChildByName('tatk_text');

            name.setString(hero.getName());
            lv.setString(hero.getLv());
            dps.setString(hero.getAttack());
            //tap.setString(hero.getHit());

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