/**
 * Created by Maron on 2016/2/29.
 */
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
            });
            btn.addClickEventListener(function () {
                var equipObject = randomEquip(hero);
                customEventHelper.sendEvent(EVENT.UPDATE_RESOURCE, {unit: equipObject.unit, value: -equipObject.value});
                var price = {value: nextValue, unit: equipObject.unit};
                equipObject.equip.upgrade(hero, price);
                PlayerData.refreshAllHerosProps();
                PlayerData.refreshGlobeProps();
                customEventHelper.sendEvent(EVENT.ALL_HERO_REFRESH_PROPS, hero);
                pushMagicalEquips(equipObject.equip, hero);
                refeshMagicalEquips(hero, elements);
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

        /*customEventHelper.bindListener(EVENT.UPDATE_RESOURCE, function (event) {
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
        });*/
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
            customEventHelper.bindListener(EVENT.HERO_UPGRADE, function (event) {
                var data = event.getUserData();
                if (data['heroId'] === hero.getId()) {
                    lv.setString("Lv." + hero.getLv() + '/' + hero.getMaxLevel());
                }
            });
            customEventHelper.bindListener(EVENT.ALL_HERO_REFRESH_PROPS, function (event) {
                customEventHelper.sendEvent(EVENT.HERO_REFRESH_PROPS, hero);
            });
            customEventHelper.bindListener(EVENT.HERO_REFRESH_PROPS, function (event) {
                var eventhero = event.getUserData();
                if (eventhero.getId() === hero.getId()) {
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
            lockBtn.setEnabled(true);
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
                elements.lock_btn = {};
                elements.lock_btn.layer = lockLayer;
                lockBtn.addClickEventListener(function () {
                    tip.toggle('未达到解锁需求等级！');
                });
                elements.upgrade_btn = {};
                elements.upgrade_btn.layer = upgradeLayer;
                elements.lock_btn.level_text = lockLayer.getChildByName('level_text');
                elements.lock_btn.level_text.ignoreContentAdaptWithSize(true);
                elements.lock_btn.level_text.setColor(cc.color(255, 0, 0));
                upgradeBtn.addClickEventListener(function (event) {
                    //var cost = equip.getLevelData()['upgrade'];
                    equip.upgrade(hero);
                    /*if (cost.unit === "gold") {
                        customEventHelper.sendEvent(EVENT.GOLD_VALUE_UPDATE);
                    } else if (cost.unit === "gem") {
                        customEventHelper.sendEvent(EVENT.GEM_VALUE_UPDATE);
                    } else if (cost.unit === "relic") {
                        customEventHelper.sendEvent(EVENT.RELIC_VALUE_UPDATE);
                    }*/
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
                    if (equip.getType() === 0 && !equip.isMaxLevel() && canUnlockItem(hero, equip) && elements.lock_btn.layer.isVisible()) {
                        elements.lock_btn.layer.isVisible() && elements.lock_btn.layer.setVisible(false);
                        (!elements.upgrade_btn.layer.isVisible()) && elements.upgrade_btn.layer.setVisible(true);
                        refeshItemIcon(!lockItemIfNecessary(hero, equip, elements), equip.getId());
                        refeshItemIcon(validateResourceNotEnough(upgradeCost, upgradeBtn, text), equip.getId());
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
                    bindListener(heroData, isFirst);
                }
            }
            function bindListener(hero, isFirst) {
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