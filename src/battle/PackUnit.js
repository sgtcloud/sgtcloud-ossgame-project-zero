/**
 * Created by highkay on 2015/12/29.
 */
var PackUnit = cc.Node.extend({
    ctor: function () {
        this._super();
        this.packLayer = ccs.csLoader.createNode(res.pack_layer_json);
        this.root = this.packLayer.getChildByName('root');
        this.pack = this.root.getChildByName('pack');
        this.chest = this.root.getChildByName('chest');
        var self = this;
        var packs = ["wood",
            "leather",
            "stone",
            "bronze",
            "iron",
            "crystal",
            "rune",
            "essence"];
        var chestsAndKeys = ["iron_chest",
            "iron_key",
            "silver_chest",
            "silver_key",
            "golden_chest",
            "golden_key"];

        this.setElement = function (unit, value, parent) {
            var element = parent.getChildByName(unit + "_num_text");
            element.ignoreContentAdaptWithSize(true);
            element.setString(value);
        };
        this.refreshAll = function () {
            for (var i in packs) {
                this.setElement(packs[i], player.resource[packs[i]], this.pack);
            }
            for (var i in chestsAndKeys) {
                this.setElement(chestsAndKeys[i], player.resource[chestsAndKeys[i]], this.chest);
            }
        };
        var golden_chest_btn = this.chest.getChildByName('golden_chest_btn');
        var silver_chest_btn = this.chest.getChildByName('silver_chest_btn');
        var iron_chest_btn = this.chest.getChildByName('iron_chest_btn');

        this.checkKeyAndChest = function (key, chest) {
            if (key > 0 && chest > 0) {
                //开箱成功
                return true;
            } else {
                var errorContent = '';
                if (key <= 0) {
                    errorContent += "钥匙不足,";
                }
                if (chest <= 0) {
                    errorContent += "箱子不足,";
                }
                new Popup1("友情提示", errorContent + "前往商城购买", function (popup) {
                    popup.hiddenPopup();
                    self.removeFromParent();
                    game.tabContainer.showMenuLayer('shop');
                });
            }
        };
        this.openChest = function (key_unit, chest_unit, bonus_num) {
            if (this.checkKeyAndChest(player.resource[key_unit], player.resource[chest_unit])) {
                var chance = new Chance(dataSource.bonus[bonus_num].bonus);
                var loot = chance.next();
                player.resource[loot.unit] += loot.value;
                player.resource[key_unit] -= 1;
                player.resource[chest_unit] -= 1;
                this.setElement(loot.unit, player.resource[loot.unit], this.pack);
                this.setElement(key_unit, player.resource[key_unit], this.chest);
                this.setElement(chest_unit, player.resource[chest_unit], this.chest);
                PlayerData.updatePlayer();
                toggleTip({'delay':2.0,'text':'恭喜获得： '+CONSTS.resources_mapping[loot.unit]+" * "+loot.value});
                return true;
            }
        };
        golden_chest_btn.addClickEventListener(function () {
            self.openChest("golden_key", "golden_chest", "c1003")
        });
        silver_chest_btn.addClickEventListener(function () {
            self.openChest("silver_key", "silver_chest", "c1002")
        });
        iron_chest_btn.addClickEventListener(function () {
            self.openChest("iron_key", "iron_chest", "c1001")
        });
        customEventHelper.bindListener(EVENT.PACK_VALUE_UPDATE, function () {
            this.refreshAll();
        }.bind(this));
        this.refreshAll();
        this.addChild(this.packLayer);
    }
});