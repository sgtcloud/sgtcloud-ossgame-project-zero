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
        this.addChild(this.buffTip,102);
        var buffListNode = ccs.csLoader.createNode(res.buff_list_json);
        buffListNode.setPosition(this.battlePanel.buffList.getPosition());
        //buffListNode.setPosition((width-buffListNode.width)/2,(height-buffListNode.width)/2);
        this.battlePanel.addChild(buffListNode, 5000);
        var buffList = buffListNode.getChildByName('buff_list');
        buffList.setTouchEnabled(false);
        (function (w) {
            /**
             * 显示/隐藏 tip,默认显示3秒后隐藏
             *
             * @param {Object||String} config   {beforeShow:Function,afterShow:Function,afterHide:Function,delay:3.0,color:cc.color('#cccccc')}
             */
            function toggleTip(config) {
                var fadein = cc.show()/*cc.fadeIn(0.0)*/;
                var fadeout = cc.hide()/* cc.fadeOut(0.0)*/;
                var beforeShow, afterHide, afterShow, delay = 3.0, beforeHide, text;
                if (config) {
                    if (cc.isObject(config)) {
                        beforeShow = config['beforeShow'];
                        beforeHide = config['beforeHide'];
                        afterShow = config['afterShow'];
                        afterHide = config['afterHide'];
                        text = config['text'];
                        delay = config['delay'] || 3.0;
                        var color = config['color'];
                        color && buffTip.text.setColor(color);
                    } else if (typeof config === 'string') {
                        text = config;
                    }
                }
                text && buffTip.setString(text);
                var sequence = [];
                var dt = cc.delayTime(delay);
                beforeShow(sequence) && sequence.push(fadein);
                sequence.push(fadein);
                afterShow && sequence.push(afterShow);
                sequence.push(dt);
                beforeHide && sequence.push(beforeHide);
                sequence.push(fadeout);
                afterHide && sequence.push(afterHide)
                var sq = cc.sequence(sequence);
                buffTip.stopAllActions();
                buffTip.runAction(sq);
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

            function toggleBufflayer(time, text, icon, cb) {
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
                        if (typeof cb === 'function')cb();
                        this.cleanup();
                    }
                }, 1, time, 1, buffLayer.root.__instanceId);
            }

            w.toggleTip = toggleTip;
            w.toggleBufflayer = toggleBufflayer;
        })(window);
    },

    onEnter: function () {
        this._super();
        customEventHelper.sendEvent(EVENT.UPGRADE_HERO_ATTACK);
    }
});
