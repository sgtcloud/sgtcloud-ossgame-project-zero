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
        this.onHeroDead = function () {
        }
        this.onHeroRecover = function () {
        }
    }
});
//UI上显示的技能ICON
var SkillIcon = function (root, index, skillsBox, tabPanel) {
    this.root = root;
    var x = root.width
    var y = root.height;
    var num = 5;
    var boxWidth = skillsBox.width;
    var margin = 5;
    var offsetX = boxWidth - num * x - (num - 1) * margin;
    root.setPosition((index < num ? offsetX : 0) + (x + margin) * (index - num * Math.floor(index / num)), (y + margin) * Math.floor(index / num));
    this.skill_icon = root.getChildByName('skill_icon');
    this.reviveText = root.getChildByName('reviveTime_text');
    this.time = root.getChildByName('time');
    this.cooldownText = root.getChildByName('cooldown_text');
    this.durationText = root.getChildByName('duration_text');
    this.reviveText.setVisible(false);
    this.time.setVisible(false);
    this.time.setColor(cc.color(255, 0, 0));
    this.cooldownText.setVisible(false);
    this.durationText.setVisible(false);
    var isCoolDowning = false;
    var heroDead = false;
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
            var randomBuff = false;
            customEventHelper.bindListener(EVENT.CAST_SKILL_READY, function (e) {
                var data = e.getUserData();
                if (that.skill.getId() === data.skillId) {
                    if (!randomBuff) {
                        var duration = that.skill.getLevelData(data.level)['duration'];
                        var randomSkill = new Skill(data.skillId, data.level);
                        if (duration > 0) {
                            toggleBufflayer(duration, buildSkillBuffDesc(randomSkill), that.skill.getIcon());
                        }
                        customEventHelper.sendEvent(EVENT.CAST_SKILL, randomSkill);
                        randomBuff = true;
                        that.skill_icon.setColor(cc.color(90, 90, 90));
                        setTimeout(function () {
                            if (!(heroDead || isCoolDowning))
                                that.skill_icon.setColor(cc.color(255, 255, 255));
                            randomBuff = false;
                        }, duration * 1000);
                    } else /*if ( randomBuff)*/ {
                        toggleTip('已有相同类型buff');
                    }
                }
            });
            function doCoolDown(levelData) {
                if (levelData['cooldown'] > 0) {
                    isCoolDowning = true;
                    that.cooldownText.setVisible(true);
                    that.time.setVisible(true);
                    that.time.setString(levelData['cooldown']);
                    that.skill_icon.setColor(cc.color(90, 90, 90));
                    doSchedule(levelData['cooldown'] - 1, that.time, function () {
                        if (!heroDead && !randomBuff) {
                            that.skill_icon.setColor(cc.color(255, 255, 255));
                        }
                        that.cooldownText.isVisible() && that.cooldownText.setVisible(false);
                        if (!heroDead) {
                            that.time.isVisible() && that.time.setVisible(false)
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
                        randomBuff = true;
                        toggleBufflayer(levelData['duration'], buildSkillBuffDesc(skill), that.skill.getIcon(), function () {
                            randomBuff = false;
                        });
                    }
                    customEventHelper.sendEvent(EVENT.CAST_SKILL, that.skill);
                } else if (isCoolDowning && !heroDead) {
                    console.log('技能【' + that.skill.getId() + "】冷却中，请稍候再点！");
                    //toggleTip();
                } else {
                    console.log('英雄已死亡，请稍候再点！');
                }
            }

            this.skill_icon.addClickEventListener(function () {
                var levelData = that.skill.getLevelData();
                if (!(heroDead || isCoolDowning) && randomBuff) {
                    toggleTip('已有相同类型buff');
                } else {
                    tryFire(levelData);
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
                    that.setCoolTime(Math.round(data['recover']));
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
        this.time.setString(time);
    }
    this.setEnabled = function (state) {
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

var BloodBox = function (root) {
    this.root = root.getChildByName('blood_box');
    this.init();
}
BloodBox.prototype.init = function () {
    var smallNum = 10;
    var middleNum = 10;
    var largeNum = 10;
    this.smallBtn = this.root.getChildByName('small_btn');
    this.smallText = this.root.getChildByName('small_text');
    this.middleBtn = this.root.getChildByName('middle_btn');
    this.middleText = this.root.getChildByName('middle_text');
    this.largeBtn = this.root.getChildByName('large_btn');
    this.largeText = this.root.getChildByName('large_text');

    this.smallText.ignoreContentAdaptWithSize(true);
    this.middleText.ignoreContentAdaptWithSize(true);
    this.largeText.ignoreContentAdaptWithSize(true);

    var updateNum = function (text, num, btn) {
        text.setString(num);
        if (num <= 0) {
            btn.setEnabled(false);
            btn.setBright(false);
        }
    }


    var i = 0;
    var drawMaskLayer = function (root, node) {

        var drawNode = new cc.DrawNode();
        //root.addChild(drawNode, 1000);
        drawNode.clear()
        drawNode.ctor();
        var radius = Math.min(node.width, node.height) / 2 + 0.5;
        var color = cc.color(0, 0, 0,100);
        var center = cc.p(node.getPositionX() + node.width / 2, node.height / 2);
        drawNode.drawDot(center, radius, color);
        drawNode.drawCircle(center,radius,360, 60, false, node.width, color);
        return drawNode;
    }


    var MaskLayer = cc.LayerColor.extend({
        m_touchListener: null,
        ctor: function () {
            this._super();
            var touchListener = {
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: this.onTouchBegan,
                isTouchInside: function (owner, touch) {
                    if (!owner || !owner.getParent()) {
                        return false;
                    }
                    var touchLocation = touch.getLocation(); // Get the touch position
                    touchLocation = owner.getParent().convertToNodeSpace(touchLocation);
                    return cc.rectContainsPoint(owner.getBoundingBox(), touchLocation);
                }
            };
            cc.eventManager.addListener(touchListener, this);
            this.m_touchListener = touchListener;
        },
        onTouchBegan: function (touch, event) {
            var target = event.getCurrentTarget();
            return !target.isVisible() || (!this.isTouchInside(target, touch));
        }
    });

    var that = this;
    var initBtn = function (btn, text, num, data) {
        btn.setEnabled(true);
        btn.setBright(true);
        btn.addClickEventListener(function () {
            customEventHelper.sendEvent(EVENT.USE_GAME_ITEMS, data);
            updateNum(text, --num, btn);
        });
    };


    updateNum(this.smallText, smallNum, this.smallBtn);
    updateNum(this.middleText, middleNum, this.middleBtn);
    updateNum(this.largeText, largeNum, this.largeBtn);

    initBtn(this.smallBtn, this.smallText, smallNum, {id: ITEM.small_hp_potion, name: 'small_btn', num: 1});
    initBtn(this.middleBtn, this.middleText, middleNum, {id: ITEM.medium_hp_potion, name: 'middle_btn', num: 1});
    initBtn(this.largeBtn, this.largeText, largeNum, {id: ITEM.large_hp_potion, name: 'large_btn', num: 1});
};

var SkillListMenu = BattleMenu.extend({
    ctor: function (tabPanel, battlePanel) {
        var heroes = PlayerData.getHeroes();
        this._super(tabPanel, res.skill_layer_json);
        /**
         * 初始化药品菜单
         */
        new BloodBox(this.root);

        var skills = [];
        for (var i in heroes) {
            var activitySkills = getHeroActivtySkillls(heroes[i]);
            skills.push.apply(skills, activitySkills);
        }
        var skillBtns = [];
        var skillsBox = this.root.getChildByName('skill_box')
        var atk_text = this.root.getChildByName('atk_text');
        var tatk_text = this.root.getChildByName('tatk_text');
        atk_text.ignoreContentAdaptWithSize(true);
        tatk_text.ignoreContentAdaptWithSize(true);
        customEventHelper.bindListener(EVENT.UPGRADE_HERO_ATTACK, function () {
            var totalHit = PlayerData.getTotalHit();
            var totalAttack = PlayerData.getTotalAttack();
            tatk_text.setString(Math.floor(totalHit));
            atk_text.setString(Math.floor(totalAttack));
        });
        var skillIconTemplate = ccs.csLoader.createNode(res.skill_icon_json).getChildByName('root');
        for (var i = 0; i < skills.length; i++) {
            var skillBtn = new SkillIcon(skillIconTemplate.clone(), i, skillsBox, tabPanel);
            skillBtn.bindSkillAndClickEvent(skills[i]);
            skillBtns.push(skillBtn);
        }
        function format(time) {
            return new Date(time).Format('mm:ss');
        }

        this.refreshSkillState = function () {
            battlePanel.battleField.foreachHeroSprite(function (hero, i) {
                var skill = skillBtns[i];
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
        };

        this.update = function (dt) {
        };
        this.onHeroDead = function (_hero) {
            this.refreshSkillState();
        };
        this.onHeroRecover = function (hero) {
            this.refreshSkillState();
        };
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
    var effects = skill.traverseSkillEffects();
    return buildDesc(effects, skill.getDesc(), {"duration": skill.getLevelData()['duration']});
}
function buildSkillBuffDesc(skill, levelData) {
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
    var flag = canUnlockItem(hero, target);
    if (!flag) {
        lockItem(hero, target, elements);
    }
    return flag;
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
                    elements.upgrade_btn.buffNum_text.setString(toFixed2(nextLevelLife - levelLife));
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
            var buffNum_text = btnlayer.getChildByName('buffNum_text');//buff数
            var icon = btnlayer.getChildByName('icon');
            var lock = btnlayer.getChildByName('lock');
            var text_yellow = btnlayer.getChildByName('text_yellow');//统一文字
            var diamond = btnlayer.getChildByName('diamond_icon');//钻石图标
            elements.upgrade_btn = {};
            elements.upgrade_btn.icon = icon;
            elements.upgrade_btn.layer = btnlayer;
            elements.upgrade_btn.btn = btnlayer.getChildByName('btn');
            elements.upgrade_btn.text_yellow = text_yellow;
            elements.upgrade_btn.diamond = diamond;
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
            elements.maxLevel_btn.btn.setEnabled(false)
            elements.maxLevel_btn.btn.setBright(false)
            elements.maxLevel_btn.upMax_text = maxLevel.getChildByName('upMax_text');
            elements.maxLevel_btn.layer.setVisible(false);
        }

        function refeshUpgradeLayer(hero, elements) {
            if (!hero.isMaxLevel()) {
                var nextlevelData = hero.getLevelData(hero.getLv() + 1);
                validateResourceNotEnough(nextlevelData['upgrade'], elements.upgrade_btn.btn, elements.upgrade_btn.text_yellow);
            }
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
            dps.ignoreContentAdaptWithSize(true);
            dps_text.ignoreContentAdaptWithSize(true);
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
                    //resurge['cost']['value'] = -resurge['value'];
                    var cost = {unit: resurge['cost'], value: -resurge['value']}
                    PlayerData.updateResource([cost]);
                    PlayerData.updatePlayer();
                    customEventHelper.sendEvent(EVENT.GEM_VALUE_UPDATE);
                    customEventHelper.sendEvent(EVENT.HERO_BUY_REVIVE, hero);
                }
            });
            customEventHelper.bindListener(EVENT.HERO_REVIVE_COUNTDOWN, function (event) {
                var data = event.getUserData();
                if (data['id'] === hero.getId()) {
                    elements.die_time_text.setString(Math.round(data['recover']));
                }
            });
            setFont([heroName_text, elements.upgrade_btn.buff_text]);
            if ((hero.getLv() > 0 && hero.getCurrentLife() > 0) || hero.getLv() == 0) {
                die_text.setVisible(false);
                die_time_text.setVisible(false);
                elements.revive_btn.layer.setVisible(false);
            }

            customEventHelper.bindListener(EVENT.HERO_REFRESH_PROPS, function (event) {
                var eventHero = event.getUserData();
                if (eventHero.getId() === hero.getId()) {
                    //eventHero.refreshProps();
                    elements.dps_text.setString(parseInt(eventHero.getLife()));
                }
            });
            customEventHelper.bindListener(EVENT.ALL_HERO_REFRESH_PROPS, function (event) {
                console.log(hero.getLife())
                elements.dps_text.setString(parseInt(hero.getLife()));
            });
            customEventHelper.bindListener(EVENT.HERO_UPGRADE_BTN, function (event) {
                refeshUpgradeLayer(hero, elements);
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
                    var costValue = parseInt(resurge['value']);
                    elements.revive_btn.diamond_text.setString(costValue);
                    elements.die_time_text.setString(Math.round(dieHero.getLevelData()['resurge']['time']));
                    if (PlayerData.getAmountByUnit(resurge['cost']) < costValue) {
                        elements.revive_btn.btn.setEnabled(false);
                        elements.revive_btn.btn.setBright(false);
                        elements.revive_btn.diamond_text.setColor(cc.color(255, 0, 0));
                    }
                }
            });

            customEventHelper.bindListener(EVENT.GEM_VALUE_UPDATE, function () {
                if (!hero.getCurrentLife() > 0) {
                    var resurge = hero.getResurge();
                    var costValue = parseInt(resurge['value']);
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
                    var effect = nextLevelLife - levelLife;
                    elements.upgrade_btn.buffNum_text.setString(toFixed2(effect));
                }
                if (hero.getLv() == 1) {
                    customEventHelper.sendEvent(EVENT.UNLOCK_HERO, hero);
                }
            });
            if (typeof cb === 'function') {
                cb();
            }
            refeshUpgradeLayer(hero, elements);
            return root;
        }

        function openDesc(hero) {
            var heroDesc = new HeroDesc();
            heroDesc.initData(hero);
        }

        function toFixed2(num) {
            var _effect = 0;
            var absEffect = Math.abs(num);
            if (absEffect > 0 && absEffect < 1) {
                _effect = num.toFixed(2);
            } else {
                _effect = Math.floor(num);
            }
            if (_effect > 0) {
                _effect = '+' + _effect;
            }
            return _effect;
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
            var _effect = toFixed2(showEffect);
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
                            validateResourceNotEnough(nextlevelData['upgrade'], elements.upgrade_btn.btn, elements.upgrade_btn.text_yellow);
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
                hero.refreshProps();
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
                    if (showEffect > 0) {
                        showEffect = '+' + showEffect;
                    }
                    elements.upgrade_btn.buff_text.setString(SkillEffectMappings[nextEffects[0]['type']]['name']);
                    if (SkillEffectMappings[nextEffects[0]['type']]['type'] === 'rate') {
                        showEffect += '%'
                    } else {
                    }
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
                                setTimeout(function () {
                                    buildHeroMenu(_hero);
                                }, 100);
                            }
                        });
                    })(heroData)
                } else {
                    buildHeroMenu(heroData);
                }
            }

            function buildHeroMenu(heroData, cb) {
                var _heroView = buildHeroView(heroData, cb);
                that.heroList.pushBackCustomItem(_heroView);
                that.views.heros = that.views.heros || [];
                that.views.heros[i] = _heroView;
                var skillsList = []
                for (var j = 0; j < heroData.getSkillCount(); j++) {
                    var skillData = heroData.getSkillData(j);
                    var _skillView = buildSkillView(skillData, heroData);
                    that.heroList.pushBackCustomItem(_skillView);
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
        var title_root = this.root.getChildByName('title_root');
        var basic = 3;
        var nextValue = 0;
        var difValue = 5;

        function buildMagicalEquips(hero) {
            var title = title_root.getChildByName('title');
            var buy_btn = title_root.getChildByName('buy_btn')
            var buy_btn_layer = buy_btn.getChildByName('btn')
            var btn = buy_btn_layer.getChildByName('btn');
            var text_yellow = buy_btn_layer.getChildByName('text_yellow');
            var relic_icon = buy_btn_layer.getChildByName('relic_icon');
            var diamond_icon = buy_btn_layer.getChildByName('diamond_icon');
            var decs_text = title_root.getChildByName('decs_text');
            var equipAll_text = title_root.getChildByName('equipAll_text');
            text_yellow.ignoreContentAdaptWithSize(true);
            diamond_icon.setVisible(false);
            equipAll_text.setVisible(false);
            relic_icon.setVisible(true);
            setFont(decs_text);
            var elements = {
                buy_btn_layer: buy_btn_layer,
                equipAll_text: equipAll_text,
                text_yellow: text_yellow,
                btn: btn
            };
            refeshMagicalEquips(hero, elements);
            customEventHelper.bindListener(EVENT.RELIC_VALUE_UPDATE, function () {
                validateResourceNotEnough({unit: 'relic', value: nextValue}, btn, text_yellow);
            })
            btn.addClickEventListener(function () {
                var equipObject = randomEquip(hero);
                customEventHelper.sendEvent(EVENT.UPDATE_RESOURCE, {unit: equipObject.unit, value: -equipObject.value});
                var price = {value: nextValue, unit: equipObject.unit};
                equipObject.equip.upgrade(hero, price);
                pushMagicalEquips(equipObject.equip, hero);
                refeshMagicalEquips(hero, elements);
                PlayerData.refreshAllHerosProps();
                customEventHelper.sendEvent(EVENT.ALL_HERO_REFRESH_PROPS, hero);
            });
        }

        function refeshMagicalEquips(hero, elements) {
            var equips = hero.getEquips();
            var count = 0;
            for (var i in equips) {
                var e = equips[i];
                if (e.getType() > 0 && e.getLv() > 0) {
                    count++;
                }
            }
            customEventHelper.sendEvent(EVENT.UPGRADE_EQUIP_NUM, count);
            if (count === hero.getEquipCount()) {
                elements.buy_btn_layer.setVisible(false);
                elements.equipAll_text.setVisible(true);
            } else {
                nextValue = nextMagicalValue(hero);
                elements.text_yellow.setString(nextValue);
                validateResourceNotEnough({unit: 'relic', value: nextValue}, elements.btn, elements.text_yellow);
            }
        }

        customEventHelper.bindListener(EVENT.UPDATE_RESOURCE, function (event) {
            var data = event.getUserData();
            var unit = data.unit;
            var value = data.value;
            switch (unit) {
                case 'gold':
                    customEventHelper.sendEvent(EVENT.GOLD_VALUE_UPDATE);
                    break;
                case 'gem':
                    customEventHelper.sendEvent(EVENT.GEM_VALUE_UPDATE);
                    break;
                case 'relic':
                    customEventHelper.sendEvent(EVENT.RELIC_VALUE_UPDATE);
                    break;
            }
        });

        function randomEquip(hero) {
            var equips = hero.getEquips();
            var equipsList = [];
            for (var i in equips) {
                if (equips[i].getLv() === 0) {
                    equipsList.push(equips[i]);
                }
            }
            nextValue = basic + (equips.length - equipsList.length) * difValue;
            var bonus = [];
            for (var i in equipsList) {
                var weight = equipsList[i].getType();
                var bo = {};
                bo.w = weight;
                var f = {};
                f.unit = equipsList[i].getNextLevelUpgrade()['unit'];
                f.value = nextValue;
                f.equip = equipsList[i];
                bo.f = f;
                bonus.push(bo);
            }
            var chance = new Chance(bonus);
            return chance.next();
        }

        function nextMagicalValue(hero) {
            var equips = hero.getEquips();
            var k = 1;
            for (var i in equips) {
                if (equips[i].getLv() > 0 && equips[i].getLv() > 0) {
                    k++;
                }
            }
            return basic + (k - 1) * difValue;
        }

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
                var equips = hero.getEquips();
                var count = 0;
                for (var i in equips) {
                    if (equips[i].getType() > 0 && equips[i].getLv() > 0) {
                        count++;
                    }
                }
                equipNum_text.setString(count);
                customEventHelper.bindListener(EVENT.UPGRADE_EQUIP_NUM, function (event) {
                    equipNum_text.setString(event.getUserData());
                });
                equipNum_text.ignoreContentAdaptWithSize(true)
            } else {
                player_equip.setVisible(false);
                hero_equip.setVisible(true);
                var itemList = hero_equip.getChildByName('itemList');
                for (var i = 0; i < hero.getEquipCount(); i++) {
                    var equip = hero.getEquipData(i);
                    var item = itemView.clone();
                    (function (item) {
                        var itemIcon = item.getChildByName('item_icon');
                        itemIcon.loadTexture('res/icon/equips/' + equip.getIcon());
                        customEventHelper.bindListener("itemIcon-" + equip.getId() + "-gray", function () {
                            itemIcon.setColor(cc.color(90, 90, 90));
                        });
                        customEventHelper.bindListener("itemIcon-" + equip.getId() + "-white", function () {
                            itemIcon.setColor(cc.color(255, 255, 255));
                        });
                    })(item)
                    itemList.addChild(item);
                }
            }
            setFont(name);
            icon.loadTexture("res/icon/heroes/" + hero.getIcon());
            dps_text.setString(parseInt(hero.getLife()));
            customEventHelper.bindListener(EVENT.HERO_UPGRADE,function(event){
                var data=event.getUserData();
                if(data['heroId']===hero.getId()){
                    lv.setString("Lv." + hero.getLv() + '/' + hero.getMaxLevel());
                }
            });
            customEventHelper.bindListener(EVENT.ALL_HERO_REFRESH_PROPS, function (event) {
                console.log(hero.getLife())
                dps_text.setString(parseInt(hero.getLife()));
            });
            customEventHelper.bindListener(EVENT.HERO_REFRESH_PROPS, function (event) {
                var eventhero = event.getUserData();
                if (eventhero.getId() === hero.getId()) {
                    console.log(hero.getLife());
                    dps_text.setString(parseInt(hero.getLife()));
                }
            });
            name.setString(hero.getName());
            lv.setString("Lv." + hero.getLv() + '/' + hero.getMaxLevel());
            dps_text.ignoreContentAdaptWithSize(true);
            return root;
        }

        function buildEquipView(equip, hero) {
            var root = equipView.clone();
            var lockLayer = lockBtnTemplate.clone();
            lockLayer.setPosition(lockBtnPosition);
            var maxLevel = maxLevelBtnTemplate.clone();
            maxLevel.setPosition(maxLevelBtnPosition);
            var maxBtn = maxLevel.getChildByName('btn');
            maxBtn.setEnabled(false);
            maxBtn.setBright(false);
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
            var lockBtn = lockLayer.getChildByName('btn');
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

                refeshItemIcon(validateResourceNotEnough(upgradeCost, upgradeBtn, text), equip.getId());

                customEventHelper.bindListener(EVENT.GOLD_VALUE_UPDATE, function (event) {
                    updateResource(equip, {unit: 'gold'}, upgradeBtn, text);
                });
                customEventHelper.bindListener(EVENT.GEM_VALUE_UPDATE, function (event) {
                    updateResource(equip, {unit: 'gem'}, upgradeBtn, text);
                });
                customEventHelper.bindListener(EVENT.RELIC_VALUE_UPDATE, function (event) {
                    updateResource(equip, {unit: 'relic'}, upgradeBtn, text);
                });
                var elements = {};
                elements.lock_btn = {}
                elements.lock_btn.layer = lockLayer;
                elements.upgrade_btn = {};
                elements.upgrade_btn.layer = upgradeLayer;
                elements.lock_btn.level_text = lockLayer.getChildByName('level_text');
                elements.lock_btn.level_text.ignoreContentAdaptWithSize(true);
                elements.lock_btn.level_text.setColor(cc.color(255, 0, 0));
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
                    desc.setString(buildDesc(equip.traverseEquipEffects(), equip.getDesc()));
                    lv.setString("Lv." + equip.getLv() + "/" + equip.getMaxLevel());
                    if (equip.isMaxLevel()) {
                        elements.upgrade_btn.layer.setVisible(false);
                        maxLevel.setVisible(true);
                    } else {
                        var nextCost = equip.getNextLevelUpgrade();
                        upgradeBtnIcon.loadTexture('res/icon/resources_small/' + nextCost.unit + '.png');
                        text.setString(nextCost.value);
                        validateResourceNotEnough(nextCost, upgradeBtn, text);
                    }
                    if (equip.getType() > 0) {
                        PlayerData.refreshAllHerosProps();
                        PlayerData.refreshGlobeProps();
                        customEventHelper.sendEvent(EVENT.ALL_HERO_REFRESH_PROPS, hero);
                    } else {
                        hero.refreshProps();
                        customEventHelper.sendEvent(EVENT.HERO_REFRESH_PROPS, hero);
                    }
                    refeshItemIcon(!lockItemIfNecessary(hero, equip, elements), equip.getId());

                });
                refeshItemIcon(!lockItemIfNecessary(hero, equip, elements), equip.getId());
                customEventHelper.bindListener(EVENT.HERO_UPGRADE, function () {
                    if (equip.getType()===0&&!equip.isMaxLevel()&&canUnlockItem(hero, equip) && elements.lock_btn.layer.isVisible()) {
                        elements.lock_btn.layer.isVisible() && elements.lock_btn.layer.setVisible(false);
                        (!elements.upgrade_btn.layer.isVisible()) && elements.upgrade_btn.layer.setVisible(true);
                    }
                });
            }
            setFont([name, desc])
            return root;
        }

        function refeshItemIcon(flag, id) {
            if (flag) {
                customEventHelper.sendEvent("itemIcon-" + id + "-gray");
            } else {
                customEventHelper.sendEvent("itemIcon-" + id + "-white");
            }
        }

        function updateResource(equip, data, upgradeBtn, text) {
            var cost = equip.getNextLevelUpgrade();
            var unit = data['unit'];
            if (cost['unit'] === unit) {
                refeshItemIcon(validateResourceNotEnough(cost, upgradeBtn, text), equip.getId());
            }
        }

        this.views = {};
        {
            var that = this;
            for (var i = 0; i < player.heroes.length; i++) {
                var heroData = PlayerData.getHeroesData(i);
                var isFirst = i === 0;
                if (isFirst) {
                    buildMagicalEquips(heroData);
                }
                if (heroData.getLv() > 0) {
                    buildEquipMenuIfUnlocked(heroData, isFirst);
                } else {
                    (function (hero) {
                        var _hero = hero;
                        var first = isFirst;
                        customEventHelper.bindListener(EVENT.HERO_UPGRADE, function (event) {
                            var heroId = event.getUserData()['heroId'];
                            if (heroId === _hero.getId() && _hero.getLv() === 1) {
                                setTimeout(function () {
                                    buildEquipMenuIfUnlocked(_hero, first);
                                }, 300);
                            }
                        });
                    })(heroData)
                }
            }

            function buildEquipMenuIfUnlocked(heroData, isFirst) {
                var _heroView = buildHeroView(heroData, isFirst);
                that.heroList.pushBackCustomItem(_heroView);
                that.views.heros = that.views.heros || [];
                that.views.heros[i] = _heroView;
                for (var j = 0; j < heroData.getEquipCount(); j++) {
                    var equipData = heroData.getEquipData(j);
                    if (equipData.getLv() > 0 || equipData.getType() === 0) {
                        var _equipView = buildEquipView(equipData, heroData);
                        that.heroList.pushBackCustomItem(_equipView);
                    }
                }
            }

            function pushMagicalEquips(equipData, heroData) {
                var _equipView = buildEquipView(equipData, heroData);
                var equips = heroData.getEquips();
                var index = 1;
                for (var i = 0; i < equips.length; i++) {
                    if (equips[i].getLv() > 0 && equips[i].getType() > 0) {
                        if (equipData.getId() === equips[i].getId()) {
                            break;
                        }
                        index++;
                    }
                }
                that.heroList.insertCustomItem(_equipView, index);
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

        customEventHelper.bindListener(EVENT.GOTO_NEXT_STAGE, function () {
            if(shopView.getChildByName('moneyTree_tab').visible)
                shopView.getChildByName('moneyTree_tab').getChildByName("gold_text").setString(PlayerData.getStageData().getMoneyTreeRatio());
        }.bind(this));

        this.showMoneyTreeView = function (name) {
            var showMoneyTree = shopView.getChildByName(name);
            var diamondText = showMoneyTree.getChildByName("diamond_text");
            var goldText = showMoneyTree.getChildByName("gold_text");
            diamondText.ignoreContentAdaptWithSize(true);
            diamondText.setString(CONSTS.money_tree_one_price);
            goldText.ignoreContentAdaptWithSize(true);
            goldText.setString(PlayerData.getStageData().getMoneyTreeRatio());
            var buyBtn = showMoneyTree.getChildByName("btn").getChildByName("buy_btn");
            buyBtn.addClickEventListener(function () {
                self.buyGold(CONSTS.money_tree_one_price, PlayerData.getStageData().getMoneyTreeRatio(), true);
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
                itemLayer.getChildByName("item_name").setString(CONSTS.resources_mapping[datas.propId]);
                setFont(itemLayer.getChildByName("item_name"));
                var res1 = itemLayer.getChildByName("res");

                var icon = res1.getChildByName("icon")
                icon.loadTexture("res/icon/resources_small/" + datas.price.unit + ".png");
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
                toggleTip({'delay':2.0,'text':'成功购买 '+ CONSTS.resources_mapping[goods.propId] + " * " + goods.num + '花费'+ CONSTS.resources_mapping[price.unit] + " * " + price.value});
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
            {name: "gold_tab"},
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

        customEventHelper.bindListener(EVENT.UPDATE_SELF_RANK, function (event) {
            for (var i in this.buttons) {
                if(this.buttons[i].selected && i === event.getUserData().leaderId.replace("rank","tab")){
                   /* PlayerData.getMyRankByType(event.getUserData().leaderId, function (result, data) {
                        if (result && cc.isObject(data))
                            myNumText.setString(data.index + 1);
                    });*/
                    this.showMenuLayer(i);
                    return ;
                }
            }
        }.bind(this));

        this.showRankList = function (type) {
            listView.removeAllChildren();
            PlayerData.getCurrentRanksByType(type.replace('tab', "rank"), function (result, data) {
                myNumText.setString('--');
                if (result) {
                    for (var i in data) {
                        listView.addChild(this.setRankView(data[i], type));
                        //rankView);
                    }
                    PlayerData.getMyRankByType(type.replace('tab', "rank"), function (result, data) {
                        if (result && cc.isObject(data))
                            myNumText.setString(data.index + 1);
                    });
                }
                myNumText.ignoreContentAdaptWithSize(true);
                myNumText.setColor(cc.color(63, 193, 61));
            }.bind(this));
        };
        this.setRankView = function (data, type) {
            var root = rankViewRoot.clone();
            rankViewRoot.ignoreContentAdaptWithSize(true);
            root.getChildByName('player_icon').loadTexture("res/icon/heroes/" + data.player.avatarUrl);
            var playerName = root.getChildByName('player_name');
            var levelText = root.getChildByName('level_text');
            /*var playerPrestige =*/
            root.getChildByName('player_prestige').setVisible(false);
            /*var prestigeText =*/
            root.getChildByName('prestige_text').setVisible(false);
            var myBg = root.getChildByName('my_bg');
            var num = root.getChildByName('num');
            var text = root.getChildByName('text');
            setFont([playerName]);
            setIgnoreContentAdaptWithSize([levelText, /*prestigeText,*/ num,text]);
            levelText.setString("Lv." + data.player.level);
            num.setString(data.index + 1);
            playerName.setString(data.player.name);
            if (data.player.id == player.id) {
                myBg.setVisible(true);
            } else {
                myBg.setVisible(false);
            }

            text.setString(data.score);
            if (type == 'gold_tab') {
                root.getChildByName('gold_rank').setVisible(true);
                root.getChildByName('stage_rank').setVisible(false);
                root.getChildByName('Max_stage').setVisible(false);
                root.getChildByName('Max_gold').setVisible(true);
                text.setColor(TIPS_COLOR.YELLOW);
            } else {
                root.getChildByName('stage_rank').setVisible(true);
                root.getChildByName('gold_rank').setVisible(false);
                root.getChildByName('Max_stage').setVisible(true);
                root.getChildByName('Max_gold').setVisible(false);
            }
            return root;
        };

        this.showMenuLayer("stage_tab");
    }
});