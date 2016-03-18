
//公共弹出框1
var Popup = cc.Node.extend({

    ctor: function (title, content,type, _callback) {
        this._super();
        this.prompt1Layer = ccs.csLoader.createNode(res.prompt1_layer_json);
        this.initData(title, content,type, _callback);
    },

    initData: function (title, content,type, _callback) {

        var root = this.prompt1Layer.getChildByName('root');
        root.getChildByName("desc_text").setString(content);
        root.getChildByName("title_text").setString(title);
        var confirmBtn ;
        if(type === Popup.ALERT_TYPE){
            root.getChildByName("two").setVisible(false);
            confirmBtn = root.getChildByName("one").getChildByName("btn");
        }else if(type === Popup.CONFIRM_TYPE){
            root.getChildByName("one").setVisible(false);
            var two = root.getChildByName("two");
            confirmBtn = two.getChildByName("btn_Yes");
            var closeBtn = two.getChildByName('btn_No');
            bindButtonCallback(closeBtn, function () {
                this.hiddenPopup();
                if (typeof _callback === 'function') {
                    _callback(false,this);
                }
            }.bind(this));
        }
        bindButtonCallback(confirmBtn, function () {
            this.hiddenPopup();
            if (typeof _callback === 'function') {
                _callback(true,this);
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
Popup.ALERT_TYPE = 1;
Popup.CONFIRM_TYPE = 2;
Popup.openPopup = function(title, content, _callback){
    var popup = new Popup(title, content,Popup.ALERT_TYPE, _callback);
    popup.openPopup();
}

Popup.alert = function(title, content, _callback){
    var popup = new Popup(title, content,Popup.ALERT_TYPE, _callback);
    popup.openPopup();
};
Popup.confirm = function(title, content, _callback){
    var popup = new Popup(title, content,Popup.CONFIRM_TYPE, _callback);
    popup.openPopup();
};

