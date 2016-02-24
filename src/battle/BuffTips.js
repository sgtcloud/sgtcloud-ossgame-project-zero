/**
 * Created by Maron on 2016/1/21.
 */
var Tip = cc.Layer.extend({
    ctor: function (scenen, zIndex) {
        this._super();
        this.tip = tipTemplate.clone();
        this.tip.setVisible(true);
        this.text = this.tip/*.getChildByName('root')*/.getChildByName('text');
        this.text.setFontName('Microsoft YaHei UI');
        this.text.setColor(TIPS_COLOR.YELLOW);
        this.addChild(this.tip);
        cc.eventManager.pauseTarget(this, true);
        this.setVisible(false);
        var tipHeight = this.tip.height;
        var tipWidth = this.tip.width;
        var size = cc.winSize;
        var height = size.height;
        var width = size.width;
        this.setPosition((width - tipWidth) / 2, (height - tipHeight) / 2);
        scenen.addChild(this, zIndex || 102);
    },
    setString: function (text) {
        this.text.setString(text);
    },
    /**
     * 显示/隐藏 tip,默认显示3秒后隐藏
     *
     * @param {Object||String} config   {beforeShow:Function,afterShow:Function,afterHide:Function,delay:3.0,color:cc.color('#cccccc')}
     */
    toggle: function (config) {
        this.stopAllActions();
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
                color && this.text.setColor(color);
            } else if (typeof config === 'string') {
                text = config;
            }
        }
        text && this.text.setString(text);
        var sequence = [];
        var dt = cc.delayTime(delay);
        this._processSequence(sequence, beforeShow);
        sequence.push(fadein);
        this._processSequence(sequence, afterShow);
        sequence.push(dt);
        this._processSequence(sequence, beforeHide);
        sequence.push(fadeout);
        this._processSequence(sequence, afterHide);
        var sq = cc.sequence(sequence);
        this.runAction(sq);
    }, _processSequence: function (sequence, actions) {
        if (actions) {
            if (typeof  actions === 'function') {
                sequence.push(actions);
            } else if (actions instanceof Array) {
                Array.prototype.push.apply(sequence, actions)
            }
        }
    }
});
var BuffLayer = cc.Class.extend({
    ctor: function () {
        //this._super();
        var buffLayer = ccs.csLoader.createNode(res.buff_layer_json);
        this.root = buffLayer.getChildByName('root').clone();
        this.root.setTouchEnabled(false);
        this.icon = this.root.getChildByName('icon');
        this.text = this.root.getChildByName('text');
        this.time = this.root.getChildByName('time');
        this.width = buffLayer.width;
        this.height = buffLayer.height;
        this.text.setFontName("Microsoft YaHei");
        this.time.setColor(cc.color(255, 0, 0));
        this.text.setFontSize(9);
    },
    setPosition: function (x, y) {
        this.root.setPosition(x, y);
    },
    setPositionY: function (y) {
        this.root.setPositionY(y);
    },
    getPositionY: function () {
        return this.root.getPositionY();
    },
    setIcon: function (path) {
        this.icon.loadTexture('res/icon/skills/' + path)
    },
    setText: function (text) {
        this.text.setString(text);
    },
    setTime: function (time) {
        this.time.setString(time);
    }
});