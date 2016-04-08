/**
 * Created by highkay on 2015/12/29.
 */
var NoticePanel = cc.Node.extend({
    ctor: function (notices) {
        this._super();
        this.noticeLayer = ccs.csLoader.createNode(res.notice_layer_json);
        this.noticeView = ccs.csLoader.createNode(res.notice_view_json);
        this.noticeViewRoot = this.noticeView.getChildByName('root');
        this.initData(notices);
    },
    initData: function (notices) {
        var root = this.noticeLayer.getChildByName('root');

        this.listView = root.getChildByName('list');
        var closeBtn = root.getChildByName('close_btn').getChildByName('root').getChildByName('close');
        this.listView.removeAllChildren();
        for (var i = notices.length - 1; i >= 0; i--) {
            this.setElement(notices[i]);
        }
        bindButtonCallback(closeBtn, function () {
            this.hiddenNoticePopup();
        }.bind(this));
    },
    setElement: function (notice) {
        var root = this.noticeViewRoot.clone();
        var title = root.getChildByName("title");
        var text = root.getChildByName("text");
        setFont([title,text]);
        var textLen = notice.text.length * text.fontSize;
        if(textLen > this.listView.width){
            var height = text.height * Math.ceil(textLen/this.listView.width);
            root.height = height + title.height;
            title.y = height;
            text.setTextAreaSize(cc.size(this.listView.width,height));
        }
        var titleLen = notice.title.length * title.fontSize;
        if(titleLen > this.listView.width){
            var height = title.height * Math.ceil(titleLen/this.listView.width);
            root.height = height + text.height;
            // title.y = height;
            title.setTextAreaSize(cc.size(this.listView.width,height));
        }
        text.setString(notice.text);
        title.setString(notice.title);
        this.listView.setItemsMargin(10);
        this.listView.pushBackCustomItem(root);
    },
    openNoticePopup: function () {
        GamePopup.openPopup(this.noticeLayer,cc.p(330,620),false);
    },
    hiddenNoticePopup: function () {
        GamePopup.closePopup(this.noticeLayer);
    }
});
NoticePanel.open = function () {
    //Network.updateunReadMailStatus(function (result) {
    //    if (result) {
            var noticePanel = new NoticePanel([{"title":"公告1标题公告1标题公告1标题公告1标题公告1标题公告1标题公告1标题公告1标题公告1标题公告1标题公告1标题公告1标题公告1标题公告1标题公告1标题","text":"公告1内容公告1内容公告1内容公告1内容公告1内容公告1内容"},{"title":"公告2标题公告2标题公告2标题公告2标题公告2标题公告2标题公告2标题公告2标题公告2标题公告2标题公告2标题公告2标题公告2标题公告2标题公告2标题公告2标题公告2标题公告2标题公告2标题公告2标题公告2标题公告2标题","text":"公告内容2公告内容2公告内容2公告内容2公告内容2公告内容2公告内容2公告内容2公告内容2公告内容2公告内容2公告内容2公告内容2"}]);
            noticePanel.openNoticePopup();
    //    }
    //})
};