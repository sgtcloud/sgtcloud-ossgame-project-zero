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
var SkillIcon = function (battle, template, index, skillsBox) {
    var root = template.clone();
    this.root = root;
    var x = root.width
    var y = root.height;
    var num = 5;
    var boxWidth = skillsBox.width;
    var margin = 10;
    var offsetX = boxWidth - num * x - (num - 1) * margin
    root.setPosition((index < num ? offsetX : 0) + (x + margin) * (index - num * Math.floor(index / num)), (y + margin) * Math.floor(index / num));
    this.skill_icon = root.getChildByName('skill_icon');
    this.reviveText = root.getChildByName('reviveTime_text');
    this.time = root.getChildByName('time');
    this.cooldownText = root.getChildByName('cooldown_text');
    this.durationText = root.getChildByName('duration_text');
    //this.icon=root.getChildByName('icon');
    this.reviveText.setVisible(false);
    this.time.setVisible(false);
    this.cooldownText.setVisible(false);
    this.durationText.setVisible(false);
    this.skill_icon.setTouchEnabled(true);
    //this.button.addClickEventListener(function(){
    //    console.log('触发主动技能：'+skill);
    //    customEventHelper.sendEvent(EVENT.CAST_SKILL,skill);
    //});

    skillsBox.addChild(this.root);
    this.setVisible = function (visit) {
        root.setVisible(visit);
    }
    this.showDead = function () {
        this.reviveText.setVisible(true);
        this.time.setVisible(true);
        this.cooldownText.setVisible(false);
    }
    this.bindSkillAndClickEvent = function (skill) {
        if (skill) {
            this.skill = skill;
            var that = this;
            console.log('bind skill:' + skill.getId())
            this.skill_icon.loadTexture("res/icon/skills/" + skill.getIcon());
            this.skill_icon.addClickEventListener(function () {
                console.log('触发主动技能：' + that.skill.getType() + ",icon:" + that.skill.getIcon());
                customEventHelper.sendEvent(EVENT.CAST_SKILL, that.skill);
            });
            var levelData=that.skill.getLevelData();
            if(levelData['duration']>0){
                //that.durationText.setVisible(true)
                that.time.setString(Math.round(levelData['duration']) + " 秒")
            }
            if(levelData['cooldown']>0){
                //that.cooldownText.setVisible(true)
            }

            customEventHelper.bindListener(EVENT.HERO_DIE, function (event) {
                var dieHero = event.getUserData();
                console.log(that.skill.getId())
                if (dieHero.hasSkill(that.skill.getId())) {
                    that.skill_icon.setTouchEnabled(false)
                    that.skill_icon.setColor(cc.color(90, 90, 90))
                    that.time.setVisible(true);
                    that.reviveText.setVisible(true);
                }
            });
            customEventHelper.bindListener(EVENT.HERO_REVIVE, function (event) {
                var reviveHero = event.getUserData();
                if (reviveHero.hasSkill(that.skill.getId())) {
                    that.skill_icon.setTouchEnabled(true)
                    that.skill_icon.setColor(cc.color(255, 255, 255));
                    that.time.setVisible(false);
                    that.reviveText.setVisible(false);
                }
            });
            customEventHelper.bindListener(EVENT.CAST_BUFF, function (event) {
                var data = event.getUserData();
                if (that.skill.getId() === data.skill_id) {
                    customEventHelper.sendEvent(EVENT.CAST_SKILL, that.skill);
                }
            });
            customEventHelper.bindListener(EVENT.HERO_REVIVE_COUNTDOWN, function (event) {
                var data = event.getUserData();
                var hero = PlayerData.getHeroById(data['id']);
                if ( hero.hasSkill(that.skill.getId())) {
                    that.time.setString(Math.round(data['recover']) + " 秒");
                }
            });
        }
    }
    this.showCooldown = function () {
        this.reviveText.setVisible(false);
        this.time.setVisible(false);
        this.cooldownText.setVisible(true);
    }
    this.showActive = function () {
        this.reviveText.setVisible(false);
        this.time.setVisible(false);
        this.cooldownText.setVisible(false);
    }
    this.setDeadTime = function (time) {
        this.time.setString(time);
    }
    this.setCoolTime = function (time) {
        this.cooldownText.setString(time);
    }
    this.setEnabled = function (state) {
        //this.skill_icon.setEnabled(state);
        //this.skill_icon.setBright(state);
    }
    this.addClickEvent = function (func) {
        var cb = func;
        this.skill_icon.addClickEventListener(function (event) {
            cb(event, skill);
        });
    }
}
function getHeroActivtySkillls(hero) {
    var skills = hero.getSkills();
    var result = [];
    for (var i in skills) {
        console.log('the skill:' + skills[i].getId() + ',type is ' + skills[i].getType())
        if (skills[i].getType() === 1) {
            result.push(skills[i]);
        }
    }
    console.log('get hero:' + hero.getId() + ' activity skills' + result)
    return result;
}
var SkillListMenu = BattleMenu.extend({
    ctor: function (battlePanel) {
        var heroes = PlayerData.getHeroes();
        var size = heroes.length;
        var skillBtnNum = 7
        this._super(battlePanel, res.skill_layer_json);
        var skills = [];
        for (var i in heroes) {
            var activitySkills = getHeroActivtySkillls(heroes[i]);
            skills.push.apply(skills, activitySkills);
        }
        var skillIconTemplate = ccs.csLoader.createNode(res.skill_icon_json).getChildByName('root');
        var skillBtns = [];
        var skillsBox = this.root.getChildByName('skill_box')
        for (var i = 0; i < skills.length; i++) {
            //var pane = this.root.getChildByName('skill' + (i + 1)).getChildByName('root');
            //var activitySkills = getHeroActivtySkillls(heroes[i]);
            var skillBtn = new SkillIcon(battlePanel, skillIconTemplate, i, skillsBox);
            //if (i < skills.length) {
            skillBtn.setVisible(true);
            skillBtn.bindSkillAndClickEvent(skills[i]);
            //skillBtn.addClickEvent(function(event,skill){
            //    console.log('触发主动技能：'+skill.getId());
            //    customEventHelper.sendEvent(EVENT.CAST_SKILL,skill);
            //})
            //} else {
            //    skillBtn.setVisible(false);
            //}
            skillBtns.push(skillBtn);
        }
        function format(time) {
            return new Date(time).Format('mm:ss');
        }

        this.refreshSkillState = function () {
            for (var i = 0; i < skillBtnNum; i++) {
                //skillBtns[i].setVisible(false);
            }
            battlePanel.foreachHeroSprite(function (hero, i) {
                console.log(i)
                var skill = skillBtns[i];
                //skill.setVisible(true);
                //skill.setEnabled(true);
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
                var skill = skillBtns[i];
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
function buildDesc(effects, desc, extend) {
    var effectsObj = {};
    for (var i in effects) {
        var map = SkillEffectMappings[effects[i]['type']];
        var alas = map['name'];
        var value = effects[i]['value'];
        effectsObj[effects[i]['name']] = {}
        effectsObj[effects[i]['name']]['name'] = alas;
        effectsObj[effects[i]['name']]['value'] = map['type'] === 'rate' ? (value + '%') : value;
    }
    if (extend) {
        effectsObj = $$.extend(effectsObj, extend);
    }
    var desc = desc.mapping(effectsObj)
    return desc;
}

var HeroListMenu = BattleMenu.extend({
        ctor: function (battle) {
            this._super(battle, res.hero_layer_json);

            this.heroList = this.root.getChildByName('hero_list');

            var heroTemp = ccs.csLoader.createNode(res.hero_view_json).getChildByName('root');
            var skillTemp = ccs.csLoader.createNode(res.skill_view_json).getChildByName('root');

            function setElement(elements, target, listener) {
                initView(target, elements, listener)
            }

            function initView(target, elements, listener) {
                if (target.isMaxLevel()) {
                    elements.upgrade_btn.layer.setVisible(false);
                    elements.maxLevel_btn.layer.setVisible(true);
                    // console.log(target.getId() + ' has been the max level')
                } else {
                    (!elements.upgrade_btn.layer.isVisible()) && elements.upgrade_btn.layer.setVisible(true);
                    elements.maxLevel_btn.layer.isVisible() && elements.maxLevel_btn.layer.setVisible(false);
                    var nextlevelData = target.getLevelData(target.getLv() + 1);
                    var nextLevelLife = nextlevelData['life'];
                    var unit = nextlevelData['upgrade']['unit'];
                    var amount = PlayerData.getAmountByUnit(unit);
                    var nextGoldValue = nextlevelData['upgrade']['value'];
                    var levelData = target.getLevelData();
                    var levelLife = levelData['life'];
                    if (nextGoldValue) {
                        elements.upgrade_btn.text_yellow.setString(nextGoldValue);
                    }
                    if (nextLevelLife) {
                        elements.upgrade_btn.buffNum_text.setString(Math.abs(parseInt(nextLevelLife - levelLife)));
                    }
                    elements.upgrade_btn.btn.addClickEventListener(function (event) {
                        listener(event, elements);
                    });
                }
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

            var upgrade_btn_layoutTemp = heroTemp.getChildByName('upgrade_btn');
            var up_z = upgrade_btn_layoutTemp.getLocalZOrder();
            var upgradeBtnPosition = upgrade_btn_layoutTemp.getPosition();
            var upgrade_btnTemp = upgrade_btn_layoutTemp.getChildByName('btn');
            var maxLevelBtn_layoutTemp = heroTemp.getChildByName('MaxLevel');
            var maxLevelBtnTemp = maxLevelBtn_layoutTemp.getChildByName('btn');
            var maxLevelBtnPosition = maxLevelBtn_layoutTemp.getPosition();
            var revive_btnBtn_layoutTemp = heroTemp.getChildByName('revive_btn');
            var revive_btnBtnTemp = revive_btnBtn_layoutTemp.getChildByName('btn');
            var revive_btnPosition = revive_btnBtn_layoutTemp.getPosition();

            function buildUpgradeBtn(elements, btnlayer) {
                var buff_text = btnlayer.getChildByName('buff_text');//buff文字
                var relic_icon = btnlayer.getChildByName('relic_icon');//宝物图标
                var buffNum_text = btnlayer.getChildByName('buffNum_text');//buff数
                var lock = btnlayer.getChildByName('lock');
                var add = btnlayer.getChildByName('add');
                var cut = btnlayer.getChildByName('cut');
                var per = btnlayer.getChildByName('per');
                var gold_icon = btnlayer.getChildByName('gold_icon');//消耗金币
                var text_yellow = btnlayer.getChildByName('text_yellow');//统一文字
                var diamond = btnlayer.getChildByName('diamond_icon');//钻石图标
                diamond.setVisible(false)
                relic_icon.setVisible(false)
                elements.upgrade_btn = {};
                elements.upgrade_btn.layer = btnlayer;
                elements.upgrade_btn.btn = btnlayer.getChildByName('btn');
                elements.upgrade_btn.gold_icon = gold_icon;
                elements.upgrade_btn.text_yellow = text_yellow;
                elements.upgrade_btn.diamond = diamond;
                elements.upgrade_btn.relic = relic_icon;
                elements.upgrade_btn.buff_text = buff_text;
                elements.upgrade_btn.buffNum_text = buffNum_text;
                elements.upgrade_btn.lock = lock;
                elements.upgrade_btn.per = per;
                elements.upgrade_btn.add = add;
                elements.upgrade_btn.cut = cut;
                elements.upgrade_btn.per.ignoreContentAdaptWithSize(false);
                elements.upgrade_btn.buffNum_text.ignoreContentAdaptWithSize(true);
                elements.upgrade_btn.text_yellow.ignoreContentAdaptWithSize(true);
            }

            function buildMaxLevelBtn(elements, maxLevel) {
                elements.maxLevel_btn = {};
                elements.maxLevel_btn.layer = maxLevel;
                elements.maxLevel_btn.btn = maxLevel.getChildByName('btn');
                elements.maxLevel_btn.upMax_text = maxLevel.getChildByName('upMax_text');
                elements.maxLevel_btn.layer.setVisible(false);
            }

            function buildHeroView(hero) {
                var root = heroTemp.clone();
                var elements = {};
                var btnlayer = upgrade_btnTemp.clone();
                btnlayer.setPosition(upgradeBtnPosition);
                root.addChild(btnlayer);
                buildUpgradeBtn(elements, btnlayer);
                var icon = root.getChildByName('hero_icon');
                var lv = root.getChildByName('level_text');
                var dps_text = root.getChildByName('dps_text');
                var dps = root.getChildByName('dps');
                var die_text = root.getChildByName('die_text')
                var die_time_text = root.getChildByName('die_time_text')
                var heroName_text = root.getChildByName("heroName_text");

                var upMaxLevelBtn = maxLevelBtnTemp.clone();//已满级
                upMaxLevelBtn.setPosition(maxLevelBtnPosition);
                root.addChild(upMaxLevelBtn);
                buildMaxLevelBtn(elements, upMaxLevelBtn)
                var revive_btn = revive_btnBtnTemp.clone();//.getChildByName('revive_btn');
                revive_btn.setPosition(revive_btnPosition);
                root.addChild(revive_btn);
                var diamond_text = revive_btn.getChildByName('diamond_text');
                //die_text.setColor(cc.color(255,0,0));
                die_time_text.setColor(cc.color(255, 0, 0));
                elements.icon = icon;
                elements.lv = lv;
                elements.dps_text = dps_text;
                elements.dps = dps;
                elements.heroName_text = heroName_text;
                elements.die_text = die_text;
                elements.die_time_text = die_time_text;
                elements.revive_btn = {};
                elements.revive_btn.layer = revive_btn;
                elements.revive_btn.btn = revive_btn.getChildByName('btn');
                elements.revive_btn.diamond_text = diamond_text;
                diamond_text.ignoreContentAdaptWithSize(true);
                elements.upgrade_btn.per.setVisible(false);
                dps.ignoreContentAdaptWithSize(true);
                dps_text.ignoreContentAdaptWithSize(true);
                elements.upgrade_btn.diamond.setVisible(false);
                icon.loadTexture("res/icon/heroes/" + hero.getIcon());
                icon.setTouchEnabled(true);
                heroName_text.setString(hero.getName());
                lv.setString('Lv.' + hero.getLv() + "/" + hero.getMaxLevel());
                dps_text.setString(parseInt(hero.getLife()));
                elements.revive_btn.btn.addClickEventListener(function () {
                    if (hero.getCurrentLife() <= 0) {
                        var resurge = hero.getResurge();
                        resurge['cost']['value'] = -resurge['cost']['value'];
                        PlayerData.updateResource([resurge['cost']]);
                        customEventHelper.sendEvent(EVENT.GEM_VALUE_UPDATE);
                        PlayerData.updatePlayer();
                        // console.log('请注意，英雄' + hero.getId() + '请求买活....');
                        customEventHelper.sendEvent(EVENT.HERO_BUY_REVIVE, hero);
                    }
                });
                customEventHelper.bindListener(EVENT.HERO_REVIVE_COUNTDOWN, function (event) {
                    var data = event.getUserData();
                    if (data['id'] === hero.getId()) {
                        elements.die_time_text.setString(Math.round(data['recover']) + " 秒");
                    }
                });
                elements.die_time_text.setFontName("微软雅黑");
                setFont([heroName_text, lv, elements.upgrade_btn.buff_text]);
                if (hero.getCurrentLife() > 0) {
                    die_text.setVisible(false);
                    die_time_text.setVisible(false);
                    elements.revive_btn.layer.setVisible(false);
                }
                customEventHelper.bindListener(EVENT.HERO_REFRESH_PROPS, function (event) {
                    var eventHero = event.getUserData();
                    if (eventHero.getId() === hero.getId()) {
                        eventHero.refreshProps();
                        elements.dps_text.setString(parseInt(eventHero.getLife()));
                    }
                })
                customEventHelper.bindListener(EVENT.HERO_UPGRADE_BTN, function (event) {
                    if (!hero.isMaxLevel()) {
                        var nextlevelData = hero.getLevelData(hero.getLv() + 1);
                        if (validateAmountEnough(nextlevelData['upgrade'])) {
                            elements.upgrade_btn.btn.setEnabled(false);
                            elements.upgrade_btn.btn.setBright(false);
                            elements.upgrade_btn.text_yellow.setColor(cc.color(255, 0, 0));
                        } else {
                            elements.upgrade_btn.btn.setEnabled(true);
                            elements.upgrade_btn.btn.setBright(true);
                            elements.upgrade_btn.text_yellow.setColor(cc.color(255, 255, 255));
                        }
                    }
                });
                customEventHelper.bindListener(EVENT.HERO_DIE, function (event) {
                    var dieHero = event.getUserData();
                    var heroId = dieHero.getId();
                    if (heroId === hero.getId()) {
                        elements.die_text.setVisible(true);
                        elements.die_time_text.setVisible(true);
                        elements.revive_btn.layer.setVisible(true);
                        elements.upgrade_btn.layer.isVisible() && elements.upgrade_btn.layer.setVisible(false);
                        elements.icon.setColor(cc.color(90, 90, 90));
                        var resurge = hero.getResurge();
                        var costValue = parseInt(resurge['cost']['value']);
                        elements.revive_btn.diamond_text.setString(costValue);
                        // console.log('钻石不足')
                        if (PlayerData.getAmountByUnit("gem") < costValue) {
                            elements.revive_btn.btn.setEnabled(false);
                            elements.revive_btn.btn.setBright(false);
                            elements.revive_btn.diamond_text.setColor(cc.color(255, 0, 0));
                        }
                    }
                });

                customEventHelper.bindListener(EVENT.GEM_VALUE_UPDATE, function () {
                    if (!hero.getCurrentLife() > 0) {
                        var resurge = hero.getResurge();
                        var costValue = parseInt(resurge['cost']['value']);
                        //  console.log('钻石不足')
                        if (PlayerData.getAmountByUnit("gem") < costValue) {
                            elements.revive_btn.btn.setEnabled(false);
                            elements.revive_btn.btn.setBright(false);
                            elements.revive_btn.diamond_text.setColor(cc.color(255, 0, 0));
                        } else {
                            elements.revive_btn.btn.setEnabled(true);
                            elements.revive_btn.btn.setBright(true);
                            elements.revive_btn.diamond_text.setColor(cc.color(255, 255, 255));
                        }
                    }
                })
                customEventHelper.bindListener(EVENT.HERO_REVIVE, function (event) {
                    var heroId = event.getUserData().getId();
                    if (heroId === hero.getId()) {
                        cc.log("hero[" + heroId + "]'s revive,the life is " + hero.getLife());
                        die_text.setVisible(false);
                        die_time_text.setVisible(false);
                        elements.revive_btn.layer.setVisible(false);
                        elements.icon.setColor(cc.color(255, 255, 255));
                        if (hero.isMaxLevel()) {
                            (!elements.upgrade_btn.layer.isVisible()) && elements.upgrade_btn.layer.setVisible(false);
                            elements.maxLevel_btn.layer.setVisible(true);
                        } else {
                            showAddOrCut(elements.upgrade_btn.add, elements.upgrade_btn.cut, hero.getLevelData(hero.getLv() + 1)['life'] - hero.getLevelData()['life']);
                            elements.upgrade_btn.layer.setVisible(true)
                        }
                    }
                });


                setElement(elements, hero, function (event, otherBtn) {
                    // console.log(hero.getId() + '当前生命值' + hero.getCurrentLife())
                    var eventData = {};
                    var levelData = hero.getLevelData();
                    eventData.heroId = hero.getId();
                    var cost = hero.getNextLevelUpgrade();
                    cost['value'] = 0 - cost['value'];
                    eventData.cost = cost;
                    hero.upgrade();
                    lv.setString('Lv.' + hero.getLv() + '/' + hero.getMaxLevel());
                    dps_text.setString(parseInt(hero.getLife()));
                    customEventHelper.sendEvent(EVENT.HERO_UPGRADE, eventData);
                    customEventHelper.sendEvent(EVENT.HERO_REFRESH_PROPS, hero);
                    if (hero.isMaxLevel()) {
                        elements.maxLevel_btn.layer.setVisible(true);
                        elements.upgrade_btn.layer.setVisible(false);
                    } else {
                        var nextlevelData = hero.getLevelData(hero.getLv() + 1);
                        var nextLevelAmount = nextlevelData['upgrade']['value'];
                        var nextLevelLife = nextlevelData['life'];
                        elements.upgrade_btn.text_yellow.setString(nextLevelAmount);
                        var levelLife = hero.getLevelData()['life'];
                        var diffValue = parseInt(nextLevelLife - levelLife);
                        showAddOrCut(elements.upgrade_btn.add, elements.upgrade_btn.cut, diffValue);
                        elements.upgrade_btn.buffNum_text.setString(Math.abs(diffValue));
                        customEventHelper.sendEvent(EVENT.GOLD_VALUE_UPDATE);
                    }
                    //}
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
                if (skill.isMaxLevel()) {
                    return;
                }
                if (!canUnlockSkill(hero, skill)) {
                    lockSkill(hero, skill, elements);
                } else {
                    unlockAndInitSkill(skill, elements);
                }
            }

            function unlockAndInitSkill(skill, elements) {
                elements.lock_btn.layer.isVisible() && elements.lock_btn.layer.setVisible(false);
                (!elements.upgrade_btn.layer.isVisible()) && elements.upgrade_btn.layer.setVisible(true);
                var gold_text = elements.upgrade_btn.text_yellow, buffNum_text = elements.upgrade_btn.buffNum_text, add = elements.upgrade_btn.add, cut = elements.upgrade_btn.cut;
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
                elements.upgrade_btn.buff_text.setString(SkillEffectMappings[nextEffects[0]['type']]['name']);
                showAddOrCut(add, cut, showEffect);
                if (SkillEffectMappings[nextEffects[0]['type']]['type'] === 'rate') {
                    elements.upgrade_btn.per.setVisible(true);
                } else {
                    elements.upgrade_btn.per.setVisible(false);
                }
                buffNum_text.setString(Math.abs(parseInt(showEffect)));
            }

            //根据模板生成技能效果描述
            function buildSkillDesc(skill, levelData) {
                //var lv= skill.getLv()===0?1:skill.getLv();
                var effects = skill.traverseSkillEffects();
                return buildDesc(effects, skill.getDesc(), {"duration": skill.getLevelData()['duration']});
            }


            function canUnlockSkill(hero, skill) {
                var heroLv = hero.getLv();
                var unlockLevel = skill.getUnlockLevel();
                return !(heroLv < unlockLevel);
            }

            function lockSkill(hero, skill, elements) {
                (!elements.lock_btn.layer.isVisible()) && elements.lock_btn.layer.setVisible(true);
                elements.upgrade_btn.layer.isVisible() && elements.upgrade_btn.layer.setVisible(false);
                elements.lock_btn.level_text.setString('Lv.' + skill.getUnlockLevel());
            }

            function lockSkillIfNecessary(hero, skill, elements) {
                if (!canUnlockSkill(hero, skill)) {
                    lockSkill(hero, skill, elements);
                }
            }

            var lockBtnLayoutTemplate = skillTemp.getChildByName('lock_btn');
            var lockBtnPosition = lockBtnLayoutTemplate.getPosition();
            var lockBtnTemplate = lockBtnLayoutTemplate.getChildByName('btn');
            var skillMaxLevelBtnLayoutTemplate = skillTemp.getChildByName('MaxLevel_btn');
            var skillMaxLevelBtnTemplate = skillMaxLevelBtnLayoutTemplate.getChildByName('btn');
            var skillMaxLevelBtnPosition = skillMaxLevelBtnLayoutTemplate.getPosition();
            var upgradeSkillLayoutTemp = skillTemp.getChildByName('upgrade_btn');
            var upgradeSkillBtnTemp = upgradeSkillLayoutTemp.getChildByName('btn');
            var upgradeSkillPosition = upgradeSkillLayoutTemp.getPosition();

            function buildSkillView(skill, hero) {
                var root = skillTemp.clone();
                var lock_btn = lockBtnTemplate.clone();
                lock_btn.setPosition(lockBtnPosition);
                var maxLevel = skillMaxLevelBtnTemplate.clone();
                maxLevel.setPosition(skillMaxLevelBtnPosition);
                var upgradeSkill = upgradeSkillBtnTemp.clone();
                upgradeSkill.setPosition(upgradeSkillPosition);
                root.addChild(lock_btn);
                root.addChild(maxLevel);
                root.addChild(upgradeSkill);
                var elements = {};
                buildUpgradeBtn(elements, upgradeSkill);
                buildMaxLevelBtn(elements, maxLevel);
                var icon = root.getChildByName('skill_icon');
                var name = root.getChildByName('skillName_text');
                var desc = root.getChildByName('skill_text');
                elements.desc = desc;
                var lv = root.getChildByName('skillLevel_text');
                elements.lv = lv;
                elements.lock_btn = {};
                elements.lock_btn.layer = lock_btn;
                elements.lock_btn.btn = lock_btn.getChildByName('btn');
                elements.lock_btn.level_text = lock_btn.getChildByName('level_text');
                elements.lock_btn.lock = lock_btn.getChildByName('lock');
                elements.lock_btn.layer.setVisible(false)
                icon.loadTexture("res/icon/skills/" + skill.getIcon());
                name.setString(skill.getName());
                desc.setString(buildSkillDesc(skill));
                lv.setString('Lv.' + skill.getLv() + "/" + skill.getMaxLevel());
                elements.lock_btn.level_text.setString("Lv." + skill.getUnlockLevel())
                elements.lock_btn.level_text.setColor(cc.color(255, 0, 0));
                elements.upgrade_btn.per.setVisible(false);
                setFont([name, desc, lv, elements.lock_btn.level_text, elements.upgrade_btn.buff_text]);
                customEventHelper.bindListener(EVENT.HERO_SKILL_UPGRADE_BTN, function (event) {
                        if (canUnlockSkill(hero, skill)) {
                            if (!skill.isMaxLevel()) {
                                var nextlevelData = skill.getLevelData(skill.getLv() + 1);
                                if (validateAmountEnough(nextlevelData['upgrade'])) {
                                    elements.upgrade_btn. btn.setEnabled(false);
                                    elements.upgrade_btn. btn.setBright(false);
                                    elements.upgrade_btn.text_yellow.setColor(cc.color(255, 0, 0));
                                } else {
                                    elements.upgrade_btn.btn.setEnabled(true);
                                    elements.upgrade_btn.btn.setBright(true);
                                    elements.upgrade_btn.text_yellow.setColor(cc.color(255, 255, 255));
                                }
                            }
                        }
                    }
                );
                customEventHelper.bindListener(EVENT.HERO_UPGRADE, function () {
                    if (canUnlockSkill(hero, skill) && elements.lock_btn.layer.isVisible()) {
                        unlockAndInitSkill(skill, elements);
                    }
                })
                setElement(elements, skill, function (event, otherBtn) {
                    var eventData = {};
                    var cost = skill.getNextLevelUpgrade();
                    cost['value'] = -cost['value'];
                    eventData.cost = cost;
                    eventData.skillId = skill.getId();
                    var levelData = skill.getLevelData();
                    skill.upgrade();
                    desc.setString(buildSkillDesc(skill));
                    lv.setString('Lv.' + skill.getLv() + "/" + skill.getMaxLevel());
                    customEventHelper.sendEvent(EVENT.HERO_SKILL_UPGRADE, eventData);
                    customEventHelper.sendEvent(EVENT.HERO_REFRESH_PROPS, hero);

                    if (skill.isMaxLevel()) {
                        elements.maxLevel_btn.layer.setVisible(true);
                        elements.upgrade_btn.layer.setVisible(false);
                    } else {
                        var effects = skill.traverseSkillEffects();
                        var nextlevelData = skill.getLevelData(skill.getLv() + 1);
                        var nextAmount = nextlevelData['upgrade']['value'];
                        var nextEffects = skill.traverseSkillEffects(skill.getLv() + 1);
                        elements.upgrade_btn.text_yellow.setString(nextAmount);
                        var showEffect = nextEffects[0].value - effects[0].value;
                        showAddOrCut(elements.upgrade_btn.add, elements.upgrade_btn.cut, showEffect);
                        elements.upgrade_btn.buffNum_text.setString(Math.abs(parseInt(showEffect)));
                        elements.upgrade_btn.buff_text.setString(SkillEffectMappings[nextEffects[0]['type']]['name']);
                        if (SkillEffectMappings[nextEffects[0]['type']]['type'] === 'rate') {
                            elements.upgrade_btn.per.setVisible(true);
                        } else {
                            elements.upgrade_btn.per.setVisible(false);
                        }
                        lockSkillIfNecessary(hero, skill, elements);
                        customEventHelper.sendEvent(EVENT.GOLD_VALUE_UPDATE);
                    }
                    cc.log('current skill[' + skill.getId() + ']\'s Lv is ' + skill.getLv());
                });
                initSkillView(hero, skill, elements);
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
        this.playerEquip = this.root.getChildByName('title_root');
        var heroView = ccs.csLoader.createNode(res.equip_hero_view_json).getChildByName('root');
        var equipView = ccs.csLoader.createNode(res.equip_view_json).getChildByName('root');

        function buildHeroView(hero) {
            var root = heroView.clone();
            var icon = root.getChildByName('hero_icon');
            var name = root.getChildByName('heroName_text');
            var lv = root.getChildByName('level_text');
            var dps_text = root.getChildByName('dps_text');
            //var tap = root.getChildByName('tatk_text');
            icon.loadTexture("res/icon/heroes/" + hero.getIcon());
            dps_text.setString(parseInt(hero.getLife()));
            name.setString(hero.getName());
            lv.setString(hero.getLv());
            dps_text.ignoreContentAdaptWithSize(true);
            //tap.setString(hero.getHit());

            return root;
        }

        function buildEquipView(equip, hero) {
            var root = equipView.clone();
            var icon = root.getChildByName('equip_icon');
            var name = root.getChildByName('equipName_text');
            var desc = root.getChildByName('equipBuffDecs_text');
            var lv = root.getChildByName('equipLevel_text');
            icon.loadTexture("res/icon/equips/" + equip.getIcon());
            name.setString(equip.getName());
            desc.setString(buildDesc(equip.traverseEquipEffects(), equip.getDesc()));
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
                    var _equipView = buildEquipView(equipData, heroData);
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
            var gemNum = CONSTS.money_tree_one_price;
            var showMoneyTree = shopView.getChildByName(name);
            var diamondText = showMoneyTree.getChildByName("diamond_text");
            var goldText = showMoneyTree.getChildByName("gold_text");
            diamondText.ignoreContentAdaptWithSize(true);
            diamondText.setString(gemNum);
            goldText.ignoreContentAdaptWithSize(true);
            goldText.setString(gemNum * PlayerData.getStageData().getMoneyTreeRatio());

            var buyBtn = showMoneyTree.getChildByName("btn").getChildByName("buy_btn");
            buyBtn.addClickEventListener(function () {

                self.buyGold(gemNum, (gemNum * PlayerData.getStageData().getMoneyTreeRatio()));
            });
        };
        this.buyGold = function (gem, gold) {
            if (PlayerData.getAmountByUnit("gem") >= gem) {
                PlayerData.updateResource([PlayerData.createResourceData("gold", gold)
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
            if (PlayerData.getAmountByUnit(data.unit) >= data.value) {
                PlayerData.updateResource([PlayerData.createResourceData(data.unit, -data.value)]);
                customEventHelper.sendEvent(EVENT.GOLD_VALUE_UPDATE);
                PlayerData.updatePlayer();
                // wait to refact with new resource logic
                /*player.packs.push({
                 "packType": "equip",
                 "relateId": goods.propId,
                 "num": goods.num,
                 "level": 1
                 });*/
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
            for (var i in players) {
                n++;
                listView.addChild(this.setRankView(players[i], i, type));
                //rankView);
            }
        };
        this.setRankView = function (data, id, type) {
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
            setColor([levelText, playerPrestige, prestigeText, playerLv]);
            setIgnoreContentAdaptWithSize([levelText, prestigeText, num]);
            levelText.setString(hero.getLv());
            num.setString(n);
            playerName.setString(data.name);
            if (id == player.id) {
                myBg.setVisible(true);
            } else {
                myBg.setVisible(false);
            }
            if (type == 'pvp_tab') {
                root.getChildByName('pvp_rank').setVisible(true);
                root.getChildByName('stage_rank').setVisible(false);
            } else {
                root.getChildByName('stage_rank').setVisible(true);
                root.getChildByName('pvp_rank').setVisible(false);
            }
            return root;
        };

        this.showMenuLayer("stage_tab");
    }
});