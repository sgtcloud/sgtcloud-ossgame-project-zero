var RechargePanel = cc.Node.extend({
    ctor: function () {
        this._super();
        this.rechargeLayer = ccs.csLoader.createNode(res.recharge_layer_json);
        this.isPaying = false;
        this.initData();
    },
    initData: function () {
        var root = this.rechargeLayer.getChildByName('root');
        //root.setTouchEnabled(false);
        var vipText = root.getChildByName('text');
        this.items = root.getChildByName('box');
        //this.items.setTouchEnabled(false);
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
        var icon = itemRoot.getChildByName('pic');
        icon.loadTexture('res/icon/recharge/'+ i+'.png');
        var day = itemRoot.getChildByName('day');
        var moneyText = itemRoot.getChildByName('money_text');
        var gemText = itemRoot.getChildByName('gem_text');
        var label = itemRoot.getChildByName('label');
        moneyText.setString(chargePoint.money/100);
        label.setVisible(false);
        if(cc.isNumber(chargePoint.firstChargeRewardAmount) &&　chargePoint.firstChargeRewardAmount　> 0){
            label.setVisible(true);
        }
        if(chargePoint.type == 'mCard'){
            gemText.setString(CONSTS.monthCard_daily_bonus.value);
        }else{
            gemText.setString(chargePoint.amount);
            day.setVisible(false);
        }
        itemRoot.setTouchEnabled(false);
        bindTouchEventListener(function(){
            if(!is_weixin()){
                tip.toggle('微信支付仅支持微信客服端中打开');
            }else if(!this.isPaying){
                this.isPaying = true;
                console.log(i+',前往支付');
                Network.chooseWXPay(chargePoint,function(result){
                    if(result){
                        tip.toggle('购买成功');
                    }else{
                        this.isPaying = false;
                    }
                }.bind(this));
            }
        }.bind(this),itemRoot);
    },
    openRechargePopup: function () {
        GamePopup.openPopup(this.rechargeLayer,cc.p(335,580),true);
    },
    hiddenRechargePopup: function () {
        GamePopup.closePopup(this.rechargeLayer);
    }
});
RechargePanel.open = function () {
    var recharge = new RechargePanel();
    recharge.openRechargePopup();
};