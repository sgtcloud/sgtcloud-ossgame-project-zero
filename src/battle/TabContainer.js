/**
 * Created by highkay on 2015/12/29.
 */

var TabContainer = cc.Node.extend({
    ctor: function (battlePanel) {
        this._super();
        this.menuLayer = ccs.csLoader.createNode(res.menu_layer_json);
        this.addChild(this.menuLayer);

        // for measure the container height
        this.height = this.menuLayer.height;
        var root = this.menuLayer.getChildByName('root');
        var menuParams = [
            {name: "main", click: "onMainClick"},
            {name: "hero", click: "onHeroClick"},
            {name: "equip", click: "onEquipClick"},
            {name: "pvp", click: "onPvpClick"},
            {name: "rank", click: "onRankClick"},
            {name: "shop", click: "onShopClick"},
        ];
        this.buttons = {};

        var self = this;
        for (var i in menuParams) {
            var param = menuParams[i];
            var name = param.name;
            var click = param.click;
            this.buttons[name] = root.getChildByName(name);
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

        this.menus = {};
        this.menus.main = new SkillListMenu(battlePanel);
        this.menus.hero = new HeroListMenu(battlePanel);
        this.menus.equip = new EquipListMenu(battlePanel);
        this.menus.shop = new ShopLayerMenu(battlePanel);

        for (var i in this.menus) {
            this.menus[i].setPosition(0, this.menuLayer.height);
            this.menuLayer.addChild(this.menus[i]);
            this.menus[i].setVisible(false);
        }
        this.showMenuLayer = function (name) {
            for (var i in this.buttons) {
                this.buttons[i].setSelected(false);
            }
            for (var i in this.menus) {
                this.menus[i].setVisible(false);
            }
            this.menus[name].setVisible(true);
            this.buttons[name].setSelected(true);
            /*var y=this.buttons[name].getPositionY();
            var goldText = this.menus[name].playerGoldText;
            var position=goldText.getParent().getParent().getPosition();
            cc.log(position);
            cc.log(y)
           var lastPosition=cc.p(position.x,position.y+y);
            customEventHelper.sendEvent(EVENT.GOLD_POSITION, lastPosition)
            cc.log(lastPosition);*/
            //console.log(this.menuButtons);
        };

        //for (var i in this.menuButtons) {
        //	this.menuButtons[i].setEnabled(false);
        //}
        this.updatePlayerGoldText = function () {
            //for (var i in this.menuLayers) {
            //    this.menuLayers[i].updatePlayerGoldText();
            //}
        }
        function bindListener() {
            customEventHelper.bindListener(EVENT.HERO_UPGRADE, function (event) {
                var data = event.getUserData();
                PlayerData.updateResource([data.cost]);
                PlayerData.updatePlayer();
            });
            customEventHelper.bindListener(EVENT.HERO_SKILL_UPGRADE, function (event) {
                var data = event.getUserData();
                PlayerData.updateResource([data.cost]);
                PlayerData.updatePlayer();
            });
            customEventHelper.bindListener(EVENT.GOLD_VALUE_UPDATE,function(){
                customEventHelper.sendEvent(EVENT.HERO_UPGRADE_BTN);
                customEventHelper.sendEvent(EVENT.HERO_SKILL_UPGRADE_BTN);
            })
        }

        bindListener();

    }
});
