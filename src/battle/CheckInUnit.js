/**
 * Created by peisy on 2016/03/01.
 */
var CheckInUnit = cc.Node.extend({
    ctor: function () {
        this._super();
        this.signLayer = ccs.csLoader.createNode(res.sign_layer);
        this.signIcon = ccs.csLoader.createNode(res.sign_icon);
        this.signView = ccs.csLoader.createNode(res.sign_view);
    },
    initDate: function(rewards,accumulateCount) {
        if(!rewards){
            return ;
        }
        var signIconRoot = this.signIcon.getChildByName('root');
        var signViewRoot = this.signView.getChildByName('root');
        var  listView = this.signLayer.getChildByName('root').getChildByName('list');
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

            var icon = iconLayer.getChildByName("icon")
            icon.loadTexture("res/icon/resources_small/" + data.icon);
            var image3 = iconLayer.getChildByName("Image_3");
            var num = iconLayer.getChildByName("BitmapFontLabel_1");
            num.ignoreContentAdaptWithSize(true);
            num.setString((cc.isArray(data.bonus) && data.bonus.length > 1)?1:data.bonus[0]['value']);
            if(accumulateCount < n){
                image3.setVisible(false);
            }else{
                icon.setColor(cc.color(90, 90, 90));
            }
            if(accumulateCount+1 == n){
                icon.setTouchEnabled(true);
                icon.addClickEventListener(function () {
                    this.checkin(image3,data.bonus);
                }.bind(this));
            }

            iconLayer.setPosition(signViewRoot.getChildByName("icon" + n1).getPosition());
            signViewRootClone.addChild(iconLayer);
            n1++;
            if (n % 5 == 0 || n == len) {
                n1 = 0;
                listView.setItemsMargin(20);
                listView.pushBackCustomItem(signViewRootClone);
                signViewRootClone = signViewRoot.clone();
            }
        }
        this.signLayer.setPosition(cc.p(20,240));
        this.addChild(this.signLayer);
    },
    checkin: function(image3,bonus){
        //sgt.CheckinBoardService.validateCheckin(player.id,'h5game',function(result1,data1) {
            //true 可以签到 false 不能签到
            //if (result1 && data1) {
                sgt.CheckinBoardService.checkin(player.id, 'h5game', function (result, data) {
                    if (result) {
                        image3.setVisible(true);
                        tip.toggle('签到成功');
                        GamePopup.closePopup(this.signLayer);
                        PlayerData.updateResource();
                        PlayerData.updatePlayer(bonus);
                    } else {
                        console.log("签到失败");
                    }
                }.bind(this));
            //}else{
            //    tip.toggle('今天已签到');
            //}
        //});
    }
});
CheckInUnit.createByValidate = function(){
    //sgt.CheckinBoardService.validateCheckin(player.id,'h5game',function(result1,data1){
    //    //true 可以签到 false 不能签到
    //    if(result1 && data1){
            //获取累计签到次数
            sgt.CheckinBoardService.accumulateCount(player.id,'h5game',function(result2,data2){
                if(result2){
                    sgt.CheckinBoardService.getRewardByCheckinBoardId('h5game',function(result3,data3){
                        if(result3){
                            var checkInUnit = new CheckInUnit();
                            checkInUnit.initDate(data3,data2);
                            GamePopup.openPopup(checkInUnit);
                        }else{
                            console.error('sgt.CheckinBoardService.getRewardByCheckinBoardId:'+data3);
                        }
                    });
                }else{
                    console.error('sgt.CheckinBoardService.accumulateCount:'+data2);
                }
            })
    //    }else{
    //        console.log('已签到');
    //    }
    //});
};