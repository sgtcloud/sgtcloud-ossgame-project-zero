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
        title.setString(notice.title);
        text.setString(notice.text);
        setFont([title,text]);
        text.width = (notice.text.length * text.fontSize);
        this.listView.pushBackCustomItem(root);
    },
    openNoticePopup: function () {
        GamePopup.openPopup(this.noticeLayer);
    },
    hiddenNoticePopup: function () {
        GamePopup.closePopup(this.noticeLayer);
    }
});
NoticePanel.open = function () {
    //Network.updateunReadMailStatus(function (result) {
    //    if (result) {
            var noticePanel = new NoticePanel([{"title":"公告1标题","text":"公告1内容公告1内容公告1内容公告1内容公告1内容公告1内容"},{"title":"公告2标题","text":"公告内容2公告内容2公告内容2公告内容2公告内容2公告内容2公告内容2公告内容2公告内容2公告内容2公告内容2公告内容2公告内容2"}]);
            noticePanel.openNoticePopup();
    //    }
    //})
};