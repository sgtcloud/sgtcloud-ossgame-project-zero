/**
 * Created by highkay on 2015/12/29.
 */
var OfflineRewardPanel = cc.Node.extend({
    ctor: function (btn) {
        this._super();
        this.offlineRewardLayer = ccs.csLoader.createNode(res.offline_reward_layer);

        var offlineRewardLayerRoot = this.offlineRewardLayer.getChildByName('root');
        var offlineRewardLayerBtn = offlineRewardLayerRoot.getChildByName('btn').getChildByName('offline_btn');

        var offlineRewardLayerBox = offlineRewardLayerRoot.getChildByName('box');
        var rewards = player.not_get_reward;

        offlineRewardLayerBox.getChildByName("key_text").setString(0);
        offlineRewardLayerBox.getChildByName("gem_text").setString(0);
        offlineRewardLayerBox.getChildByName("gold_text").setString(0);

        for (var key in rewards) {
            var tempKey = key;
            if (key.indexOf("key") != -1) {
                var icon = offlineRewardLayerBox.getChildByName("key");
                icon.loadTexture("res/icon/resources_small/" + tempKey + ".png");
                key = "key";
            }
            var offlineRewardLayerText = offlineRewardLayerBox.getChildByName(key + '_text');
            offlineRewardLayerText.ignoreContentAdaptWithSize(true);
            console.log("offlineReward:" + rewards[tempKey]);
            offlineRewardLayerText.setString(rewards[tempKey]);
        }
        bindButtonCallback(offlineRewardLayerBtn, function () {
            btn.visible = false;
            GamePopup.closePopup(this.offlineRewardLayer);
            PlayerData.receiveOfflineReward();
            PlayerData.updatePlayer();
        }.bind(this));
        //this.addChild(this.offlineRewardLayer);
    },
    openOfflineRewardPopup: function(){
        GamePopup.openPopup(this.offlineRewardLayer);
    }
});
OfflineRewardPanel.open = function(rewardBtn){
    var offline = new OfflineRewardPanel(rewardBtn);
    offline.openOfflineRewardPopup();
};