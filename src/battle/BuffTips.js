/**
 * Created by Maron on 2016/1/21.
 */
var BuffView = cc.Node.extend({
    ctor: function () {
        this._super();
        var buff = ccs.csLoader.createNode(res.tips);
        buff.setVisible(true);
        this.width = buff.width;
        this.height = buff.height;
        this.text=buff.getChildByName('root').getChildByName('text');
        this.text.setFontName('微软雅黑');
        this.addChild(buff);
        cc.eventManager.pauseTarget(this,true);
    },
    setString:function(text){
        this.text.setString(text);
    }
});

var BuffList = cc.Class.extend({
    ctor: function () {
        this.root = ccs.csLoader.createNode(res.buff_list_json);
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
        this.text.setFontName("微软雅黑");
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