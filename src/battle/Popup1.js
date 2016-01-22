
//公共弹出框1
var Popup1 = cc.Node.extend({

    ctor: function (title, content, _callback) {
        this._super();
        this.prompt1Layer = ccs.csLoader.createNode(res.prompt1_layer_json);
        this.gamePopup = new GamePopup(this.prompt1Layer);
        this.initData(title, content, _callback);
    },

    initData: function (title, content, _callback) {

        var root = this.prompt1Layer.getChildByName('root');
        root.getChildByName("desc_text").setString(content);
        root.getChildByName("title_text").setString(title);
        root.getChildByName("box").setVisible(false);
        var btn = root.getChildByName("btn").getChildByName("btn");

        var self = this;
        bindButtonCallback(btn, function () {
            if (typeof _callback === 'function') {
                _callback(self);
            }else{
                self.hiddenPopup();
            }
        });
        this.openPopup();
    },
    openPopup: function(){
        popup(this.gamePopup, 4000);
        //this.gamePopup.popup();
    },
    hiddenPopup: function(){
        this.prompt1Layer.removeFromParent();
        this.gamePopup.hidden();
    }
});

