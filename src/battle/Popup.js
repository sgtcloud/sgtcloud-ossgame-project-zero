
//公共弹出框1
var Popup = cc.Node.extend({

    ctor: function (title, content, _callback) {
        this._super();
        this.prompt1Layer = ccs.csLoader.createNode(res.prompt1_layer_json);
        this.initData(title, content, _callback);
    },

    initData: function (title, content, _callback) {

        var root = this.prompt1Layer.getChildByName('root');
        root.getChildByName("desc_text").setString(content);
        root.getChildByName("title_text").setString(title);
        root.getChildByName("box").setVisible(false);
        var btn = root.getChildByName("btn").getChildByName("btn");

        bindButtonCallback(btn, function () {
            if (typeof _callback === 'function') {
                _callback(this);
            }else{
                this.hiddenPopup();
            }
        }.bind(this));
    },
    openPopup: function(){
        GamePopup.openPopup(this.prompt1Layer);
    },
    hiddenPopup: function(){
        GamePopup.closePopup(this.prompt1Layer);
    }
});

Popup.openPopup = function(title, content, _callback){
    var popup = new Popup(title, content, _callback);
    popup.openPopup();
}

