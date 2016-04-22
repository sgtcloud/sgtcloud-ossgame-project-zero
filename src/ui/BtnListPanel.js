/**
 * Created by peisy on 2016/04/21.
 */
var BtnListPanel = cc.Class.extend({
    ctor: function (topPanel) {
        this.btnListLayer = ccs.csLoader.createNode(res.function_list_layer);
        this.ready = true;
        this.root = this.btnListLayer.getChildByName('root');
        this.root.setPosition(cc.p(640,10));
        this.firstRechargeBtn = this.root.getChildByName('firstRecharge_btn');
        if (cc.isNumber(player.vip) || player.vip < 2 || player.first_recharge_status != 2) {
            bindButtonCallback(this.firstRechargeBtn, function () {
                FirstRechargePanel.open(this.firstRechargeBtn);
            }.bind(this));
        } else {
            this.firstRechargeBtn.setVisible(false);
        }
        this.noticeBtn = this.root.getChildByName('notice_btn');
        bindButtonCallback(this.noticeBtn, function () {
            NoticePanel.open(true);
        }.bind(this));

        this.giftCodeBtn = this.root.getChildByName('giftCode_btn');
        bindButtonCallback(this.giftCodeBtn, function () {
            GiftCodePanel.open();
        }.bind(this));
        this.pack_btn = this.root.getChildByName('pack_btn');
        bindButtonCallback(this.pack_btn, function () {
            PackUnit.open();
        }.bind(this));

        this.mail_btn = this.root.getChildByName('maill_btn');
        bindButtonCallback(this.mail_btn, function () {
            MailPanel.open();
        }.bind(this));

        this.sign_btn = this.root.getChildByName('sign_btn');
        bindButtonCallback(this.sign_btn, function () {
            //验证角色签到数据，未签到则直接打开签到面板
            Network.checkIn_createByValidate(function (result) {
                //true 可以签到 false 不能签到
                Network.openCheckInPanel(result);
            });
        }.bind(this));
        topPanel.addChild(this.btnListLayer);
    },
    show: function(){
        var moveTo = cc.moveTo(0.5,cc.p(this.root.getPositionX()-this.root.width-50,this.root.getPositionY()));
        this.play(moveTo);
    },
    hide: function(){
        var moveTo = cc.moveTo(0.5,cc.p(this.root.getPositionX()+this.root.width+50,this.root.getPositionY()));
        this.play(moveTo);
    },
    play: function(moveTo){
        if(this.ready){
            this.ready = false;
            this.root.runAction(cc.sequence(moveTo,cc.callFunc(function () {
                this.ready = true;
            }.bind(this), this)));
        }
    }
});