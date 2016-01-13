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
                var per = btnlayer.getChildByName('per');
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
                    cut: cut,
                    per: per
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
                    elements.per && elements.per.setVisible(false);
                } else {
                    var nextlevelData = target.getLevelData(target.getLv() + 1);
                    var nextLevelLife = nextlevelData['life'];
                    var unit = nextlevelData['upgrade']['unit'];
                    var amount = PlayerData.getAmountByUnit(unit);
                    var nextGoldValue = nextlevelData['upgrade']['value'];
                    if (amount < nextGoldValue) {
                        cc.log(unit + ' not enough')
                    }
                    var levelData = target.getLevelData();
                    var levelLife = levelData['life'];
                    if (nextGoldValue) {
                        elements.goldText.setString(nextGoldValue);
                    }
                    if (nextLevelLife) {
                        elements.buffNum.setString(Math.abs(parseInt(nextLevelLife - levelLife)));
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
                var add = btnlayer.getChildByName('add');
                var cut = btnlayer.getChildByName('cut');
                per.setVisible(false);
                buffNum_text.ignoreContentAdaptWithSize(true);
                dps.ignoreContentAdaptWithSize(true);
                dps_text.ignoreContentAdaptWithSize(true);
                diamond_text.ignoreContentAdaptWithSize(true);
                diamond_text.setVisible(false);
                diamond.setVisible(false);
                icon.loadTexture("res/icon/heroes/" + hero.getIcon());
                heroName_text.setString(hero.getName());
                lv.setString('Lv.' + hero.getLv() + "/" + hero.getMaxLevel());
                dps_text.setString(parseInt(hero.getLife()));
                setFont([heroName_text, lv, buff_text]);
                if (hero.getLife() > 0) {
                    die_text.setVisible(false);
                    die_time_text.setVisible(false);
                    revive_text.setVisible(false);
                }
                customEventHelper.bindListener(EVENT.HERO_REFRESH_PROPS, function () {
                    hero.refreshProps();
                    dps_text.setString(parseInt(hero.getLife()));
                })
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
                    var dieHero = event.getUserData();
                    var heroId = dieHero.getId();
                    if (heroId === hero.getId()) {
                        die_text.setVisible(true);
                        die_time_text.setVisible(true);
                        revive_text.setVisible(true);
                        buff_text.setVisible(false);
                        buffNum_text.setVisible(false);
                        gold.setVisible(false);
                        gold_text.setVisible(false);
                        upMax_text.setVisible(false);
                        diamond_text.setVisible(true);
                        var resurge = hero.getResurge();
                        diamond_text.setString(parseInt(resurge['cost']['value']));
                        add.isVisible() && add.setVisible(false);
                        cut.isVisible() && cut.setVisible(false);
                        diamond.setVisible(true);
                        if (!btn.isEnabled()) {
                            btn.setEnabled(true);
                            btn.setBright(true);
                        }
                    }
                });
                customEventHelper.bindListener(EVENT.HERO_REVIVE, function (event) {
                    var heroId = event.getUserData().getId();
                    if (heroId === hero.getId()) {
                        die_text.setVisible(false);
                        die_time_text.setVisible(false);
                        revive_text.setVisible(false);
                        buff_text.setVisible(true);
                        buffNum_text.setVisible(true);
                        gold.setVisible(true);
                        gold_text.setVisible(true);
                        if (hero.isMaxLevel()) {
                            upMax_text.setVisible(true);
                            if (btn.isEnabled()) {
                                btn.setEnabled(false);
                                btn.setBright(false);
                            }
                        } else {
                            showAddOrCut(add, cut, hero.getLevelData(hero.getLv() + 1)['life'] - hero.getLife());
                        }
                        diamond_text.setVisible(false);
                        diamond.setVisible(false);
                    }
                });


                setElement(root, hero, function (event, otherBtn) {
                    if (hero.getCurrentLife() <= 0) {
                        var resurge = hero.getResurge();
                        PlayerData.consumeResource([resurge['cost']]);
                        PlayerData.updatePlayer();
                        console.log('请注意，英雄' + hero.getId() + '请求买活....');
                        customEventHelper.sendEvent(EVENT.HERO_REVIVE, hero);
                    } else {
                        console.log(hero.getId() + '当前生命值' + hero.getCurrentLife())
                        var eventData = {};
                        var levelData = hero.getLevelData();
                        var levelLife = hero.getLife();
                        eventData.heroId = hero.getId();
                        var cost = hero.getNextLevelUpgrade();
                        cost['value'] = 0 - cost['value'];
                        eventData.cost = cost;
                        hero.upgrade();
                        lv.setString('Lv.' + hero.getLv() + '/' + hero.getMaxLevel());
                        dps_text.setString(parseInt(hero.getLife()));
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
                            var nextLevelLife = nextlevelData['life'];
                            otherBtn.goldText.setString(nextLevelAmount);
                            var diffValue = parseInt(nextLevelLife - levelLife);
                            showAddOrCut(otherBtn.add, otherBtn.cut, diffValue);
                            otherBtn.buffNum.setString(Math.abs(diffValue));
                            customEventHelper.sendEvent(EVENT.GOLD_VALUE_UPDATE);
                        }
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
                var lv = skill.getLv();
                var showEffect = 0;
                var nextlevelData = skill.getLevelData(lv + 1);
                var nextAmount = nextlevelData['upgrade']['value'];
                var nextEffects = skill.traverseSkillEffects(lv + 1);
                if (lv == 0) {
                    showEffect = nextEffects[0].value;
                } else {
                    var effects = skill.traverseSkillEffects();
                    showEffect = nextEffects[0].value - effects[0].value;
                }
                gold_text.setString(nextAmount);
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

            function lockSkill(hero, skill, elements) {
                if (!canUnlockSkill(hero, skill)) {
                    elements.lock.setVisible(true);
                    elements.btn.setEnabled(false);
                    elements.btn.setBright(false);
                    elements.level_text.setVisible(true);
                    elements.level_text.setString("Lv." + skill.getUnlockLevel())
                    elements.gold.setVisible(false);
                    elements.gold_text.setVisible(false);
                    elements.buff_text.setVisible(false);
                    elements.buffNum_text.setVisible(false);
                    elements.add.setVisible(false);
                    elements.cut.setVisible(false);
                    elements.per.setVisible(false);
                }
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
                    // hero.refreshProps();
                    desc.setString(buildSkillDesc(skill));
                    lv.setString('Lv.' + skill.getLv() + "/" + skill.getMaxLevel());
                    customEventHelper.sendEvent(EVENT.HERO_SKILL_UPGRADE, eventData);
                    customEventHelper.sendEvent(EVENT.HERO_REFRESH_PROPS, {});

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
                            //var x=otherBtn.buffNum.getPositionX()+ otherBtn.buffNum.getwgetWidth();
                            //per.setPositionX(x+1);
                        } else {
                            per.setVisible(false);
                        }
                        lockSkill(hero, skill, elements);
                        customEventHelper.sendEvent(EVENT.GOLD_VALUE_UPDATE);
                    }
                    cc.log('current skill[' + skill.getId() + ']\'s Lv is ' + skill.getLv());
                });
                lockSkill(hero, skill, elements);
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

