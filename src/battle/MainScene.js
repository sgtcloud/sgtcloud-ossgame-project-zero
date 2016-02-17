var MainScene = cc.Scene.extend({

    ctor: function () {
        this._super();

        // init the widgets and layout them

        this.battlePanel = new BattlePanel(this);
        //tab container in the bottom
        this.tabContainer = new TabContainer(this.battlePanel);
        this.tabContainer.setPosition(0, 0);
        this.addChild(this.tabContainer, 100);

        //battle panel in the middle
        this.battlePanel.setPosition(0, this.tabContainer.height);
        this.addChild(this.battlePanel);

        //top panel on the top
        this.topPanel = new TopPanel(this);
        this.topPanel.setPosition(0, this.tabContainer.height + this.battlePanel.height);
        this.addChild(this.topPanel);
        this.topPanel.refreshAll();

        this.tabContainer.showMenuLayer('main');

        // floating buff tips on the top of tab container
        var buffTip = new BuffView(res.buff_tip_json);
        this.buffTip = buffTip;
        this.buffTip.setVisible(false);
        var tipHeight = this.buffTip.height;
        var tipWidth = this.buffTip.width;
        var height = this.height;
        var width = this.width;
        this.buffTip.setPosition((width - tipWidth) / 2, (height - tipHeight) / 2);
        this.addChild(this.buffTip);
        var buffListNode = ccs.csLoader.createNode(res.buff_list_json);
        buffListNode.setPosition(this.battlePanel.buffList.getPosition());
        //buffListNode.setPosition((width-buffListNode.width)/2,(height-buffListNode.width)/2);
        this.battlePanel.addChild(buffListNode, 5000);
        var buffList = buffListNode.getChildByName('buff_list');
        (function (w) {
            var fadein = cc.fadeIn(1.0);
            var fadeout = cc.fadeOut(1.0);
            var dt = cc.delayTime(3);
            var sq = cc.sequence(fadein, dt, fadeout);
            var __toggle_hide = 0;
            //buffTip.setVisible(true);
            function toggleBuffTip(f) {
                if (f) {
                    buffTip.runAction(sq);
                } else {
                    buffTip.setVisible(true);
                    clearTimeout(__toggle_hide);
                    __toggle_hide = setTimeout(function () {
                        buffTip.setVisible(false);
                    }, 3000);
                }
            }

            var buffArr = [];
            function refeshBuffLayer() {
                buffList.removeAllChildren(false);
                for (var i = 0; i < buffArr.length; i++) {
                    var buff = buffArr[i];
                    var height = buff.height;
                    buff.setPositionY(height * i);
                    buffList.addChild(buff);
                }
            }

            function toggleBufflayer(time, text, icon,cb) {
                var buffLayer = new BuffLayer();
                buffLayer.setIcon(icon);
                buffLayer.setText(text);
                buffLayer.setTime(time);
                buffArr.push(buffLayer.root);
                //buffList.addChild(buffLayer.root);
                //buffList.jumpToBottom();
                refeshBuffLayer();
                var remaining = time - 1;
                customEventHelper.sendEvent(EVENT.UPGRADE_HERO_ATTACK);
                buffLayer.root.schedule(function () {
                    if (remaining > 0) {
                        buffLayer.setTime(remaining);
                        remaining--;
                    } else {
                        var index = this.getPositionY() / this.height;
                        buffArr.splice(index, 1);
                        refeshBuffLayer();
                        this.unschedule(this.__instanceId);
                        customEventHelper.sendEvent(EVENT.UPGRADE_HERO_ATTACK);
                        if(typeof cb==='function')cb();
                        this.cleanup();
                    }
                }, 1, time, 1, buffLayer.root.__instanceId);
            }

            w.toggleBuffTip = toggleBuffTip;
            w.toggleBufflayer = toggleBufflayer;
        })(window);
    },

    onEnter: function () {
        this._super();
        customEventHelper.sendEvent(EVENT.UPGRADE_HERO_ATTACK);
    }
});
