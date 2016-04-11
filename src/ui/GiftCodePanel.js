/**
 * Created by peisy on 2016/03/23.
 */
var GiftCodePanel = cc.Node.extend({
    ctor: function () {
        this._super();
        this.giftCodeLayer = ccs.csLoader.createNode(res.gift_code_layer_json);
        var root = this.giftCodeLayer.getChildByName('root');
        root.setPosition(cc.p(0,360));
        var close = root.getChildByName('close').getChildByName('root').getChildByName('close');
        var getBtn = root.getChildByName('get_btn').getChildByName('btn');

        bindButtonCallback(close, function () {
            GamePopup.closePopup(this.giftCodeLayer);
        }.bind(this));
        bindButtonCallback(getBtn, function () {
            var text = root.getChildByName('text').getString();
            if(text){
                Network.redeemAndGetReward(text);
            }else{
                BasicPopup.alert('提示','请正确输入兑换码');
            }
        }.bind(this));
    },
    openGiftCodePanel: function(){
        GamePopup.openPopup(this.giftCodeLayer);
    }
});
GiftCodePanel.open = function(){
    var giftCodePanel = new GiftCodePanel();
    giftCodePanel.openGiftCodePanel();
};