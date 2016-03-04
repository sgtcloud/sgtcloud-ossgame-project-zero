/**
 * Created by highkay on 2015/12/29.
 */
var MailUnit = cc.Node.extend({
    ctor: function () {
        this._super();
        this.mailLayer = ccs.csLoader.createNode(res.maill_layer_json);
        this.mailView = ccs.csLoader.createNode(res.maill_view_json);
        this.mailViewRoot = this.mailView.getChildByName('root');
        this.initData();
        //this.mailLayer.setPosition(cc.p(20, 155));
        //this.addChild(this.mailLayer);
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
            this.deleteAllMails();
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
            this.pickAttachment(btn,btnText, mail, rewards, descText);
        }.bind(this));
    },
    pickAttachment: function (btn,btnText, mail, rewards, descText) {
        sgt.MailService.readAndPickAttachment(mail.id, function (result) {
            if (result) {
                tip.toggle('成功领取：' + descText);
                this.attachNoPickNum--;
                //移除已领取的mailId
                //this.attachNoPicks.splice(this.attachNoPicks.indexOf(mail.id),1);
                this.setNum();
                btn.setEnabled(false);
                btn.setBright(false);
                btn.setColor(cc.color(90, 90, 90));
                btnText.setColor(cc.color(90, 90, 90));
                mail['attachStatus'] = sgt.Mail.STATUS_ATTACH_PICKED;
                PlayerData.updateResource(rewards);
                customEventHelper.sendEvent(EVENT.UPDATE_RESOURCE, rewards);
                PlayerData.updatePlayer();
            }
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
            for (var i in PlayerData.mails.readedMails) {
                var mail = PlayerData.mails.readedMails[i];
                if (cc.isString(mail.attachment) && mail.attachment.length > 0 && mail.attachStatus == 0) {
                    this.readAndPickAttachment(mail);
                }
            }
        }
    },
    readAndPickAttachment: function (mail) {
        var rewards = JSON.parse(mail.attachment);
        var descText = this.formatAttachment(rewards);
        tip.toggle({'beforeShow':[cc.hide(),cc.delayTime(0.02)]
            ,'delay':2.0,'text':'成功领取：' + descText});
        sgt.MailService.readAndPickAttachment(mail.id, function (result) {
            if (result) {
                this.setNum();
                mail['attachStatus'] = sgt.Mail.STATUS_ATTACH_PICKED;
                PlayerData.updateResource(rewards);
                customEventHelper.sendEvent(EVENT.UPDATE_RESOURCE, rewards);
                PlayerData.updatePlayer();
                this.attachNoPickNum--;
                if (this.attachNoPickNum == 0) {
                    this.initData();
                }
            }
        }.bind(this));
    },
    deleteAllMails: function () {
        if (this.attachPicks.length > 0) {

            var tempArray = PlayerData.mails.readedMails;

            for (var i = 0; i < PlayerData.mails.readedMails.length; i++) {
                var mail = PlayerData.mails.readedMails[i];
                if (!mail.attachment || mail.attachStatus == 1) {
                    PlayerData.mails.readedMails.splice(i, 1);
                    i--;
                }
            }
            sgt.MailService.deleteMail(this.attachPicks, function (result) {
                if (result) {
                    console.log('删除成功');
                    this.initData();
                } else {
                    console.log('%c删除失败', 'color:red');
                    PlayerData.mails.readedMails = tempArray;
                }
            }.bind(this));
        }
    },
    openMailPopup: function () {
        GamePopup.openPopup(this.mailLayer, cc.p(340, 680));
    },
    hiddenMailPopup: function () {
        GamePopup.closePopup(this.mailLayer);
    }
});
MailUnit.updateunReadMailStatus = function (callback) {
    var unReadMailIds = [];
    var temp = PlayerData.mails.unreadMails;
    if (PlayerData.mails.unreadMails.length > 0) {
        for (var i in PlayerData.mails.unreadMails) {
            unReadMailIds.push(PlayerData.mails.unreadMails[i]['id']);
            PlayerData.mails.unreadMails[i]['status'] = sgt.Mail.READ;
        }
        sgt.MailService.readMail(unReadMailIds, function (result) {
            if (result) {
                PlayerData.mails.readedMails = PlayerData.mails.readedMails.concat(PlayerData.mails.unreadMails);
                PlayerData.mails.unreadMails = [];
                console.log('批量阅读邮件');
            } else {
                console.log('%c批量阅读邮件失败', 'color:red');
                PlayerData.mails.unreadMails = temp;
            }
            return callback(result);
        });
    } else {
        return callback(true);
    }
};
MailUnit.open = function () {
    MailUnit.updateunReadMailStatus(function (result) {
        if (result) {
            var mailUnit = new MailUnit();
            mailUnit.openMailPopup();
        }
    })

};
MailUnit.getReadedAndUnreadedMails = function () {
    sgt.MailService.getReadedAndUnreadedMails(player.id, function (result, data) {
        if (result && cc.isObject(data)) {
            PlayerData.mails = data;
            //PlayerData.updateMails(data.unreadMails.concat(data.readedMails));
        }
    })
};
MailUnit.updatePlayerMails = function (timestramp) {
    syncTime(function () {
        timestramp = PlayerData.serverCurrentTime - timestramp;
        sgt.MailService.receiveUnread(timestramp, player.id, function (result, data) {
            if (result && cc.isArray(data) && data.length > 0) {
                PlayerData.mails.unreadMails = PlayerData.mails.unreadMails.concat(data);
            }
        })
    });
};