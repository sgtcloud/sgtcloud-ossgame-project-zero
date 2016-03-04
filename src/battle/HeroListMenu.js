/**
 * Created by Maron on 2016/2/29.
 */
var HeroListMenu = ListViewMenu.extend({
    ctor: function (battle) {
        this._super(battle, res.hero_layer_json);
        this.heroList = this.root.getChildByName('hero_list');
        this._heroTemp = ccs.csLoader.createNode(res.hero_view_json).getChildByName('root');
        this._skillTemp = ccs.csLoader.createNode(res.skill_view_json).getChildByName('root');
        this.setListView(this.heroList);
        this._skillTemp.setPositionX(this._heroTemp.width-this._skillTemp.width);
        var upgrade_btn_layoutTemp = this._heroTemp.getChildByName('upgrade_btn');
        this._upgradeBtnPosition = upgrade_btn_layoutTemp.getPosition();
        this._upgrade_btnTemp = upgrade_btn_layoutTemp.getChildByName('btn');
        var maxLevelBtn_layoutTemp = this._heroTemp.getChildByName('MaxLevel');
        this._maxLevelBtnTemp = maxLevelBtn_layoutTemp.getChildByName('btn');
        this._maxLevelBtnPosition = maxLevelBtn_layoutTemp.getPosition();
        var revive_btnBtn_layoutTemp = this._heroTemp.getChildByName('revive_btn');
        this._revive_btnBtnTemp = revive_btnBtn_layoutTemp.getChildByName('btn');
        this._revive_btnPosition = revive_btnBtn_layoutTemp.getPosition();

        var default_item = new ccui.Layout();
        default_item.setTouchEnabled(true);
        default_item.setContentSize(this._heroTemp.getContentSize());
        default_item.width = this.heroList.width;
        default_item.height = this._skillTemp.height;
        this.itemModel=default_item;
        this.setItemModel(this._skillTemp);


        var lockBtnLayoutTemplate = this._skillTemp.getChildByName('lock_btn');
        this._lockBtnPosition = lockBtnLayoutTemplate.getPosition();
        this._lockBtnTemplate = lockBtnLayoutTemplate.getChildByName('btn');
        var skillMaxLevelBtnLayoutTemplate = this._skillTemp.getChildByName('MaxLevel_btn');
        this._skillMaxLevelBtnTemplate = skillMaxLevelBtnLayoutTemplate.getChildByName('btn');
        this._skillMaxLevelBtnPosition = skillMaxLevelBtnLayoutTemplate.getPosition();
        var upgradeSkillLayoutTemp = this._skillTemp.getChildByName('upgrade_btn');
        this._upgradeSkillBtnTemp = upgradeSkillLayoutTemp.getChildByName('btn');
        this._upgradeSkillPosition = upgradeSkillLayoutTemp.getPosition();

        //this.views = {};
        {//填充英雄的列表 循环填充英雄+技能
            var that = this;
            for (var i = 0; i < player.heroes.length; i++) {
                var heroData = PlayerData.getHeroesData(i);
                if (heroData.isLocked()) {
                    lockHero(heroData);
                } else {
                    this.buildHeroMenu(heroData);
                }
            }
            function lockHero(data) {
                var _hero = data;
                customEventHelper.bindListener(EVENT.UNLOCK_HERO, function (event) {
                    var hero = event.getUserData();
                    if (hero.getId() === _hero.getUnLock()['value'] && !_hero.isLocked()) {
                        setTimeout(function () {
                            that.buildHeroMenu(_hero);
                            that.updateInnerContainerSize();
                        }, 100);
                    }
                });
            }
        }
        customEventHelper.sendEvent(EVENT.HERO_UPGRADE_BTN);
        customEventHelper.sendEvent(EVENT.HERO_SKILL_UPGRADE_BTN);
        this.scheduleUpdate();
    },
    _buildSkillView: function (item) {
        var lock_btn, maxLevel, upgradeSkill;
        var skill = item.target, hero = item.relation, root = item.root, first = false;
        if (typeof  root === 'undefined') {
            root = this._skillTemp.clone();
            lock_btn = this._lockBtnTemplate.clone();
            lock_btn.setPosition(this._lockBtnPosition);
            lock_btn.setName('lockBtnLayer');
            maxLevel = this._skillMaxLevelBtnTemplate.clone();
            maxLevel.setPosition(this._skillMaxLevelBtnPosition);
            maxLevel.setName('maxLevelLayer');
            upgradeSkill = this._upgradeSkillBtnTemp.clone();
            upgradeSkill.setPosition(this._upgradeSkillPosition);
            upgradeSkill.setName('upgradeSkillLayer');
            root.addChild(lock_btn);
            root.addChild(maxLevel);
            root.addChild(upgradeSkill);
            item.root = root;
            first = true;
        } else {
            lock_btn = root.getChildByName('lockBtnLayer');
            maxLevel = root.getChildByName('maxLevelLayer');
            upgradeSkill = root.getChildByName('upgradeSkillLayer');
        }
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
        elements.lock_btn.btn.setBright(false);
        elements.lock_btn.btn.setEnabled(true);
        elements.lock_btn.level_text = lock_btn.getChildByName('level_text');
        elements.lock_btn.lock = lock_btn.getChildByName('lock');
        elements.lock_btn.layer.setVisible(false);
        elements.lock_btn.btn.addClickEventListener(function () {
            tip.toggle('未达到解锁需求等级！');
        });
        icon.loadTexture("res/icon/skills/" + skill.getIcon());
        name.setString(skill.getName());
        desc.setString(buildDesc(skill.traverseSkillEffects(), skill.getDesc(), {"duration": skill.getLevelData()['duration']}));
        lv.setString('Lv.' + skill.getLv() + "/" + skill.getMaxLevel());
        elements.lock_btn.level_text.setString("Lv." + skill.getUnlockLevel())
        elements.lock_btn.level_text.setColor(cc.color(255, 0, 0));
        if (first) {
            setFont([name, desc, elements.upgrade_btn.buff_text]);
            this._bindSkillMenuListener(elements, skill, hero);
        }
        initView(elements, skill, function (event, otherBtn) {
            var eventData = {};
            var cost = skill.getNextLevelUpgrade();
            cost['value'] = -cost['value'];
            eventData.cost = cost;
            eventData.skillId = skill.getId();
            var levelData = skill.getLevelData();
            skill.upgrade();
            desc.setString(buildDesc(skill.traverseSkillEffects(), skill.getDesc(), {"duration": skill.getLevelData()['duration']}));
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
                var showEffect = (nextEffects[0].value - effects[0].value).toFixed(SkillEffectMappings[nextEffects[0]['type']]['fixed']);
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
        if (!skill.isMaxLevel()) {
            if (!canUnlockItem(hero, skill)) {
                lockItem(hero, skill, elements);
            } else {
                this._unlockAndInitSkill(skill, elements);
            }
        }
        return root;
    }, _bindSkillMenuListener: function (elements, skill, hero) {
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
                this._unlockAndInitSkill(skill, elements);
            }
        }.bind(this));
    },
    _buildHeroView: function (item, cb) {
        var hero = item.target, root = item.root;
        var btnlayer, revive_btn, upMaxLevelBtn, first = false;
        if (typeof  root === 'undefined') {
            root = this._heroTemp.clone();
            btnlayer = this._upgrade_btnTemp.clone();
            btnlayer.setPosition(this._upgradeBtnPosition);
            btnlayer.setName('btnLayer');
            upMaxLevelBtn = this._maxLevelBtnTemp.clone();//已满级
            upMaxLevelBtn.setPosition(this._maxLevelBtnPosition);
            upMaxLevelBtn.setName('upMaxLevelBtn');
            revive_btn = this._revive_btnBtnTemp.clone();//.getChildByName('revive_btn');
            revive_btn.setPosition(this._revive_btnPosition);
            revive_btn.setName('revive_btn');
            root.addChild(revive_btn);
            root.addChild(btnlayer);
            root.addChild(upMaxLevelBtn);
            first = true;
            item.root = root;
        } else {
            btnlayer = root.getChildByName('btnLayer');
            upMaxLevelBtn = root.getChildByName('upMaxLevelBtn');
            revive_btn = root.getChildByName('revive_btn');
        }
        var elements = {};
        buildUpgradeBtn(elements, btnlayer, hero);
        buildMaxLevelBtn(elements, upMaxLevelBtn)
        var icon = root.getChildByName('hero_icon');
        var lv = root.getChildByName('level_text');
        var dps_text = root.getChildByName('dps_text');
        var dps = root.getChildByName('dps');
        var die_text = root.getChildByName('die_text')
        var die_time_text = root.getChildByName('die_time_text')
        var heroName_text = root.getChildByName("heroName_text");
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
            //openDesc(hero);
            var heroDesc = new HeroDesc();
            heroDesc.initData(hero);
        });
        heroName_text.setString(hero.getName());
        lv.setString('Lv.' + hero.getLv() + "/" + hero.getMaxLevel());
        dps_text.setString(parseInt(hero.getLife()));
        elements.revive_btn.btn.addClickEventListener(function () {
            if (hero.getCurrentLife() <= 0) {
                var resurge = hero.getResurge();
                var cost = {unit: resurge['cost'], value: -resurge['value']}
                PlayerData.updateResource([cost]);
                customEventHelper.sendEvent(EVENT.GEM_VALUE_UPDATE);
                customEventHelper.sendEvent(EVENT.HERO_BUY_REVIVE, hero);
                PlayerData.updatePlayer();
            }
        });
        if (first) {
            setFont([heroName_text, elements.upgrade_btn.buff_text]);
            this._bindHeroMenuListener(elements, hero);
        }
        if ((hero.getLv() > 0 && hero.getCurrentLife() > 0) || hero.getLv() == 0) {
            elements.die_text.setVisible(false);
            elements.die_time_text.setVisible(false);
            elements.revive_btn.layer.setVisible(false);
        }
        initView(elements, hero, function (event, otherBtn) {
            var eventData = {};
            eventData.heroId = hero.getId();
            var cost = hero.getNextLevelUpgrade();
            cost['value'] = 0 - cost['value'];
            eventData.cost = cost;
            hero.upgrade();
            elements.lv.setString('Lv.' + hero.getLv() + '/' + hero.getMaxLevel());
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
                elements.upgrade_btn.buffNum_text.setString(toFixed2(effect, 0));
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
    },
    _bindHeroMenuListener: function (elements, hero) {
        customEventHelper.bindListener(EVENT.HERO_REVIVE_COUNTDOWN, function (event) {
            var data = event.getUserData();
            if (data['id'] === hero.getId()) {
                elements.die_time_text.setString(Math.round(data['recover']));
            }
        });
        customEventHelper.bindListener(EVENT.HERO_REFRESH_PROPS, function (event) {
            var eventHero = event.getUserData();
            if (eventHero.getId() === hero.getId()) {
                elements.dps_text.setString(parseInt(eventHero.getLife()));
            }
        });
        customEventHelper.bindListener(EVENT.ALL_HERO_REFRESH_PROPS, function (event) {
            customEventHelper.sendEvent(EVENT.HERO_REFRESH_PROPS, hero);
        });
        customEventHelper.bindListener(EVENT.HERO_UPGRADE_BTN, function (event) {
            refeshUpgradeLayer(hero, elements);
        });
        customEventHelper.bindListener(EVENT.HERO_DIE, function (event) {
            var dieHero = event.getUserData();
            var heroId = dieHero.getId();
            if (heroId === hero.getId()) {
                PlayerData.updateHeroDeadTime(heroId);
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
        });
        customEventHelper.bindListener(EVENT.HERO_REVIVE, function (event) {
            var heroId = event.getUserData().getId();
            if (heroId === hero.getId()) {
                elements.die_text.setVisible(false);
                elements.die_time_text.setVisible(false);
                elements.revive_btn.layer.setVisible(false);
                elements.icon.setColor(cc.color(255, 255, 255));
                PlayerData.clearHeroDeadTime(heroId);
                if (hero.isMaxLevel()) {
                    (!elements.upgrade_btn.layer.isVisible()) && elements.upgrade_btn.layer.setVisible(false);
                    elements.maxLevel_btn.layer.setVisible(true);
                } else {
                    elements.upgrade_btn.layer.setVisible(true)
                }
            }
        });
    },
    buildHeroMenu: function (heroData, cb) {
        var item = this.items.filter(function (i) {
            return i['target'].getId() === heroData.getId();
        });
        if (item.length === 0) {
            item.push({target: heroData, type: this.HERO_ITEM});
            Array.prototype.push.apply(this.items, item);
        }
        var _heroView = this._buildHeroView(item[0], cb);
        if (this.heroList.getItems().length < this._spawnCount) {
            var model=this.itemModel.clone();
            model.setPositionX(_heroView.getPositionX());
            model.height = _heroView.height;
            model.addChild(_heroView);
            model.setTag(this._totalCount);
            this.heroList.pushBackCustomItem(model);
        }
        this._totalCount++;
        for (var j = 0; j < heroData.getSkillCount(); j++) {
            var skillData = heroData.getSkillData(j);
            var skillItem = this.items.filter(function (i) {
                return i['target'].getId() === skillData.getId();
            });
            if (skillItem.length === 0) {
                skillItem.push({target: skillData, relation: heroData, type: this.SKILL_ITEM});
                Array.prototype.push.apply(this.items, skillItem);
            }
            var _skillView = this._buildSkillView(skillItem[0]);
            if (this.heroList.getItems().length < this._spawnCount) {
                var model=this.itemModel.clone();
                model.setPositionX(_skillView.getPositionX());
                model.height = _skillView.height;
                model.addChild(_skillView);
                model.setTag(this._totalCount);
                this.heroList.pushBackCustomItem(model);
            }
            this._totalCount++;
        }
    },
    updateItem: function (itemId, item) {
        item.setTag(itemId);
        item.removeAllChildren(true);
        var itemData=this.items[itemId>=this.items.length?this.items.length-1:itemId];
        var ite=itemData['root'];
        item.height = ite.height;
        item.addChild(ite);
        if(itemData['type']===this.HERO_ITEM){
            this._buildHeroView(itemData);
        }else if(itemData['type']===this.SKILL_ITEM){
            this._buildSkillView(itemData);
        }
    },
    _unlockAndInitSkill: function (skill, elements) {
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
        var _effect = toFixed2(showEffect, SkillEffectMappings[nextEffects[0]['type']]['fixed']);
        if (SkillEffectMappings[nextEffects[0]['type']]['type'] === 'rate') {
            _effect += "%"
        }
        buffNum_text.setString(_effect);
    }
});

function initView(elements, target, listener) {
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
            elements.upgrade_btn.buffNum_text.setString(toFixed2(nextLevelLife - levelLife, 0));
        }
        elements.upgrade_btn.btn.addClickEventListener(function (event) {
            listener(event, elements);
        });
    }
}

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
function toFixed2(num, fixed) {
    var _effect = 0;
    var absEffect = Math.abs(num);
    if (absEffect > 0 && absEffect < 1) {
        _effect = num.toFixed(fixed);
    } else {
        _effect = Math.floor(num);
    }
    if (_effect > 0) {
        _effect = '+' + _effect;
    }
    return _effect;
}