var ShopLayerMenu = BattleMenu.extend({
    ctor: function (battle) {
        this._super(battle, res.shop_layer);
        var shopTab = this.root.getChildByName("shop_tab");
        var shopView = this.root.getChildByName("shop_view");
        var tabParams = [
            {name: "shop_tab", click: "onShopTabClick"},
            {name: "moneyTree_tab", click: "onMoneyTreeTabClick"}
        ];
        this.buttons = {};

        var self = this;
        for (var i in tabParams) {
            var param = tabParams[i];
            var name = param.name;
            this.buttons[name] = shopTab.getChildByName(name);
            if (i == 0)
                this.buttons[name].setSelected(true);
            else
                this.buttons[name].setSelected(false);
            this.buttons[name].addEventListener(function (sender, type) {
                if (type === ccui.CheckBox.EVENT_SELECTED) {
                    self.showMenuLayer(sender.name);
                }
                else if (type === ccui.CheckBox.EVENT_UNSELECTED) {
                    sender.setSelected(true);
                }
            }, this);
        }
        this.showMenuLayer = function (name) {
            for (var i in this.buttons) {
                this.buttons[i].setSelected(false);
            }
            switch (name) {
                case "shop_tab":
                    self.showPorpView(name);
                    break;
                case "moneyTree_tab":
                    self.showMoneyTreeView(name);
                    break;
            }
            var childrens = shopView.getChildren();
            for (var i in childrens) {
                childrens[i].setVisible(false);
            }
            shopView.getChildByName(name).setVisible(true);
            this.buttons[name].setSelected(true);
        };
        this.showMoneyTreeView = function (name) {
            var showMoneyTree = shopView.getChildByName(name);
            var diamondText = showMoneyTree.getChildByName("diamond_text");
            var goldText = showMoneyTree.getChildByName("gold_text");
            diamondText.ignoreContentAdaptWithSize(true);
            diamondText.setString(5);
            goldText.ignoreContentAdaptWithSize(true);
            goldText.setString(5 * PlayerData.getStageData().getMoneyTreeRatio());

            var buyBtn = showMoneyTree.getChildByName("btn").getChildByName("buy_btn");
            buyBtn.addClickEventListener(function () {
                var gemNum = 5;
                self.buyGold(gemNum, (gemNum * PlayerData.getStageData().getMoneyTreeRatio()));
            });
        };
        this.buyGold = function (gem, gold) {
            if (player.gem >= gem) {
                PlayerData.consumeResource([PlayerData.createResourceData("gold", gold)
                    , PlayerData.createResourceData("gem", -gem)]);
                customEventHelper.sendEvent(EVENT.GOLD_VALUE_UPDATE);
                customEventHelper.sendEvent(EVENT.GEM_VALUE_UPDATE);
                PlayerData.updatePlayer();
            } else {
                new Popup1("友情提示", "当前钻石不足");
            }
        };
        this.showPorpView = function (name) {
            var shopPorps = shopView.getChildByName(name);
            var goods = dataSource.goods;
            var n = 0;
            for (var i in goods) {
                n++;
                var equip = dataSource.equips[goods[i].propId];
                var shopPorp = shopPorps.getChildByName("item" + n).getChildByName("root");
                var itemLayer = shopPorp.getChildByName("itemLayer").getChildByName("root");

                var saleText = itemLayer.getChildByName("sale_text");
                saleText.ignoreContentAdaptWithSize(true);
                saleText.setString(goods[i].num);

                var itemIcon = itemLayer.getChildByName("item_icon");
                itemIcon.loadTexture("res/icon/equips/" + equip.icon);

                shopPorp.getChildByName("item_name").setString(equip.name);

                var res = shopPorp.getChildByName("res");

                var childrens = res.getChildren();
                for (var j in childrens) {
                    childrens[j].setVisible(false);
                }
                res.getChildByName(goods[i].price.unit).setVisible(true);

                var resSaleText = res.getChildByName("sale_text");
                resSaleText.setVisible(true);
                resSaleText.ignoreContentAdaptWithSize(true);
                resSaleText.setString(goods[i].price.value);

                var buyBtn = shopPorp.getChildByName("btn").getChildByName("buy_btn");
                var price = goods[i].price;
                self.clickBtn(buyBtn, price, goods[i]);
            }
        };
        this.clickBtn = function (buyBtn, price, goods) {
            buyBtn.addClickEventListener(function () {
                self.buyGoods(price, goods);
            });
        }
        this.buyGoods = function (data, goods) {
            if (/*PlayerData.getAmountByUnit(data.unit)*/player.gold >= data.value) {
                PlayerData.consumeResource([PlayerData.createResourceData(data.unit, -data.value)]);
                customEventHelper.sendEvent(EVENT.GOLD_VALUE_UPDATE);
                PlayerData.updatePlayer();
                player.packs.push({
                    "packType": "equip",
                    "relateId": goods.propId,
                    "num": goods.num,
                    "level": 1
                });
                //new Popup1("友情提示1","购买成功");
            } else {
                new Popup1("友情提示", "当前金币不足,点击确定进入点金页面", function (popup) {
                    /*layer.removeFromParent();
                     gamePopup.hidden();*/
                    popup.hiddenPopup();
                    self.showMenuLayer("moneyTree_tab");
                });
            }
        };
        this.showPorpView("shop_tab");
    }

});

