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
        for (var i in notices) {
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
        var textLen = notice.content.length * text.fontSize;
        if(textLen > this.listView.width){
            var height = (text.height+2) * Math.ceil(textLen/this.listView.width);
            root.height = height + title.height;
            title.y = height;
            text.setTextAreaSize(cc.size(this.listView.width,height));
        }else{
            text.setTextAreaSize(cc.size(textLen,text.height));
        }
        var titleLen = notice.title.length * title.fontSize;
        if(titleLen > this.listView.width){
            var height = title.height * Math.ceil(titleLen/this.listView.width);
            root.height = height + text.height;
            // title.y = height;
            title.setTextAreaSize(cc.size(this.listView.width,height));
        }else{
            title.setTextAreaSize(cc.size(titleLen,title.height));
        }
        text.setString(notice.content);
        title.setString(notice.title);
        this.listView.setItemsMargin(10);
        this.listView.pushBackCustomItem(root);
    },
    openNoticePopup: function () {
        GamePopup.openPopup(this.noticeLayer,cc.p(340,620),false);
    },
    hiddenNoticePopup: function () {
        GamePopup.closePopup(this.noticeLayer);
    }
});
NoticePanel.open = function (ignoreVersion) {
    var announces = PlayerData.getAnnounces(ignoreVersion);
    if(cc.isArray(announces) && announces.length > 0){
        var noticePanel = new NoticePanel(announces);
        noticePanel.openNoticePopup();
    }
};