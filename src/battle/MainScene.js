var MainScene = cc.Scene.extend({
    onEnter: function () {
        this._super();

        this.battlePanel = new BattlePanel(this);
        this.battlePanel.initBattle(PlayerData.getStageData());
        //tab container
        this.tabContainer = new TabContainer(this.battlePanel);
        this.tabContainer.setPosition(0, 0);
        this.addChild(this.tabContainer, 100);
        this.tabContainer.updatePlayerGoldText();

        //battle panel
        this.battlePanel.setPosition(0, this.tabContainer.height);
        this.addChild(this.battlePanel);

        //top panel
        this.topPanel = new TopPanel(this);
        this.topPanel.setPosition(0, this.tabContainer.height + this.battlePanel.height);
        this.addChild(this.topPanel);
        this.topPanel.refreshAll();

        this.tabContainer.showMenuLayer('main');

        var buffTip = new BuffView(res.buff_tip_json);
        this.buffTip = buffTip;
        this.buffTip.setVisible(false);
        var tipHeight = this.buffTip.height;
        var tipWidth = this.buffTip.width;
        var height = this.height;
        var width = this.width;
        this.buffTip.setPosition((width - tipWidth) / 2, (height - tipHeight) / 2);
        this.addChild(this.buffTip);
        //this.buffLayer=new BuffView(res.buff_layer_json);
        //window.buffLayer=this.buffLayer;
        var buffLayerBaseHeight = this.tabContainer.height + this.tabContainer.menus.main.height;
        var buffHeight = buffLayerBaseHeight;
        var buffLayers = [];
        (function (w) {
            var __toggle_hide = 0;

            function toggleBuffTip() {
                buffTip.setVisible(true);
                clearTimeout(__toggle_hide);
                __toggle_hide = setTimeout(function () {
                    buffTip.setVisible(false);
                }, 5000);
            }

            //var layer = cc.Layer.extend({
            //    ctor: function () {
            //        this._super();
            //    }
            //})

            function toggleBufflayer(time, text, icon) {
                var buffLayer = new BuffLayer();
                var buffLayerHeight = buffLayer.height;
                buffHeight = buffHeight + buffLayerHeight
                console.log("buffLayer.height:   " + buffHeight)
                buffLayer.setPosition((game.width - buffLayer.width) / 2, buffHeight);
                buffLayer.setIcon(icon)
                buffLayer.setText(text);
                buffLayers.push(buffLayer);
                buffLayer.setTime(time + 's');

                game.addChild(buffLayer, 1000);
                //setTimeout(function(){
                //    game.removeChild(buffLayer)
                //    buffHeight=buffHeight - buffLayer.height
                //    console.log("remove buffLayer.height:   " + buffHeight)
                //    for(var i in buffLayers){
                //        var y=buffLayers[i].getPositionY();
                //        if(buffLayer===buffLayers[i]){
                //            buffLayers.splice(i,1);
                //        }
                //        if(buffLayer.getPositionY()<y){
                //            buffLayers[i].setPositionY(y-buffLayerHeight);
                //            console.log('set position-y:'+(y-buffLayerHeight));
                //        }
                //    }
                //    console.log(buffLayers.length);
                //    delete  buffLayer;
                //},2000);
                var remaining = time - 1;
                buffLayer.schedule(function () {
                    if (remaining > 0) {
                        this.setTime(remaining + 's');
                        remaining--;
                    } else {
                        game.removeChild(buffLayer);
                        buffHeight = buffHeight - buffLayer.height
                        for (var i in buffLayers) {
                            var y = buffLayers[i].getPositionY();
                            if (buffLayer === buffLayers[i]) {
                                buffLayers.splice(i, 1);
                            }
                            if (buffLayer.getPositionY() < y) {
                                buffLayers[i].setPositionY(y - buffLayerHeight);
                                console.log('set position-y                         :' + (y - buffLayerHeight));
                            }
                        }
                        this.unschedule(this.__instanceId);
                    }
                }, 1, time, 1, buffLayer.__instanceId);
            }

            w.toggleBuffTip = toggleBuffTip;
            w.toggleBufflayer = toggleBufflayer;
        })(window)
    }
});
