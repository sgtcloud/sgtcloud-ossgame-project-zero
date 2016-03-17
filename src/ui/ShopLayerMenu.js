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
                    this.showMenuLayer(sender.name);
                }
                else if (type === ccui.CheckBox.EVENT_UNSELECTED) {
                    sender.setSelected(true);
                }
            }.bind(this), this);
        }
        this.showMenuLayer = function (name) {
            for (var i in this.buttons) {
                this.buttons[i].setSelected(false);
            }
            var childrens = shopView.getChildren();
            for (var i in childrens) {
                childrens[i].setVisible(false);
            }
            switch (name) {
                case "shop_tab":
                    this.showPorpView();
                    break;
                case "moneyTree_tab":
                    this.showMoneyTreeView();
                    break;
            }
            this.buttons[name].setSelected(true);
        };
        this.shake = 4000;
        this.last_update = 0;
        this.first_x = this.first_y = this.first_z = this.last_x = this.last_y = this.last_z = 0;
        this.falg = true;

        this.refeshMoneyTreeLayer = function () {
            if (shopView.getChildByName('moneyTree').visible)
                shopView.getChildByName('moneyTree').getChildByName("gold_text").setString(PlayerData.getStageData().getMoneyTreeRatio());
        }

        this.showMoneyTreeView = function () {
            shopView.getChildByName("moneyTree").setVisible(true);
            var showMoneyTree = shopView.getChildByName("moneyTree");
            var diamondText = showMoneyTree.getChildByName("diamond_text");
            var goldText = showMoneyTree.getChildByName("gold_text");
            diamondText.ignoreContentAdaptWithSize(true);
            diamondText.setString(CONSTS.money_tree_one_price);
            goldText.ignoreContentAdaptWithSize(true);
            goldText.setString(PlayerData.getStageData().getMoneyTreeRatio());
            var buyBtn = showMoneyTree.getChildByName("btn").getChildByName("buy_btn");
            buyBtn.addClickEventListener(function () {
                this.buyGold(CONSTS.money_tree_one_price, PlayerData.getStageData().getMoneyTreeRatio(), true);
            }.bind(this));

            if (window.DeviceMotionEvent) {
                window.addEventListener("devicemotion", this.deviceMotionHandler, false);
            } else {
                console.log("本设备不支持devicemotion事件");
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
        };
        this.buyGold = function (gem, gold, flag) {
            var content = '购买成功';
            if (PlayerData.getAmountByUnit("gem") >= gem) {
                var updateRes = [PlayerData.createResourceData("gold", gold)
                    , PlayerData.createResourceData("gem", -gem)];
                PlayerData.updateResource(updateRes);
                customEventHelper.sendEvent(EVENT.UPDATE_RESOURCE, updateRes);
                PlayerData.updatePlayer();
                if (flag) {
                    return;
                }
            } else {
                content = '当前钻石不足';
            }
            Popup.openPopup("友情提示", content, function (popup) {
                popup.hiddenPopup();
                this.falg = true;
            }.bind(this));
        };
        this.showPorpView = function () {
            shopView.getChildByName("shop").setVisible(true);
            var shopPorps = shopView.getChildByName("shop").getChildByName('shopList');
            var shopItemLayer = ccs.csLoader.createNode(res.shop_icon_layer);
            var shopItemLayerRoot = shopItemLayer.getChildByName("root");
            var shopIconLayer = shopItemLayerRoot.getChildByName('itemLayer');
            var shopIconLayerRoot = shopIconLayer.getChildByName('root');
            var shopListView = ccs.csLoader.createNode(res.shop_list_view);
            var shopListViewRoot = shopListView.getChildByName('root');
            var shopListViewRootClone = shopListViewRoot.clone();
            var goods = dataSource.goods;
            var n = n1 = len = 0;
            for (var i in goods) {
                len++;
            }
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
                this.clickBtn(buyBtn, datas);
                itemLayer.setPosition(shopListViewRoot.getChildByName("item" + n1).getPosition());
                shopListViewRootClone.addChild(itemLayer);
                if (n % 3 == 0 || n == len) {
                    n1 = 0;
                    shopPorps.setItemsMargin(10);
                    shopPorps.pushBackCustomItem(shopListViewRootClone);
                    shopListViewRootClone = shopListViewRoot.clone();
                }
            }
        };
        this.clickBtn = function (buyBtn, goods) {
            buyBtn.addClickEventListener(function () {
                this.buyGoods(goods);
            }.bind(this));
        }
        this.buyGoods = function (goods) {
            var price = goods.price;
            if (PlayerData.getAmountByUnit(price.unit) >= price.value) {
                var updateRes = [PlayerData.createResourceData(price.unit, -price.value), PlayerData.createResourceData(goods.propId, goods.num)];
                PlayerData.updateResource(updateRes);
                customEventHelper.sendEvent(EVENT.UPDATE_RESOURCE, updateRes);
                tip.toggle({
                    'beforeShow': [
                        cc.hide(), cc.delayTime(0.1)], 'delay': 2.0,
                    'text': '成功购买 ' + CONSTS.resources_mapping[goods.propId] + " * " + goods.num + ' 花费 ' + CONSTS.resources_mapping[price.unit] + " * " + price.value
                });
                PlayerData.updatePlayer();
            } else {
                if (price.unit === 'gem') {
                    Popup.openPopup("友情提示", "当前钻石不足", function (popup) {
                        popup.hiddenPopup();
                        //进入充值页面。
                    });
                } else if (price.unit === 'gold') {
                    Popup.openPopup("友情提示", "当前金币不足,点击确定进入点金页面", function (popup) {
                        popup.hiddenPopup();
                        this.showMenuLayer("moneyTree_tab");
                    }.bind(this));
                } else {
                    Popup.openPopup("友情提示", "当前该资源不足", function (popup) {
                        popup.hiddenPopup();
                    });
                }
            }
        };
        this.showPorpView();
    }
});