var RankLayerMenu = BattleMenu.extend({
    ctor: function (battle) {
        this._super(battle, res.rank_layer_json);
        var listView = this.root.getChildByName("List");
        var rankTab = this.root.getChildByName("rank_tab");
        var myNumText = this.root.getChildByName('myNum_text');
        var rankViewRoot = ccs.csLoader.createNode(res.rank_view_json).getChildByName('root');
        var tabParams = [
            {name: "pvp_tab"},
            {name: "stage_tab"}
        ];
        this.buttons = {};

        var self = this;
        for (var i in tabParams) {
            var param = tabParams[i];
            var name = param.name;
            this.buttons[name] = rankTab.getChildByName(name);
            if (i == 0)
                this.buttons[name].setSelected(true);
            else
                this.buttons[name].setSelected(false);
            this.buttons[name].addEventListener(function (sender, type) {
                if (type === ccui.CheckBox.EVENT_SELECTED) {
                    self.showMenuLayer(sender.name);
                }
                else if (type === ccui.CheckBox.EVENT_UNSELECTED) {
                    sender.setSelected(true);
                }
            }, this);
        }
        var n = 0;
        this.showMenuLayer = function (name) {
            for (var i in this.buttons) {
                this.buttons[i].setSelected(false);
            }
            this.showRankList(name);
            this.buttons[name].setSelected(true);
        };

        this.showRankList = function (type) {
            listView.removeAllChildren();
            var players = PlayerData.getCurrentRanksByType(type);
            myNumText.ignoreContentAdaptWithSize(true);
            myNumText.setString(PlayerData.getMyRankByType(type));
            n = 0;
            for(var i in players){
                n++;
                listView.addChild(this.setRankView(players[i],i,type));
                //rankView);
            }
        };
        this.setRankView = function(data,id,type){
            var root = rankViewRoot.clone();
            rankViewRoot.ignoreContentAdaptWithSize(true);
            var hero = new Hero(data.heroes[0]);
            //var root = rankView.getChildByName('root');
            root.getChildByName('player_icon').loadTexture("res/icon/heroes/" + hero.getIcon());
            var playerName = root.getChildByName('player_name');
            var levelText = root.getChildByName('level_text');
            var playerPrestige = root.getChildByName('player_prestige');
            var prestigeText = root.getChildByName('prestige_text');
            var playerLv = root.getChildByName('player_lv');
            var myBg = root.getChildByName('my_bg');
            var num = root.getChildByName('num');
            setFont([playerName]);
            setColor([levelText,playerPrestige,prestigeText,playerLv]);
            setIgnoreContentAdaptWithSize([levelText,prestigeText,num]);
            levelText.setString(hero.getLv());
            num.setString(n);
            playerName.setString(data.name);
            if(id == player.id){
                myBg.setVisible(true);
            }else{
                myBg.setVisible(false);
            }
            if(type == 'pvp_tab'){
                root.getChildByName('pvp_rank').setVisible(true);
                root.getChildByName('stage_rank').setVisible(false);
            }else{
                root.getChildByName('stage_rank').setVisible(true);
                root.getChildByName('pvp_rank').setVisible(false);
            }
            return root;
        };

        this.showMenuLayer("stage_tab");
    }
});