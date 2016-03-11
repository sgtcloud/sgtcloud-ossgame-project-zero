var MailPanel = cc.Node.extend({
    ctor: function () {
        this._super();
        this.mailLayer = ccs.csLoader.createNode(res.maill_layer_json);
        this.mailView = ccs.csLoader.createNode(res.maill_view_json);
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
            NetWork.deleteAllMails(this);
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
        var btn = mailViewRootClone.getChildByName('btn');
        btn.getChildByName('look').setVisible(false);

        titleText.setString(mail.title || mail.fromName);
        setFont(titleText);
        if (cc.isString(mail.attachment) && mail.attachment.length > 0) {
            var rewards = JSON.parse(mail.attachment);
            var descText = this.formatAttachment(rewards);
            desc_text.setString(descText);
            desc_text.setColor(TIPS_COLOR.YELLOW);
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
                this.addBtnClickEventListener(getRewardBtn,btnText, mail, rewards, descText);
            }
        } else {
            this.attachPicks.push(mail.id);
            btn.setVisible(false);
            desc_text.setVisible(false);
        }
        this.listView.pushBackCustomItem(mailViewRootClone);
    },
    addBtnClickEventListener: function (btn,btnText, mail, rewards, descText) {
        btn.addClickEventListener(function () {
            NetWork.pickAttachment(btn,btnText, mail, rewards, descText,this);
        }.bind(this));
    },
    setNum: function () {
        this.num.setString(this.attachNoPickNum + "/" + PlayerData.mails.readedMails.length);
    },
    formatAttachment: function (rewards) {
        if (!rewards) {
            return '';
        }
        var descText = "";
        if (rewards instanceof Array) {
            if (rewards.length > 0) {
                for (var i = 0; i < rewards.length; i++) {
                    descText += CONSTS.resources_mapping[rewards[i]['unit']] + " * " + rewards[i]['value'] + ",";
                }
                descText = descText.substr(0, descText.length - 1);
            } else {
                return "";
            }
        } else {
            descText = CONSTS.resources_mapping[rewards[i]['unit']] + " * " + rewards[i]['value'];
        }
        return descText;
    },
    attachAllNoPick: function () {
        if (this.attachNoPickNum > 0) {
            this.attachments = {};
            for (var i in PlayerData.mails.readedMails) {
                var mail = PlayerData.mails.readedMails[i];
                if (cc.isString(mail.attachment) && mail.attachment.length > 0 && mail.attachStatus == 0) {
                    NetWork.readAndPickAttachment(mail,this);
                }
            }
        }
    },
    openMailPopup: function () {
        GamePopup.openPopup(this.mailLayer, cc.p(330, 680),false);
    },
    hiddenMailPopup: function () {
        GamePopup.closePopup(this.mailLayer);
    }
});
MailPanel.open = function () {
    NetWork.updateunReadMailStatus(function (result) {
        if (result) {
            var mailUnit = new MailPanel();
            mailUnit.openMailPopup();
        }
    })
};