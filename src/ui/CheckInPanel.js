/**
 * Created by peisy on 2016/03/01.
 */
var CheckInPanel = cc.Node.extend({
    ctor: function () {
        this._super();
        this.signLayer = ccs.csLoader.createNode(res.sign_layer);
        this.signIcon = ccs.csLoader.createNode(res.sign_icon);
        this.signView = ccs.csLoader.createNode(res.sign_view);
        this.signLayer.setName('checkInPanel');
    },
    initDate: function (rewards, accumulateCount) {
        if (!rewards) {
            return;
        }
        var signIconRoot = this.signIcon.getChildByName('root');
        var signViewRoot = this.signView.getChildByName('root');
        var listView = this.signLayer.getChildByName('root').getChildByName('list');
        var signViewRootClone = signViewRoot.clone();
        var n = n1 = len = 0;
        rewards = JSON.parse(rewards);
        for (var i in rewards) {
            len++;
        }
        listView.removeAllChildren(true);
        for (var i in rewards) {
            n++;
            var data = rewards[i];

            var iconLayer = signIconRoot.clone();

            var icon = iconLayer.getChildByName("icon");
            icon.loadTexture("res/icon/resources/" + data.icon);
            var image2 = iconLayer.getChildByName("frame");
            var image3 = iconLayer.getChildByName("stamp");
            var num = iconLayer.getChildByName("num");
            num.ignoreContentAdaptWithSize(true);
            num.setString((cc.isArray(data.bonus) && data.bonus.length > 1) ? 1 : data.bonus[0]['value']);
            if (accumulateCount < n) {
                image3.setVisible(false);

            }
            if (accumulateCount + 1 == n) {
                image2.setVisible(true);
                icon.setTouchEnabled(true);
                this.addIconClickEventListener(icon, image2, image3, data);
            } else {
                icon.setColor(cc.color(90, 90, 90));
                image2.setVisible(false);
            }

            iconLayer.setPosition(signViewRoot.getChildByName("icon" + n1).getPosition());
            iconLayer.setName('checkInItem');
            signViewRootClone.addChild(iconLayer);
            n1++;
            if (n % 5 == 0 || n == len) {
                n1 = 0;
                listView.setItemsMargin(20);
                listView.pushBackCustomItem(signViewRootClone);
                signViewRootClone = signViewRoot.clone();
            }
        }
        //this.signLayer.setPosition(cc.p(20, 240));
        //this.addChild(this.signLayer);
    },
    addIconClickEventListener: function (icon, image2, image3, data) {
        icon.addClickEventListener(function () {
            Network.checkin(icon, image2, image3, data.bonus,this.signLayer);
        }.bind(this));
    },
    openCheckInPopup: function(){
        GamePopup.openPopup(this.signLayer);
    }
});
CheckInPanel.open = function(data3, data2){
    var checkInUnit = new CheckInPanel();
    checkInUnit.initDate(data3, data2);
    checkInUnit.openCheckInPopup();
}