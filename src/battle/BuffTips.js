/**
 * Created by Administrator on 2016/1/21.
 */

//var BuffTip = cc.Node.extend({
//    ctor: function () {
//        this._super();
//        var buffTip = ccs.csLoader.createNode(res.buff_tip_json);
//        buffTip.setVisible(true);
//        this.width = buffTip.width;
//        this.height = buffTip.height;
//        this.addChild(buffTip);
//    }
//});
var BuffView = cc.Node.extend({
    ctor: function () {
        this._super();
        var buff = ccs.csLoader.createNode(res.tips);
        buff.setVisible(true);
        this.width = buff.width;
        this.height = buff.height;
        this.text=buff.getChildByName('root').getChildByName('text');
        //this.text.setFontName('Helvetica');
        this.text.setFontName('微软雅黑');
        /*
        var children = buff.getChildren();
        for (var i in children) {
            children[i].setTouchEnabled && children[i].setTouchEnabled(false);
        }*/
        //this.text.setString('立法扩大解放了的喀什房价来说的咖啡的喀什房间里的喀什飞机拉萨的空间分达拉斯加拉塞克飞机拉萨看解放拉萨的飞机拉萨分开就');
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