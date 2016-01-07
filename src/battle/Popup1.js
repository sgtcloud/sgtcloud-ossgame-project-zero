
//公共弹出框1
var Popup1 = cc.Node.extend({

    ctor: function (title, content, _callback) {
        this._super();
        this.initData(title, content, _callback);
    },

    initData: function (title, content, _callback) {
        var prompt1Layer = ccs.csLoader.createNode(res.prompt1_layer_json);

        var root = prompt1Layer.getChildByName('root');
        root.getChildByName("desc_text").setString(content);
        root.getChildByName("title_text").setString(title);
        root.getChildByName("box").setVisible(false);
        var btn = root.getChildByName("btn").getChildByName("btn");

        bindButtonCallback(btn, function () {
            if (_callback && !_callback(e)) {
                _callback(prompt1Layer);
            }else{
                prompt1Layer.removeFromParent();
            }
        });
        popup(prompt1Layer, 1000);
    },
});

