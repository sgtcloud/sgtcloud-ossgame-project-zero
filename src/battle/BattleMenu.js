var MenuBtn = function (btn) {
    this.button = btn.getChildByName('btn');
}
//UI的Menu父类
var BattleMenu = cc.Node.extend({
    ctor: function (tabPanel, res) {
        this._super();
        var layer = ccs.csLoader.createNode(res);
        this.addChild(layer);
        this.height = layer.height;
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
var SkillIcon = function (skillPanel, template, index, skillsBox, tabPanel) {
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
    this.time.setColor(cc.color(255, 0, 0));
    this.cooldownText.setVisible(false);
    this.durationText.setVisible(false);
    var isCoolDowning = false;
    var heroDead = false;
    //this.button.addClickEventListener(function(){
    //    console.log('触发主动技能：'+skill);
    //    customEventHelper.sendEvent(EVENT.CAST_SKILL,skill);
    //});
    this.skill_icon.setTouchEnabled(true);
    skillsBox.addChild(this.root);
    this.setVisible = function (visit) {
        root.setVisible(visit);
    }
    this.showDead = function () {
        this.reviveText.setVisible(true);
        this.time.setVisible(true);
        this.cooldownText.setVisible(false);
    }
    function doSchedule(time, target, cb) {
        var remaining = time;
        target.schedule(function () {
                if (!heroDead) {
                    this.setString(remaining);
                }
                if (remaining <= 0) {
                    if (typeof cb === "function") {
                        cb();
                    }
                    this.unschedule(this.__instanceId);
                    return;
                }
                remaining--;
            }, 1, time, 0, target.__instanceId
        );
    }


    this.bindSkillAndClickEvent = function (skill) {
        if (skill) {
            this.skill = skill;
            var that = this;
            //var buffHeight=skillPanel.height+tabPanel.height;
            this.skill_icon.loadTexture("res/icon/skills/" + skill.getIcon());
            if (this.skill.getLv() > 0) {
                this.root.setVisible(true);
            } else {
                this.root.isVisible() && this.root.setVisible(false);
            }
            customEventHelper.bindListener(EVENT.UNLOCK_ACTIVITY_SKILL, function (event) {
                var skillId = event.getUserData();
                if (!that.root.isVisible() && that.skill.getId() === skillId) {
                    that.root.setVisible(true);
                }
            });
            customEventHelper.bindListener(EVENT.CAST_SKILL_READY, function (e) {
                var data = e.getUserData();
                if (that.skill.getId() === data.skillId) {
                    //if (!(isCoolDowning || heroDead)) {
                    //    customEventHelper.sendEvent(EVENT.CAST_SKILL, that.skill);
                    //    if(!isCoolDowning){
                    //        doCoolDown(that.skill.getLevelData());
                    //    }
                    //}
                    console.log('释放buff:' + that.skill.getId())
                    tryFire(that.skill.getLevelData());
                }
            });
            function doCoolDown(levelData) {
                if (levelData['cooldown'] > 0) {
                    isCoolDowning = true;
                    that.cooldownText.setVisible(true)
                    that.time.setVisible(true)
                    that.time.setString(levelData['cooldown'])
                    //that.skill_icon.setTouchEnabled(false);
                    that.skill_icon.setColor(cc.color(90, 90, 90));
                    //cc.eventManager.resumeTarget(that.skill_icon);
                    doSchedule(levelData['cooldown'] - 1, that.time, function () {
                        if (!heroDead) {
                            //!that.skill_icon.isTouchEnabled() && that.skill_icon.setTouchEnabled(true);
                            that.skill_icon.setColor(cc.color(255, 255, 255));
                        }
                        that.cooldownText.isVisible() && that.cooldownText.setVisible(false);
                        if (!heroDead) {
                            that.time.isVisible() && that.time.setVisible(false)
                            //cc.eventManager.pauseTarget(that.skill_icon);
                        }
                        isCoolDowning = false;
                    });
                }
            }

            function tryFire(levelData) {
                if (!(isCoolDowning || heroDead)) {
                    doCoolDown(levelData);
                    console.log('触发主动技能：' + that.skill.getType() + ",icon:" + that.skill.getIcon());
                    if (levelData['duration'] > 0) {
                        toggleBufflayer(levelData['duration'], buildSkillBuffDesc(skill), that.skill.getIcon());
                    }
                    customEventHelper.sendEvent(EVENT.CAST_SKILL, that.skill);
                } else if (isCoolDowning && !heroDead) {
                    console.log('技能【' + that.skill.getId() + "】冷却中，请稍候再点！");
                    toggleBuffTip();
                } else {
                    console.log('英雄已死亡，请稍候再点！');
                }
            }

            this.skill_icon.addClickEventListener(function () {
                var levelData = that.skill.getLevelData();
                //doCoolDown(levelData);
                tryFire(levelData);
                if (levelData['duration'] > 0) {
                }
            });

            customEventHelper.bindListener(EVENT.HERO_DIE, function (event) {
                var dieHero = event.getUserData();
                if (dieHero.hasSkill(that.skill.getId())) {
                    heroDead = true;
                    that.skill_icon.isTouchEnabled() && that.skill_icon.setTouchEnabled(false)
                    !that.time.isVisible() && that.time.setVisible(true);
                    that.reviveText.setVisible(true);
                    if (isCoolDowning) {
                        that.cooldownText.setVisible(false);
                    } else {
                        that.skill_icon.setColor(cc.color(90, 90, 90));
                    }
                    that.time.setString(Math.round(dieHero.getLevelData()['resurge']['time']));
                }
            });
            customEventHelper.bindListener(EVENT.HERO_REVIVE, function (event) {
                var reviveHero = event.getUserData();
                if (reviveHero.hasSkill(that.skill.getId())) {
                    if (!isCoolDowning) {
                        that.skill_icon.setColor(cc.color(255, 255, 255));
                        !that.skill_icon.isTouchEnabled() && that.skill_icon.setTouchEnabled(true);
                        that.time.setVisible(false);
                    }
                    that.reviveText.setVisible(false);
                    isCoolDowning && that.cooldownText.setVisible(true);
                    heroDead = false;
                }
            });

            customEventHelper.bindListener(EVENT.HERO_REVIVE_COUNTDOWN, function (event) {
                var data = event.getUserData();
                var hero = PlayerData.getHeroById(data['id']);
                if (hero.hasSkill(that.skill.getId())) {
                    that.time.setString(Math.round(data['recover']));
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
        if (skills[i].getType() === 1) {
            result.push(skills[i]);
        }
    }
    return result;
}
var SkillListMenu = BattleMenu.extend({
    ctor: function (tabPanel, battlePanel) {
        var heroes = PlayerData.getHeroes();
        var size = heroes.length;
        var skillBtnNum = 7
        this._super(tabPanel, res.skill_layer_json);
        var skills = [];
        for (var i in heroes) {
            var activitySkills = getHeroActivtySkillls(heroes[i]);
            skills.push.apply(skills, activitySkills);
        }
        var skillIconTemplate = ccs.csLoader.createNode(res.skill_icon_json).getChildByName('root');
        var skillBtns = [];
        var skillsBox = this.root.getChildByName('skill_box')
        var atk_text = this.root.getChildByName('atk_text');
        var tatk_text = this.root.getChildByName('tatk_text');
        atk_text.ignoreContentAdaptWithSize(true);
        tatk_text.ignoreContentAdaptWithSize(true);
        //atk_text.setString()
        customEventHelper.bindListener(EVENT.UPGRADE_HERO_ATTACK, function () {
            var totalHit = PlayerData.getTotalHit();
            var totalAttack = PlayerData.getTotalAttack();
            tatk_text.setString(Math.floor(totalHit));
            atk_text.setString(Math.floor(totalAttack));
        });
        for (var i = 0; i < skills.length; i++) {
            var skillBtn = new SkillIcon(this, skillIconTemplate, i, skillsBox, tabPanel);
            //skillBtn.setVisible(true);
            skillBtn.bindSkillAndClickEvent(skills[i]);
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
//根据模板生成技能效果描述
function buildSkillDesc(skill, levelData) {
    //var lv= skill.getLv()===0?1:skill.getLv();
    var effects = skill.traverseSkillEffects();
    return buildDesc(effects, skill.getDesc(), {"duration": skill.getLevelData()['duration']});
}
function buildSkillBuffDesc(skill, levelData) {
    //var lv= skill.getLv()===0?1:skill.getLv();
    var effects = skill.traverseSkillEffects();
    return buildDesc(effects, skill.getBuffDesc(), {"duration": skill.getLevelData()['duration']});
}
function canUnlockItem(hero, target) {
    var heroLv = hero.getLv();
    var unlockLevel = target.getUnlockLevel();
    return !(heroLv < unlockLevel);
}

function lockItem(hero, target, elements) {
    (!elements.lock_btn.layer.isVisible()) && elements.lock_btn.layer.setVisible(true);
    elements.upgrade_btn.layer.isVisible() && elements.upgrade_btn.layer.setVisible(false);
    elements.lock_btn.level_text.setString('Lv.' + target.getUnlockLevel());
}

function lockItemIfNecessary(hero, target, elements) {
    if (!canUnlockItem(hero, target)) {
        lockItem(hero, target, elements);
    }
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


        function setFont(target) {
            if (target instanceof Array) {
                for (var i in target) {
                    if (target[i].setFontName) {
                        target[i].setFontName("微软雅黑");
                    }
                    target[i].setColor(cc.color(0, 0, 0))
                }
            }
            else {
                if (target.setFontName) {
                    target.setFontName("微软雅黑");
                }
                target.setColor(cc.color(0, 0, 0))
            }
        }

        var upgrade_btn_layoutTemp = heroTemp.getChildByName('upgrade_btn');
        var upgradeBtnPosition = upgrade_btn_layoutTemp.getPosition();
        var upgrade_btnTemp = upgrade_btn_layoutTemp.getChildByName('btn');
        var maxLevelBtn_layoutTemp = heroTemp.getChildByName('MaxLevel');
        var maxLevelBtnTemp = maxLevelBtn_layoutTemp.getChildByName('btn');
        var maxLevelBtnPosition = maxLevelBtn_layoutTemp.getPosition();
        var revive_btnBtn_layoutTemp = heroTemp.getChildByName('revive_btn');
        var revive_btnBtnTemp = revive_btnBtn_layoutTemp.getChildByName('btn');
        var revive_btnPosition = revive_btnBtn_layoutTemp.getPosition();

        function buildUpgradeBtn(elements, btnlayer, target) {
            var buff_text = btnlayer.getChildByName('buff_text');//buff文字
            //var relic_icon = btnlayer.getChildByName('relic_icon');//宝物图标
            var buffNum_text = btnlayer.getChildByName('buffNum_text');//buff数
            var icon = btnlayer.getChildByName('icon');
            var lock = btnlayer.getChildByName('lock');
            //var gold_icon = btnlayer.getChildByName('gold_icon');//消耗金币
            var text_yellow = btnlayer.getChildByName('text_yellow');//统一文字
            var diamond = btnlayer.getChildByName('diamond_icon');//钻石图标
            //diamond.setVisible(false)
            //relic_icon.setVisible(false)
            elements.upgrade_btn = {};
            elements.upgrade_btn.icon = icon;
            elements.upgrade_btn.layer = btnlayer;
            elements.upgrade_btn.btn = btnlayer.getChildByName('btn');
            //elements.upgrade_btn.gold_icon = gold_icon;
            elements.upgrade_btn.text_yellow = text_yellow;
            elements.upgrade_btn.diamond = diamond;
            //elements.upgrade_btn.relic = relic_icon;
            elements.upgrade_btn.buff_text = buff_text;
            elements.upgrade_btn.buffNum_text = buffNum_text;
            elements.upgrade_btn.lock = lock;
            elements.upgrade_btn.buffNum_text.ignoreContentAdaptWithSize(true);
            elements.upgrade_btn.text_yellow.ignoreContentAdaptWithSize(true);
            var cost = target.getNextLevelUpgrade()
            icon.loadTexture('res/icon/resources_small/' + cost.unit + '.png');
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
            buildUpgradeBtn(elements, btnlayer, hero);
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
            elements.dps_text.setColor(cc.color(2, 177, 234));
            elements.dps = dps;
            elements.heroName_text = heroName_text;
            elements.die_text = die_text;
            elements.die_time_text = die_time_text;
            elements.revive_btn = {};
            elements.revive_btn.layer = revive_btn;
            elements.revive_btn.btn = revive_btn.getChildByName('btn');
            elements.revive_btn.diamond_text = diamond_text;
            diamond_text.ignoreContentAdaptWithSize(true);
            //elements.upgrade_btn.per.setVisible(false);
            dps.ignoreContentAdaptWithSize(true);
            dps_text.ignoreContentAdaptWithSize(true);
            //elements.upgrade_btn.diamond.setVisible(false);
            icon.loadTexture("res/icon/heroes/" + hero.getIcon());
            icon.setTouchEnabled(true);
            icon.addClickEventListener(function () {
                openDesc(hero);
            });
            heroName_text.setString(hero.getName());
            lv.setString('Lv.' + hero.getLv() + "/" + hero.getMaxLevel());
            dps_text.setString(parseInt(hero.getLife()));
            elements.revive_btn.btn.addClickEventListener(function () {
                if (hero.getCurrentLife() <= 0) {
                    var resurge = hero.getResurge();
                    resurge['cost']['value'] = -resurge['cost']['value'];
                    PlayerData.updateResource([resurge['cost']]);
                    PlayerData.updatePlayer();
                    customEventHelper.sendEvent(EVENT.GEM_VALUE_UPDATE);
                    // console.log('请注意，英雄' + hero.getId() + '请求买活....');
                    customEventHelper.sendEvent(EVENT.HERO_BUY_REVIVE, hero);
                }
            });
            customEventHelper.bindListener(EVENT.HERO_REVIVE_COUNTDOWN, function (event) {
                var data = event.getUserData();
                if (data['id'] === hero.getId()) {
                    elements.die_time_text.setString(Math.round(data['recover']));
                }
            });
            //elements.die_time_text.setFontName("微软雅黑");
            setFont([heroName_text, elements.upgrade_btn.buff_text]);
            //die_text.setVisible(false);
            //die_time_text.setVisible(false);
            //elements.revive_btn.layer.setVisible(false);
            if ((hero.getLv() > 0 && hero.getCurrentLife() > 0) || hero.getLv() == 0) {
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
                    elements.die_time_text.setString(Math.round(dieHero.getLevelData()['resurge']['time']));
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
                    die_text.setVisible(false);
                    die_time_text.setVisible(false);
                    elements.revive_btn.layer.setVisible(false);
                    elements.icon.setColor(cc.color(255, 255, 255));
                    if (hero.isMaxLevel()) {
                        (!elements.upgrade_btn.layer.isVisible()) && elements.upgrade_btn.layer.setVisible(false);
                        elements.maxLevel_btn.layer.setVisible(true);
                    } else {
                        elements.upgrade_btn.layer.setVisible(true)
                    }
                }
            });


            setElement(elements, hero, function (event, otherBtn) {
                var eventData = {};
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
                    elements.upgrade_btn.buffNum_text.setString(Math.floor(nextLevelLife - levelLife));
                }
                if (hero.getLv() == 1) {
                    customEventHelper.sendEvent(EVENT.UNLOCK_HERO, hero);
                }
            });
            return root;
        }

        function openDesc(hero) {
            var heroDesc = new HeroDesc();
            heroDesc.initData(hero);
        }

        function initSkillView(hero, skill, elements) {
            if (skill.isMaxLevel()) {
                return;
            }
            if (!canUnlockItem(hero, skill)) {
                lockItem(hero, skill, elements);
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
            var _effect = parseInt(showEffect);
            if (SkillEffectMappings[nextEffects[0]['type']]['type'] === 'rate') {
                _effect += "%"
            }
            buffNum_text.setString(_effect);
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
            buildUpgradeBtn(elements, upgradeSkill, skill);
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
            elements.lock_btn.btn.setEnabled(false);
            elements.lock_btn.btn.setBright(false);
            elements.lock_btn.level_text = lock_btn.getChildByName('level_text');
            elements.lock_btn.lock = lock_btn.getChildByName('lock');
            elements.lock_btn.layer.setVisible(false)
            icon.loadTexture("res/icon/skills/" + skill.getIcon());
            name.setString(skill.getName());
            desc.setString(buildSkillDesc(skill));
            lv.setString('Lv.' + skill.getLv() + "/" + skill.getMaxLevel());
            elements.lock_btn.level_text.setString("Lv." + skill.getUnlockLevel())
            elements.lock_btn.level_text.setColor(cc.color(255, 0, 0));
            setFont([name, desc, elements.upgrade_btn.buff_text]);
            customEventHelper.bindListener(EVENT.HERO_SKILL_UPGRADE_BTN, function (event) {
                    if (canUnlockItem(hero, skill)) {
                        if (!skill.isMaxLevel()) {
                            var nextlevelData = skill.getLevelData(skill.getLv() + 1);
                            validateEnoughResource(nextlevelData['upgrade'], elements.upgrade_btn.btn, elements.upgrade_btn.text_yellow);
                        }
                    }
                }
            );
            customEventHelper.bindListener(EVENT.HERO_UPGRADE, function () {
                if (canUnlockItem(hero, skill) && elements.lock_btn.layer.isVisible()) {
                    unlockAndInitSkill(skill, elements);
                }
            });
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
                customEventHelper.sendEvent(EVENT.UNLOCK_ACTIVITY_SKILL, skill.getId());
                if (skill.isMaxLevel()) {
                    elements.maxLevel_btn.layer.setVisible(true);
                    elements.upgrade_btn.layer.setVisible(false);
                } else {
                    var effects = skill.traverseSkillEffects();
                    var nextlevelData = skill.getLevelData(skill.getLv() + 1);
                    var nextAmount = nextlevelData['upgrade']['value'];
                    var nextEffects = skill.traverseSkillEffects(skill.getLv() + 1);
                    elements.upgrade_btn.text_yellow.setString(nextAmount);
                    var showEffect = Math.floor(nextEffects[0].value - effects[0].value);
                    elements.upgrade_btn.buff_text.setString(SkillEffectMappings[nextEffects[0]['type']]['name']);
                    if (SkillEffectMappings[nextEffects[0]['type']]['type'] === 'rate') {
                        showEffect += '%'
                    } else {
                    }
                    //todo
                    //elements.upgrade_btn.per.setVisible(false);
                    elements.upgrade_btn.buffNum_text.setString(showEffect);
                    lockItemIfNecessary(hero, skill, elements);
                }
            });
            initSkillView(hero, skill, elements);
            return root;
        }

        this.views = {};

        {//填充英雄的列表 循环填充英雄+技能
            var that = this;
            for (var i = 0; i < player.heroes.length; i++) {
                var heroData = PlayerData.getHeroesData(i);
                if (heroData.isLocked()) {
                    (function (data) {
                        var _hero = data;
                        customEventHelper.bindListener(EVENT.UNLOCK_HERO, function (event) {
                            var hero = event.getUserData();
                            if (hero.getId() === _hero.getUnLock()['value'] && !_hero.isLocked()) {
                                buildHeroMenu(_hero)
                                customEventHelper.sendEvent(EVENT.HERO_UPGRADE_BTN);
                                customEventHelper.sendEvent(EVENT.HERO_SKILL_UPGRADE_BTN);
                            }
                        });
                    })(heroData)
                } else {
                    buildHeroMenu(heroData);
                }
            }

            function buildHeroMenu(heroData) {
                var _heroView = buildHeroView(heroData);
                that.heroList.pushBackCustomItem(_heroView);
                that.views.heros = that.views.heros || [];
                that.views.heros[i] = _heroView;
                //var locked = heroData.isLocked();
                var skillsList = []
                for (var j = 0; j < heroData.getSkillCount(); j++) {
                    var skillData = heroData.getSkillData(j);
                    var _skillView = buildSkillView(skillData, heroData);
                    that.heroList.pushBackCustomItem(_skillView);
                    //locked && _skillView.setVisible(false);
                    skillsList.push(_skillView);
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
        this.playerEquip = this.root.getChildByName('title_root');
        var heroView = ccs.csLoader.createNode(res.equip_hero_view_json).getChildByName('root');
        var equipView = ccs.csLoader.createNode(res.equip_view_json).getChildByName('root');
        var itemView = ccs.csLoader.createNode(res.small_item_layer_json).getChildByName('root');


        var lockBtnLayoutTemplate = equipView.getChildByName('lock_btn');
        var lockBtnPosition = lockBtnLayoutTemplate.getPosition();
        var lockBtnTemplate = lockBtnLayoutTemplate.getChildByName('btn');
        var equipMaxLevelBtnLayoutTemplate = equipView.getChildByName('MaxLevel_btn');
        var maxLevelBtnTemplate = equipMaxLevelBtnLayoutTemplate.getChildByName('btn');
        var maxLevelBtnPosition = equipMaxLevelBtnLayoutTemplate.getPosition();
        var upgradeEquipBtn = equipView.getChildByName('upgrade_btn');
        var upgradeBtnTemp = upgradeEquipBtn.getChildByName('btn');
        var upgradeSkillPosition = upgradeEquipBtn.getPosition();


        function buildHeroView(hero, isFirst) {
            var root = heroView.clone();
            var icon = root.getChildByName('hero_icon');
            var name = root.getChildByName('heroName_text');
            var lv = root.getChildByName('level_text');
            var dps_text = root.getChildByName('dps_text');
            var player_equip = root.getChildByName('player_equip');
            var hero_equip = root.getChildByName('hero_equip');
            if (isFirst) {
                hero_equip.setVisible(false);
                player_equip.setVisible(true);
                var equipNum_text = player_equip.getChildByName('equipNum_text');
                equipNum_text.setString(hero.getEquipCount());
                equipNum_text.ignoreContentAdaptWithSize(true)
            } else {
                player_equip.setVisible(false);
                hero_equip.setVisible(true);
                var itemList = hero_equip.getChildByName('itemList');
                for (var i = 0; i < hero.getEquipCount(); i++) {
                    var equip = hero.getEquipData(i);
                    var item = itemView.clone();
                    var itemIcon = item.getChildByName('item_icon');
                    itemIcon.loadTexture('res/icon/equips/' + equip.getIcon());
                    itemList.addChild(item);
                }
            }
            icon.loadTexture("res/icon/heroes/" + hero.getIcon());
            dps_text.setString(parseInt(hero.getLife()));
            name.setString(hero.getName());
            lv.setString("Lv." + hero.getLv() + '/' + hero.getMaxLevel());
            dps_text.ignoreContentAdaptWithSize(true);
            return root;
        }
        //function initSkillView(hero, equip, elements) {
        //    if (equip.isMaxLevel()) {
        //        return;
        //    }
        //    if (!canUnlockItem(hero, equip)) {
        //        lockItem(hero, equip, elements);
        //    }/* else {
        //        unlockAndInitSkill(equip, elements);
        //    }*/
        //}
        function buildEquipView(equip, hero) {
            var root = equipView.clone();
            var lockLayer = lockBtnTemplate.clone();
            lockLayer.setPosition(lockBtnPosition);
            var maxLevel = maxLevelBtnTemplate.clone();
            maxLevel.setPosition(maxLevelBtnPosition);
            var upgradeLayer = upgradeBtnTemp.clone();
            upgradeLayer.setPosition(upgradeSkillPosition);
            root.addChild(lockLayer);
            root.addChild(maxLevel);
            root.addChild(upgradeLayer);
            var icon = root.getChildByName('equip_icon');
            var name = root.getChildByName('equipName_text');
            var desc = root.getChildByName('equipBuffDecs_text');
            var lv = root.getChildByName('equipLevel_text');
            icon.loadTexture("res/icon/equips/" + equip.getIcon());
            name.setString(equip.getName());
            desc.setString(buildDesc(equip.traverseEquipEffects(), equip.getDesc()));
            lv.setString("Lv." + equip.getLv() + "/" + equip.getMaxLevel());
            lv.setColor(cc.color(255, 226, 2));
            var upgradeBtnIcon = upgradeLayer.getChildByName('icon');
            var lockBtn=lockLayer.getChildByName('btn');
            lockBtn.setEnabled(false);
            lockBtn.setBright(false);
            if (equip.isMaxLevel()) {
                upgradeLayer.setVisible(false);
                maxLevel.setVisible(true);
            } else {
                maxLevel.setVisible(false);
                var text = upgradeLayer.getChildByName('text_yellow');
                text.ignoreContentAdaptWithSize(true);
                var upgradeCost = equip.getNextLevelUpgrade();
                upgradeBtnIcon.loadTexture('res/icon/resources_small/' + upgradeCost.unit + '.png');
                text.setString(upgradeCost.value);
                var upgradeBtn = upgradeLayer.getChildByName('btn');
                validateEnoughResource(upgradeCost, upgradeBtn, text)
                customEventHelper.bindListener(EVENT.GOLD_VALUE_UPDATE, function (event) {
                    updateResource(equip, {unit: 'gold'}, upgradeBtn, text);
                });
                customEventHelper.bindListener(EVENT.GEM_VALUE_UPDATE, function (event) {
                    updateResource(equip, {unit: 'gem'}, upgradeBtn, text);
                });
                customEventHelper.bindListener(EVENT.RELIC_VALUE_UPDATE, function (event) {
                    updateResource(equip, {unit: 'relic'}, upgradeBtn, text);
                });
                var elements={};
                elements.lock_btn={}
                elements.lock_btn.layer=lockLayer;
                elements.upgrade_btn={};
                elements.upgrade_btn.layer=upgradeLayer;
                elements.lock_btn.level_text=lockLayer.getChildByName('level_text');
                elements.lock_btn.level_text.ignoreContentAdaptWithSize(true);
                elements.lock_btn.level_text.setColor(cc.color(255,0,0));

                upgradeBtn.addClickEventListener(function (event) {
                    var cost = equip.getLevelData()['upgrade'];
                    equip.upgrade(hero);
                    if (cost.unit === "gold") {
                        customEventHelper.sendEvent(EVENT.GOLD_VALUE_UPDATE);
                    } else if (cost.unit === "gem") {
                        customEventHelper.sendEvent(EVENT.GEM_VALUE_UPDATE);
                    } else if (cost.unit === "relic") {
                        customEventHelper.sendEvent(EVENT.RELIC_VALUE_UPDATE);
                    }
                    lv.setString("Lv." + equip.getLv() + "/" + equip.getMaxLevel());
                    if (equip.isMaxLevel()) {
                        upgradeBtn.setVisible(false);
                        maxLevel.setVisible(true);
                    } else {
                        var nextCost = equip.getNextLevelUpgrade();
                        upgradeBtnIcon.loadTexture('res/icon/resources_small/' + nextCost.unit + '.png');
                        text.setString(nextCost.value);
                        validateEnoughResource(nextCost, upgradeBtn, text);
                    }
                    lockItemIfNecessary(hero, equip, elements);
                    console.log('equip[' + equip.getId() + '] has been clicked,current level is ' + equip.getLv());
                });
                lockItemIfNecessary(hero, equip, elements);
                customEventHelper.bindListener(EVENT.HERO_UPGRADE, function () {
                    if (canUnlockItem(hero, equip) && elements.lock_btn.layer.isVisible()) {
                        elements.lock_btn.layer.isVisible() && elements.lock_btn.layer.setVisible(false);
                        (!elements.upgrade_btn.layer.isVisible()) && elements.upgrade_btn.layer.setVisible(true);
                    }
                });
            }
            setFont([name, desc])
            return root;
        }

        function updateResource(equip, data, upgradeBtn, text) {
            var cost = equip.getNextLevelUpgrade();
            var unit = data['unit'];
            if (cost['unit'] === unit) {
                validateEnoughResource(cost, upgradeBtn, text);
            }
        }

        this.views = {};
        {
            var that = this;
            for (var i = 0; i < player.heroes.length; i++) {
                var heroData = PlayerData.getHeroesData(i);
                var isFirst = i === 0;
                if (heroData.getLv() > 0) {
                    buildEquipMenuIfUnlocked(heroData, isFirst);
                } else {
                    (function (hero) {
                        var _hero = hero;
                        var first = isFirst;
                        customEventHelper.bindListener(EVENT.HERO_UPGRADE, function (event) {
                            var heroId = event.getUserData()['heroId'];
                            if (heroId === _hero.getId() && _hero.getLv() === 1) {
                                buildEquipMenuIfUnlocked(_hero, first);
                            }
                        });
                    })(heroData)
                }
            }

            function buildEquipMenuIfUnlocked(heroData, isFirst) {
                var _heroView = buildHeroView(heroData, isFirst);
                console.log('build equip')
                that.heroList.pushBackCustomItem(_heroView);
                that.views.heros = that.views.heros || [];
                that.views.heros[i] = _heroView;
                for (var j = 0; j < heroData.getEquipCount(); j++) {
                    var equipData = heroData.getEquipData(j);
                    if(equipData.getLv()>0&&equipData.getType()===0){
                        var _equipView = buildEquipView(equipData, heroData);
                        that.heroList.pushBackCustomItem(_equipView);
                        _heroView.equips = _heroView.equips || [];
                        _heroView.equips[j] = _equipView;
                    }
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
        this.shake = 4000;
        this.last_update = 0;
        this.first_x = this.first_y = this.first_z = this.last_x = this.last_y = this.last_z = 0;
        this.falg = true;
        this.showMoneyTreeView = function (name) {
            var showMoneyTree = shopView.getChildByName(name);
            var diamondText = showMoneyTree.getChildByName("diamond_text");
            var goldText = showMoneyTree.getChildByName("gold_text");
            diamondText.ignoreContentAdaptWithSize(true);
            diamondText.setString(CONSTS.money_tree_one_price);
            goldText.ignoreContentAdaptWithSize(true);
            goldText.setString(CONSTS.money_tree_one_price * PlayerData.getStageData().getMoneyTreeRatio());
            var buyBtn = showMoneyTree.getChildByName("btn").getChildByName("buy_btn");
            buyBtn.addClickEventListener(function () {
                self.buyGold(CONSTS.money_tree_one_price, (CONSTS.money_tree_one_price * PlayerData.getStageData().getMoneyTreeRatio()), true);
            });

            if (window.DeviceMotionEvent) {
                window.addEventListener("devicemotion", this.deviceMotionHandler, false);
            } else {
                alert("本设备不支持devicemotion事件");
            }
        };
        this.deviceMotionHandler = function (eventData) {
            var acceleration = eventData.accelerationIncludingGravity,
                currTime = new Date().valueOf(),
                diffTime = currTime - self.last_update;
            if (diffTime > 100 && self.falg) {
                self.last_update = currTime;
                self.first_x = acceleration.x;
                self.first_y = acceleration.y;
                self.first_z = acceleration.z;
                var speed = Math.abs(self.first_x + self.first_y + self.first_z - self.last_x - self.last_y - self.last_z) / diffTime * 10000
                if (speed > self.shake) {
                    self.falg = false;
                    self.buyGold(CONSTS.money_tree_one_price, (CONSTS.money_tree_one_price * PlayerData.getStageData().getMoneyTreeRatio()));
                }
                self.last_x = self.first_x;
                self.last_y = self.first_y;
                self.last_z = self.first_z;
            }
        }
        this.buyGold = function (gem, gold, flag) {
            var content = '购买成功';
            if (PlayerData.getAmountByUnit("gem") >= gem) {
                PlayerData.updateResource([PlayerData.createResourceData("gold", gold)
                    , PlayerData.createResourceData("gem", -gem)]);
                customEventHelper.sendEvent(EVENT.GOLD_VALUE_UPDATE);
                customEventHelper.sendEvent(EVENT.GEM_VALUE_UPDATE);
                PlayerData.updatePlayer();
                if (flag) {
                    return;
                }
            } else {
                content = '当前钻石不足';
            }
            new Popup1("友情提示", content, function (popup) {
                popup.hiddenPopup();
                self.falg = true;
            });
        };
        this.showPorpView = function (name) {
            var shopPorps = shopView.getChildByName(name).getChildByName('shopList');
            var shopItemLayer = ccs.csLoader.createNode(res.shop_icon_layer);
            var shopItemLayerRoot = shopItemLayer.getChildByName("root");
            var shopIconLayer = shopItemLayerRoot.getChildByName('itemLayer');
            var shopIconLayerRoot = shopIconLayer.getChildByName('root');
            var shopListView = ccs.csLoader.createNode(res.shop_list_view);
            var shopListViewRoot = shopListView.getChildByName('root');
            var shopListViewRootClone = shopListViewRoot.clone();
            var goods = dataSource.goods;
            /* for (var j in shopListViewRoot.getChildren()) {
             shopListViewRoot.getChildren()[j].setVisible(false);
             }*/
            var n = n1 = 0;
            for (var i in goods) {
                n++;
            }
            var len = n;
            n = 0;
            shopPorps.removeAllChildren(true);
            for (var i in goods) {
                n++;
                n1++;
                var datas = goods[i];
                var itemLayer = shopItemLayerRoot.clone();

                var iconLayer = shopIconLayerRoot.clone();
                var saleText = iconLayer.getChildByName("sale_text");
                saleText.ignoreContentAdaptWithSize(true);
                saleText.setString(datas.num);

                var itemIcon = iconLayer.getChildByName("item_icon");
                itemIcon.loadTexture("res/icon/resources/" + datas.propId + ".png");
                iconLayer.setPosition(shopIconLayer.getPosition());
                itemLayer.addChild(iconLayer);
                itemLayer.getChildByName("item_name").setString(datas.propId);

                var res1 = itemLayer.getChildByName("res");

                var icon = res1.getChildByName("icon")
                icon.loadTexture("res/icon/resources/" + datas.price.unit + ".png");
                icon.setVisible(true);

                var resSaleText = res1.getChildByName("sale_text");
                resSaleText.setVisible(true);
                resSaleText.ignoreContentAdaptWithSize(true);
                resSaleText.setString(datas.price.value);

                var buyBtn = itemLayer.getChildByName("btn").getChildByName("buy_btn");

                self.clickBtn(buyBtn, datas);

                itemLayer.setPosition(shopListViewRoot.getChildByName("item" + n1).getPosition());
                shopListViewRootClone.addChild(itemLayer);

                if (n % 3 == 0 || n == len - 1) {
                    n1 = 0;
                    shopPorps.setItemsMargin(20);
                    shopPorps.pushBackCustomItem(shopListViewRootClone);
                    shopListViewRootClone = shopListViewRoot.clone();
                }
            }
        };
        this.clickBtn = function (buyBtn, goods) {
            buyBtn.addClickEventListener(function () {
                self.buyGoods(goods);
            });
        }
        this.buyGoods = function (goods) {
            var price = goods.price;
            if (PlayerData.getAmountByUnit(price.unit) >= price.value) {
                PlayerData.updateResource([PlayerData.createResourceData(price.unit, -price.value), PlayerData.createResourceData(goods.propId, goods.num)]);
                if (price.unit === "gold") {
                    customEventHelper.sendEvent(EVENT.GOLD_VALUE_UPDATE);
                } else if (price.unit === "gem") {
                    customEventHelper.sendEvent(EVENT.GEM_VALUE_UPDATE);
                } else if (price.unit === "relic") {
                    customEventHelper.sendEvent(EVENT.RELIC_VALUE_UPDATE);
                }
                customEventHelper.sendEvent(EVENT.PACK_VALUE_UPDATE);
                PlayerData.updatePlayer();
            } else {
                if (price.unit === 'gem') {
                    new Popup1("友情提示", "当前钻石不足", function (popup) {
                        popup.hiddenPopup();
                        //进入充值页面。
                    });
                } else if (price.unit === 'gold') {
                    new Popup1("友情提示", "当前金币不足,点击确定进入点金页面", function (popup) {
                        popup.hiddenPopup();
                        self.showMenuLayer("moneyTree_tab");
                    });
                } else {
                    new Popup1("友情提示", "当前该资源不足", function (popup) {
                        popup.hiddenPopup();
                    });
                }
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
            var players = PlayerData.getCurrentRanksByType(type.replace('_tab',"rank"));
            myNumText.ignoreContentAdaptWithSize(true);
            myNumText.setString(PlayerData.getMyRankByType(type.replace('_tab',"rank")));
            myNumText.setColor(cc.color(63, 193, 61));
            n = 0;
            for (var i in players) {
                n++;
                listView.addChild(this.setRankView(players[i], type));
                //rankView);
            }
        };
        this.setRankView = function (data, type) {
            var root = rankViewRoot.clone();
            rankViewRoot.ignoreContentAdaptWithSize(true);
            //var hero = new Hero(data.heroes[0]);
            //var root = rankView.getChildByName('root');
            root.getChildByName('player_icon').loadTexture("res/icon/heroes/" + data.player.avatarUrl);
            var playerName = root.getChildByName('player_name');
            var levelText = root.getChildByName('level_text');
            //var playerPrestige = root.getChildByName('player_prestige');
            //var prestigeText = root.getChildByName('prestige_text');
            //var playerLv = root.getChildByName('player_lv');
            var myBg = root.getChildByName('my_bg');
            var num = root.getChildByName('num');
            setFont([playerName]);
            //setColor([levelText, playerPrestige, prestigeText, playerLv]);

            setIgnoreContentAdaptWithSize([levelText, /*prestigeText,*/ num]);
            levelText.setString("Lv." + data.player.level);
            num.setString(data.index+1);
            playerName.setString(data.player.name);
            if (data.player.id == player.id) {
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