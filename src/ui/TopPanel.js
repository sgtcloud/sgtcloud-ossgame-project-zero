/**
 * Created by highkay on 2015/12/29.
 */
var TopPanel = cc.Node.extend({

    ctor: function () {
        this._super();

        // load ccui gui
        var layer = ccs.csLoader.createNode(res.title_layer_json);
        this.addChild(layer);

        var root = layer.getChildByName('root');
        var playerIcon = root.getChildByName("player");
        var statisticsBtn = root.getChildByName("statistics_btn");
        //var airingText = root.getChildByName("airing_text");
        var functionListBtn = root.getChildByName("functionList_btn");
        functionListBtn.setLocalZOrder(1);
        playerIcon.loadTexture("res/icon/heroes/"+PlayerData.getHeroes()[0].getIcon(), ccui.Widget.LOCAL_TEXTURE);
        var btnList = new BtnListPanel(root);
        var isBtnListShow = false;
        var pane = root.getChildByName('box');
        var self = this;

        var diamondNum = pane.getChildByName('diamond_text');
        var relicNum = pane.getChildByName('relic_text');
        var goldNum = pane.getChildByName('gold_text');
        var goldBtn = pane.getChildByName('getGold_btn');
        var getDiamondBtn = pane.getChildByName('getDiamond_btn');
        bindButtonCallback(goldBtn, function () {
            game.tabContainer.showMenuLayer("shop");
            game.tabContainer.menus.shop.showMenuLayer('moneyTree_tab');
        });
        bindButtonCallback(getDiamondBtn, function () {
            RechargePanel.open();
        });
        bindButtonCallback(statisticsBtn, function () {
            StatisticsPanel.open();
        });
        bindButtonCallback(functionListBtn, function () {
            if (isBtnListShow) {
                if(this.timeOut){
                    clearTimeout(this.timeOut);
                }
                this.hideBtnList();
            } else {
                this.showBtnList();
                this.timeOut = setTimeout(this.hideBtnList.bind(this),5*1000);
            }
        }.bind(this));
        this.showBtnList = function(){
            functionListBtn.setHighlighted(true);
            btnList.show();
            isBtnListShow = true;

        };
        this.hideBtnList = function(){
            functionListBtn.setHighlighted(false);
            btnList.hide();
            isBtnListShow = false;
        };

        Loot.prototype.getGoldPosition = function () {
            return goldNum.convertToWorldSpace(goldNum.getPosition());
        };
        Loot.prototype.getDiamondPosition = function () {
            return diamondNum.convertToWorldSpace(diamondNum.getPosition());
        };
        Loot.prototype.getRelicPosition = function () {
            return relicNum.convertToWorldSpace(relicNum.getPosition());
        };

        customEventHelper.bindListener(EVENT.FIGHT_ARENA_BATTLE, function () {
            setEnableds([functionListBtn,statisticsBtn,getDiamondBtn,goldBtn], false);
            if (isBtnListShow) {
                this.hideBtnList();
            }
        }.bind(this));

        customEventHelper.bindListener(EVENT.LOSE_ARENA_BATTLE, function(){
            setEnableds([functionListBtn,statisticsBtn,getDiamondBtn,goldBtn], true);
        });
        customEventHelper.bindListener(EVENT.WIN_ARENA_BATTLE, function(){
            setEnableds([functionListBtn,statisticsBtn,getDiamondBtn,goldBtn], true);
        });
        customEventHelper.bindListener(EVENT.UPDATE_RESOURCE, function (data) {
            var resources = data.getUserData();
            if (!resources) {
                return;
            }
            if (resources instanceof Array) {
                for (var i = 0; i < resources.length; i++) {
                    this.sendEventByUnit(resources[i]);
                }
            } else {
                this.sendEventByUnit(resources);
            }
        }.bind(this));


        this.sendEventByUnit = function (resources) {
            switch (resources.unit) {
                case 'gold':
                    this.refreshPlayerGoldText();
                    customEventHelper.sendEvent(EVENT.GOLD_VALUE_UPDATE);
                    break;
                case 'gem':
                    this.refreshPlayerGemText();
                    customEventHelper.sendEvent(EVENT.GEM_VALUE_UPDATE);
                    break;
                case 'relic':
                    this.refreshPlayerRelicText();
                    customEventHelper.sendEvent(EVENT.RELIC_VALUE_UPDATE);
                    break;
                default:
                    customEventHelper.sendEvent(EVENT.PACK_VALUE_UPDATE);
            }
        };
        var scale1 = diamondNum.scale;
        this.refreshPlayerGemText = function () {
            var num = PlayerData.getAmountByUnit("gem");
            diamondNum.setString(num);
            diamondNum.runAction(cc.sequence(cc.scaleTo(0.1, 1.2*scale1), cc.scaleTo(0.1, scale1)));
        };
        var scale2 = relicNum.scale;
        this.refreshPlayerRelicText = function () {
            var num = PlayerData.getAmountByUnit("relic");
            relicNum.setString(num);
            relicNum.runAction(cc.sequence(cc.scaleTo(0.1, 1.2*scale2), cc.scaleTo(0.1, scale2)));
        };
        var scale3 = goldNum.scale;
        this.refreshPlayerGoldText = function () {
            var num = PlayerData.getAmountByUnit("gold");
            goldNum.setString(num);
            goldNum.runAction(cc.sequence(cc.scaleTo(0.1, 1.2*scale3), cc.scaleTo(0.1, scale3)));
        };
        this.refreshPlayerKeyText = function () {
            //player.key
        };

        this.refreshAll = function () {
            this.refreshPlayerGemText();
            this.refreshPlayerRelicText();
            this.refreshPlayerGoldText();
            this.refreshPlayerKeyText();
        };
    }
});
