/**
 * Created by peisy on 2016/03/07.
 */
var MailPanel = cc.Node.extend({
    ctor: function () {
        this._super();
        this.mailLayer = ccs.csLoader.createNode(res.mail_layer_json);
        this.mailView = ccs.csLoader.createNode(res.mail_view_json);
        this.mailViewRoot = this.mailView.getChildByName('root');
        this.initData();
    },
    initData: function () {
        var root = this.mailLayer.getChildByName('root');
        this.listView = root.getChildByName('list');
        var deleteBtn = root.getChildByName('delete_btn').getChildByName('btn');
        var getBtn = root.getChildByName('get_btn').getChildByName('btn');
        var closeBtn = root.getChildByName('close_btn').getChildByName('root').getChildByName('close');
        this.num = root.getChildByName('num');
        //未领取邮件数
        this.attachNoPickNum = 0;
        //可以删除邮件数组
        this.attachPicks = [];
        this.listView.removeAllChildren();
        for (var i = PlayerData.mails.readedMails.length - 1; i >= 0; i--) {
            this.setElement(PlayerData.mails.readedMails[i]);
        }
        this.setNum();
        bindButtonCallback(deleteBtn, function () {
            //this.deleteAllMails();
            Network.deleteAllMails(this);
        }.bind(this));
        bindButtonCallback(getBtn, function () {
            this.attachAllNoPick();
        }.bind(this));
        bindButtonCallback(closeBtn, function () {
            this.hiddenMailPopup();
        }.bind(this));
    },
    setElement: function (mail) {
        var mailViewRootClone = this.mailViewRoot.clone();
        var titleText = mailViewRootClone.getChildByName('text');
        var desc_text = mailViewRootClone.getChildByName('desc_text');
        var time = mailViewRootClone.getChildByName('time');
        var reward_text = mailViewRootClone.getChildByName('reward_text');
        var btn = mailViewRootClone.getChildByName('btn');
        btn.getChildByName('look').setVisible(false);
        desc_text.setString(mail.content);
        titleText.setString(mail.title || mail.fromName);
        time.setString(this.formatTime(mail.sendTime));
        setFont([titleText,desc_text]);
        time.setFontName("Microsoft YaHei UI");
        time.setColor(TIPS_COLOR.GREEN);
        if (cc.isString(mail.attachment) && mail.attachment.length > 0) {
            var rewards = eval('('+mail.attachment+')');
            var rewardText = /*this.formatAttachment*/formatResourceToString(rewards);
            reward_text.setString(rewardText);
            var btnText = btn.getChildByName('get');
            var getRewardBtn = btn.getChildByName('btn');
            if (mail.attachStatus == 1) {
                this.attachPicks.push(mail.id);
                getRewardBtn.setEnabled(false);
                getRewardBtn.setBright(false);
                getRewardBtn.setColor(cc.color(90, 90, 90));
                btnText.setColor(cc.color(90, 90, 90));
            } else {
                this.attachNoPickNum++;
                //this.attachNoPicks.push(mail.id);
                this.addBtnClickEventListener(getRewardBtn,btnText, mail, rewards, rewardText);
            }
        } else {
            this.attachPicks.push(mail.id);
            btn.setVisible(false);
            reward_text.setVisible(false);
        }
        this.listView.pushBackCustomItem(mailViewRootClone);
    },
    formatTime: function(time){
        if(!time){
            return "未知";
        }else{
            var tempTime = (PlayerData.getServerTime() - time)/1000;
            if(tempTime < 10){
                return "刚刚";
            }else if(tempTime < 60){
                return Math.ceil(tempTime)+"秒前";
            }else if(tempTime < 60 * 60){
                return Math.ceil(tempTime/60)+"分钟前";
            }else {
                var date = new Date();
                date.setTime(time);
                return date.Format("yyyy-MM-dd hh:mm:ss");
            }
        }
    },
    addBtnClickEventListener: function (btn,btnText, mail, rewards, descText) {
        btn.addClickEventListener(function () {
            Network.pickAttachment(btn,btnText, mail, rewards, descText,this);
        }.bind(this));
    },
    setNum: function () {
        this.num.setString(this.attachNoPickNum + "/" + PlayerData.mails.readedMails.length);
    },
    attachAllNoPick: function () {
        if (this.attachNoPickNum > 0) {
            this.attachments = {};
            for (var i in PlayerData.mails.readedMails) {
                var mail = PlayerData.mails.readedMails[i];
                if (cc.isString(mail.attachment) && mail.attachment.length > 0 && mail.attachStatus == 0) {
                    Network.readAndPickAttachment(mail,this);
                }
            }
        }
    },
    openMailPopup: function () {
        GamePopup.openPopup(this.mailLayer, null/*cc.p(335, 585)*/,false);
    },
    hiddenMailPopup: function () {
        GamePopup.closePopup(this.mailLayer);
    }
});
MailPanel.open = function () {
    Network.updateunReadMailStatus(function (result) {
        if (result) {
            var mailUnit = new MailPanel();
            mailUnit.openMailPopup();
        }
    })
};