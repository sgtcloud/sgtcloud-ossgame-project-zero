var RechargePanel = cc.Node.extend({
    ctor: function () {
        this._super();
        this.rechargeLayer = ccs.csLoader.createNode(res.recharge_layer_json);
        this.initData();
    },
    initData: function () {
        var root = this.rechargeLayer.getChildByName('root');
        var vipText = root.getChildByName('text');
        this.items = root.getChildByName('box');
        var closeBtn = root.getChildByName('close_btn').getChildByName('root').getChildByName('close');
        vipText.setString('敬请期待');
        for (var i = 0; i <CONSTS.chargePoints.length; i++) {
            this.setElement(CONSTS.chargePoints[i],i);
        }
        bindButtonCallback(closeBtn, function () {
            this.hiddenRechargePopup();
        }.bind(this));
    },
    setElement: function (chargePoint,i) {
        var itemRoot = this.items.getChildByName('item'+(i+1)).getChildByName('root');
        bindTouchEventListener(function(){
            console.log('前往支付');
            NetWork.chooseWXPay('购买钻石',1,10,function(){
                tip.toggle('购买成功');
            });
        },itemRoot);
        var icon = itemRoot.getChildByName('pic');
        icon.loadTexture('res/'+ i+'.png');
        var day = itemRoot.getChildByName('day');
        var moneyText = itemRoot.getChildByName('money_text');
        var gemText = itemRoot.getChildByName('gem_text');
        moneyText.setString(chargePoint.money);
        gemText.setString(chargePoint.amount);
        if(i > 0){
            day.setVisible(false);
        }
    },
    openRechargePopup: function () {
        GamePopup.openPopup(this.rechargeLayer, cc.p(330, 680),false);
    },
    hiddenRechargePopup: function () {
        GamePopup.closePopup(this.rechargeLayer);
    }
});
RechargePanel.open = function () {
    var recharge = new RechargePanel();
    recharge.openRechargePopup();
};