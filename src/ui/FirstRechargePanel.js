/**
 * Created by peisy on 2016/03/23.
 */
var FirstRechargePanel = cc.Node.extend({
    ctor: function (firstRechargeBtn) {
        this._super();
        this.firstRechargeLayer = ccs.csLoader.createNode(res.first_recharge_layer_json);
        var root = this.firstRechargeLayer.getChildByName('root');
        root.setPosition(cc.p(0,360));
        var close = root.getChildByName('close').getChildByName('root').getChildByName('close');
        var btn = root.getChildByName('btn');
        var buy_btn = btn.getChildByName('buy_btn');
        var buy_to = btn.getChildByName('buy_go');
        var buy_get = btn.getChildByName('buy_get');
        if(player.first_recharge_status == 0){
            buy_to.setVisible(true);
            buy_get.setVisible(false);
        }else if(player.first_recharge_status == 1){
            buy_to.setVisible(false);
            buy_get.setVisible(true);
        }
        bindButtonCallback(close, function () {
            GamePopup.closePopup(this.firstRechargeLayer);
        }.bind(this));
        bindButtonCallback(buy_btn, function () {
            if(player.first_recharge_status == 1){
                player.first_recharge_status = 2;
                firstRechargeBtn.visible = false;
                GamePopup.closePopup(this.firstRechargeLayer);
                PlayerData.updateResource(CONSTS.first_recharge_bonus);
                customEventHelper.sendEvent(EVENT.UPDATE_RESOURCE,CONSTS.first_recharge_bonus);
                PlayerData.isUpdate = true;
                Network.updatePlayerSave();
            }else{
                GamePopup.closePopup(this.firstRechargeLayer);
                RechargePanel.open();
            }
        }.bind(this));
    },
    openFirstRechargePanel: function(){
        GamePopup.openPopup(this.firstRechargeLayer);
    }
});
FirstRechargePanel.open = function(btn){
    var firstRechargePanel = new FirstRechargePanel(btn);
    firstRechargePanel.openFirstRechargePanel();
};