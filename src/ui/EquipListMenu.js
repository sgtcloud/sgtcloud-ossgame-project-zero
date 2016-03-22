/**
 * Created by Maron on 2016/2/29.
 */
var EquipListMenu = ListViewMenu.extend({
    ctor: function (battle) {
        this._super(battle, res.equip_layer_json);
        this._spawnCount = 6;
        this._bufferZone=50;
        this.listView = this.root.getChildByName('equip_list');
        this.heroView = ccs.csLoader.createNode(res.equip_hero_view_json).getChildByName('root');
        this.equipView = ccs.csLoader.createNode(res.equip_view_json).getChildByName('root');
        this.itemView = ccs.csLoader.createNode(res.small_item_layer_json).getChildByName('root');
        var lockBtnLayoutTemplate = this.equipView.getChildByName('lock_btn');
        this._lockBtnPosition = lockBtnLayoutTemplate.getPosition();
        this._lockBtnTemplate = lockBtnLayoutTemplate.getChildByName('btn');
        var equipMaxLevelBtnLayoutTemplate = this.equipView.getChildByName('MaxLevel_btn');
        this._maxLevelBtnTemplate = equipMaxLevelBtnLayoutTemplate.getChildByName('btn');
        this._maxLevelBtnPosition = equipMaxLevelBtnLayoutTemplate.getPosition();
        var upgradeEquipBtn = this.equipView.getChildByName('upgrade_btn');
        this._upgradeBtnTemp = upgradeEquipBtn.getChildByName('btn');
        this._upgradeSkillPosition = upgradeEquipBtn.getPosition();
        this.magicEquipRoot = this.root.getChildByName('title_root');
        this._basic = 3;
        this._nextValue = 0;
        this._difValue = 5;
        this.setListView(this.listView);
        var default_item = new ccui.Layout();
        default_item.setTouchEnabled(true);
        default_item.setContentSize(this.heroView.getContentSize());
        default_item.width = this.listView.width;
        default_item.height = this.equipView.height;
        this.itemModel = default_item;
        this.equipView.setPositionX(this.heroView.width - this.equipView.width);
        this.setItemModel(this.itemModel);
        this._refreshView();
        this.scheduleUpdate();
    }, _refreshView: function () {
        for (var i = 0; i < player.heroes.length; i++) {
            var heroData = PlayerData.getHeroesData(i);
            var isFirst = i === 0;
            if (isFirst) {
                this.buildMagicalEquips(heroData);
            }
            if (heroData.getLv() > 0) {
                this.buildEquipMenuIfUnlocked(heroData, isFirst);
            } else {
                this.bindListener(heroData, isFirst);
            }
        }
    }, randomEquip: function (hero) {
        var equips = hero.getEquips();
        var equipsList = [];
        for (var i in equips) {
            if (equips[i].getLv() === 0) {
                equipsList.push(equips[i]);
            }
        }
        this._nextValue = this._basic + (equips.length - equipsList.length) * this._difValue;
        var bonus = [];
        for (var i in equipsList) {
            var weight = equipsList[i].getType();
            var bo = {};
            bo.w = weight;
            var f = {};
            f.unit = equipsList[i].getNextLevelUpgrade()['unit'];
            f.value = this._nextValue;
            f.equip = equipsList[i];
            bo.f = f;
            bonus.push(bo);
        }
        var chance = new Chance(bonus);
        return chance.next();
    }, refeshMagicalEquips: function (hero, elements) {
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
            this._nextValue = this.nextMagicalValue(hero);
            elements.text_yellow.setString(this._nextValue);
            validateResourceNotEnough({unit: 'relic', value: this._nextValue}, elements.btn, elements.text_yellow);
        }
    }, nextMagicalValue: function (hero) {
        var equips = hero.getEquips();
        var k = 1;
        for (var i in equips) {
            if (equips[i].getLv() > 0 && equips[i].getLv() > 0) {
                k++;
            }
        }
        return this._basic + (k - 1) * this._difValue;
    }, refeshItemIcon: function (flag, id) {
        if (flag) {
            customEventHelper.sendEvent("itemIcon-" + id + "-gray");
        } else {
            customEventHelper.sendEvent("itemIcon-" + id + "-white");
        }
    }, updateResource: function (equip, data, upgradeBtn, text) {
        var cost = equip.getNextLevelUpgrade();
        var unit = data['unit'];
        if (cost['unit'] === unit) {
            this.refeshItemIcon(validateResourceNotEnough(cost, upgradeBtn, text), equip.getId());
        }
    },
    buildMagicalEquips: function (hero) {
        var title = this.magicEquipRoot.getChildByName('title');
        var buy_btn = this.magicEquipRoot.getChildByName('buy_btn')
        var buy_btn_layer = buy_btn.getChildByName('btn')
        var btn = buy_btn_layer.getChildByName('btn');
        var text_yellow = buy_btn_layer.getChildByName('text_yellow');
        var relic_icon = buy_btn_layer.getChildByName('relic_icon');
        var diamond_icon = buy_btn_layer.getChildByName('diamond_icon');
        var decs_text = this.magicEquipRoot.getChildByName('decs_text');
        var equipAll_text = this.magicEquipRoot.getChildByName('equipAll_text');
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
        this. refeshMagicalEquips(hero, elements);
        customEventHelper.bindListener(EVENT.RELIC_VALUE_UPDATE, function () {
            validateResourceNotEnough({unit: 'relic', value: this._nextValue}, btn, text_yellow);
        });
        btn.addClickEventListener(function () {
            var equipObject = this.randomEquip(hero);
            customEventHelper.sendEvent(EVENT.UPDATE_RESOURCE, {unit: equipObject.unit, value: -equipObject.value});
            var price = {value: this._nextValue, unit: equipObject.unit};
            equipObject.equip.upgrade(hero, price);
            PlayerData.refreshAllHerosProps();
            PlayerData.refreshGlobeProps();
            customEventHelper.sendEvent(EVENT.ALL_HERO_REFRESH_PROPS, hero);
            this.pushMagicalEquips(equipObject.equip, hero);
            this.refeshMagicalEquips(hero, elements);
        }.bind(this));
    },
    _buildHeroView: function (rootItem) {
        var root = rootItem.root, hero = rootItem.target, init = false, isFirst = rootItem.first;
        if (typeof root === 'undefined') {
            root = this.heroView.clone();
            rootItem.root = root;
            init = true;
        }
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
            if (init) {
                customEventHelper.bindListener(EVENT.UPGRADE_EQUIP_NUM, function (event) {
                    equipNum_text.setString(event.getUserData());
                });
            }
            equipNum_text.ignoreContentAdaptWithSize(true)
        } else {
            player_equip.setVisible(false);
            hero_equip.setVisible(true);
            if (init) {
                var itemList = hero_equip.getChildByName('itemList');
                for (var i = 0; i < hero.getEquipCount(); i++) {
                    var equip = hero.getEquipData(i);
                    var item = this.itemView.clone();
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
        }
        setFont(name);
        icon.loadTexture("res/icon/heroes/" + hero.getIcon());
        dps_text.setString(parseInt(hero.getLife()));
        if (init) {
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
        }
        name.setString(hero.getName());
        lv.setString("Lv." + hero.getLv() + '/' + hero.getMaxLevel());
        dps_text.ignoreContentAdaptWithSize(true);
        return root;
    },
    _buildEquipView: function (rootItem) {
        var equip = rootItem.target, hero = rootItem.relation, root = rootItem.root, init = false, lockLayer, maxLevel, upgradeLayer;
        if (typeof root === 'undefined') {
            root = this.equipView.clone();
            rootItem.root = root;
            init = true;
            lockLayer = this._lockBtnTemplate.clone();
            lockLayer.setPosition(this._lockBtnPosition);
            lockLayer.setName("lockLayer");
            maxLevel = this._maxLevelBtnTemplate.clone();
            maxLevel.setPosition(this._maxLevelBtnPosition);
            maxLevel.setName("maxLevel");
            var maxBtn = maxLevel.getChildByName('btn');
            maxBtn.setEnabled(false);
            maxBtn.setBright(false);
            upgradeLayer = this._upgradeBtnTemp.clone();
            upgradeLayer.setName("upgradeLayer");
            upgradeLayer.setPosition(this._upgradeSkillPosition);
            root.addChild(lockLayer);
            root.addChild(maxLevel);
            root.addChild(upgradeLayer);
        } else {
            lockLayer = root.getChildByName('lockLayer');
            maxLevel = root.getChildByName('maxLevel');
            upgradeLayer = root.getChildByName('upgradeLayer');
        }
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
            this.refeshItemIcon(validateResourceNotEnough(upgradeCost, upgradeBtn, text), equip.getId());
            if (init) {
                customEventHelper.bindListener(EVENT.GOLD_VALUE_UPDATE, function (event) {
                    this.updateResource(equip, {unit: 'gold'}, upgradeBtn, text);
                }.bind(this));
                customEventHelper.bindListener(EVENT.GEM_VALUE_UPDATE, function (event) {
                    this.updateResource(equip, {unit: 'gem'}, upgradeBtn, text);
                }.bind(this));
                customEventHelper.bindListener(EVENT.RELIC_VALUE_UPDATE, function (event) {
                    this.updateResource(equip, {unit: 'relic'}, upgradeBtn, text);
                }.bind(this));
                customEventHelper.bindListener(EVENT.UPDATE_RESOURCE, function (event) {
                    var nextCost = equip.getNextLevelUpgrade();
                    validateResourceNotEnough(nextCost, upgradeBtn, text);
                });
                customEventHelper.bindListener(EVENT.HERO_UPGRADE, function () {
                    if (equip.getType() === 0 && !equip.isMaxLevel() && canUnlockItem(hero, equip) && elements.lock_btn.layer.isVisible()) {
                        elements.lock_btn.layer.isVisible() && elements.lock_btn.layer.setVisible(false);
                        (!elements.upgrade_btn.layer.isVisible()) && elements.upgrade_btn.layer.setVisible(true);
                        this.refeshItemIcon(!lockItemIfNecessary(hero, equip, elements), equip.getId());
                        this.refeshItemIcon(validateResourceNotEnough(upgradeCost, upgradeBtn, text), equip.getId());
                    }
                }.bind(this));
            }
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
                equip.upgrade(hero);
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
                this.refeshItemIcon(!lockItemIfNecessary(hero, equip, elements), equip.getId());
            }.bind(this));
            this.refeshItemIcon(!lockItemIfNecessary(hero, equip, elements), equip.getId());
        }
        setFont([name, desc])
        return root;
    }, bindListener: function (hero, isFirst) {
        var _hero = hero;
        var first = isFirst;
        var that = this;
        customEventHelper.bindListener(EVENT.HERO_UPGRADE, function (event) {
            var heroId = event.getUserData()['heroId'];
            if (heroId === _hero.getId() && _hero.getLv() === 1) {
                setTimeout(function () {
                    that.pause();
                    that.buildEquipMenuIfUnlocked(_hero, first);
                    //that.updateInnerContainerSize();
                    that.onEnter();
                    that.resume();
                }, 300);
            }
        });
    }, buildEquipMenuIfUnlocked: function (heroData, isFirst) {
        var _heroView = this._buildHeroView(this._filterItem({target: heroData, type: this.HERO_ITEM, first: isFirst}));
        if (this.listView.getItems().length < this._spawnCount) {
            var model = this.itemModel.clone();
            model.setPositionX(_heroView.getPositionX());
            model.height = _heroView.height;
            model.addChild(_heroView);
            model.setTag(this._totalCount);
            this.listView.pushBackCustomItem(model);
        }
        this._totalCount++;
        for (var j = 0; j < heroData.getEquipCount(); j++) {
            var equipData = heroData.getEquipData(j);
            if (equipData.getLv() > 0 || equipData.getType() === 0) {
                var _equipView = this._buildEquipView(this._filterItem({
                    target: equipData,
                    relation: heroData,
                    type: equipData.getType() === 0 ? this.EQUIP_NORMAL_ITEM : this.EQUIP_MAGIC_ITEM
                }));
                if (this.listView.getItems().length < this._spawnCount) {
                    var model = this.itemModel.clone();
                    model.setPositionX(_equipView.getPositionX());
                    model.height = _equipView.height;
                    model.addChild(_equipView);
                    model.setTag(this._totalCount);
                    this.listView.pushBackCustomItem(model);
                }
                this._totalCount++;
            }
        }
    }, _filterItem: function (data) {
        var item = this.items.filter(function (i) {
            return i['target'].getId() === data.target.getId();
        });
        if (item.length === 0) {
            item.push(data);
            Array.prototype.push.apply(this.items, item);
        }
        return item[0];
    }, pushMagicalEquips: function (equipData, heroData) {
        this.pause();
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
        var item = this.items.filter(function (i) {
            return i['target'].getId() === equipData.getId();
        });
        if (item.length === 0) {
            var obj = {target: equipData, relation: heroData, type: this.EQUIP_MAGIC_ITEM};
            item.push(obj);
            this.items.splice(index, 0, obj);
        }
        if (typeof  item['index'] === 'undefined') {
            item[0]['index'] = index;
        }
        var _equipView = this._buildEquipView(item[0]);
        var model = this.itemModel.clone();
        model.setPositionX(_equipView.getPositionX());
        model.height = _equipView.height;
        model.addChild(_equipView);
        model.setTag(this._totalCount);
        this.listView.insertCustomItem(model, index);
        this._totalCount++;
        if (this._spawnCount < this._totalCount) {
            this.listView.removeLastItem();
        }
        var items = this.listView.getItems();
        var totalHeight = this._itemTemplateHeight * this._totalCount;
        for (var k in items) {
            var ite = items[k];
            ite.setPositionY(totalHeight - k * ite.height);
            this.updateItem(k, ite);
        }
        if(!totalHeight<this.listView.height){
            this.listView.setTouchEnabled(true);
        }
        this.onEnter();
        this.resume();
    }, updateItem: function (itemId, item) {
        var itemData = this.items[itemId >= this.items.length ? this.items.length - 1 : itemId];
        var ite = itemData['root'];
        item.setTag(itemId);
        item.removeAllChildren(true);
        item.height = ite.height;
        var pare = ite.getParent();
        if (pare)
            pare.removeAllChildren(true);
        item.addChild(ite);
        if (itemData['type'] === this.HERO_ITEM) {
            this._buildHeroView(itemData);
        } else if (itemData['type'] === this.EQUIP_NORMAL_ITEM || itemData['type'] === this.EQUIP_MAGIC_ITEM) {
            this._buildEquipView(itemData);
        }
    }
});