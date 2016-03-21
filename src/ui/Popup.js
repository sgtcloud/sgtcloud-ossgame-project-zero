
//公共弹出框
var Popup = cc.Node.extend({

    ctor: function (file,title, content,type, _callback) {
        this._super();
        this.promptLayer = ccs.csLoader.createNode(file);
        this.initData(title, content,type, _callback);
    },

    initData: function (title, content,type, _callback) {
        this.root = this.promptLayer.getChildByName('root');
        this.root.getChildByName("desc_text").setString(content);
        this.root.getChildByName("title_text").setString(title);
        var confirmBtn ;
        if(type === Popup.ALERT_TYPE){
            this.root.getChildByName("two").setVisible(false);
            confirmBtn = this.root.getChildByName("one").getChildByName("btn");
        }else if(type === Popup.CONFIRM_TYPE){
            this.root.getChildByName("one").setVisible(false);
            var two = this.root.getChildByName("two");
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
        GamePopup.openPopup(this.promptLayer);
    },
    hiddenPopup: function(){
        GamePopup.closePopup(this.promptLayer);
    }
});
Popup.ALERT_TYPE = 1;
Popup.CONFIRM_TYPE = 2;

var BasicPopup = Popup.extend({
    ctor: function (title, content,type, _callback) {
        this._super(res.prompt1_layer_json,title, content,type, _callback);
    }
});

BasicPopup.alert = function(title, content, _callback){
    var popup = new BasicPopup(title, content,Popup.ALERT_TYPE, _callback);
    popup.openPopup();
};
BasicPopup.confirm = function(title, content, _callback){
    var popup = new BasicPopup(title, content,Popup.CONFIRM_TYPE, _callback);
    popup.openPopup();
};

var ComplexPopup = Popup.extend({
    ctor: function (title, content,type,resources, _callback) {
        this._super(res.prompt2_layer_json,title, content,type, _callback);
        this.promptIcon = ccs.csLoader.createNode(res.prompt_icon_json);
        this.promptIconRoot = this.promptIcon.getChildByName('root');
        this.box = this.root.getChildByName('box');
        this._addResources(resources);
    },
    _addResources: function(resources){
        if (!resources) {
            return;
        }
        var arrs = this._countPosition(this.promptIconRoot.width, this.promptIconRoot.height, this.box.width, this.box.height, resources.length);
        for (var i = 0; i < resources.length; i++) {
            var rootClone = this.promptIconRoot.clone();
            this._setSingleResource(rootClone,resources[i]);
            rootClone.setPosition(arrs[i]);
            this.box.addChild(rootClone);
        }
    },
    _setSingleResource: function(rootClone,resource){
        var icon = rootClone.getChildByName('key');
        var text = rootClone.getChildByName('text');
        icon.loadTexture('res/icon/resources_small/'+resource["unit"]+".png");
        setIgnoreContentAdaptWithSize(text);
        text.setString(resource["value"]);
    },
    _countPosition: function(width,height,totol_width,totol_height,len){
        var arrs = new Array();
        if(len < 4){
            var h = (totol_height-height*len)/(len+1);
            for(var i = 0 ; i < len;i++){
                var x = (totol_width-width)/2;
                var y = height*(len-1-i)+h*(len-i);
                arrs.push(cc.p(x,y));
            }
        }else{
            var w = 0;
            var r= Math.ceil(len/2);
            var h = (totol_height-height*r)/(r+1);
            var ww = (totol_width-width * 2)/3;
            for(var i = 0 ; i < len;i++){
                if(i % 2 != 0){
                    w = 2*ww+width;
                }else{
                    w = ww;
                    if(i>1)
                        r--;
                }
                var x = w;
                var y = height*(r-1)+h*r;
                arrs.push(cc.p(x,y));
            }
        }
        return arrs;
    }

});

ComplexPopup.alert = function(title, content, _callback){
    var popup = new ComplexPopup(title, content,Popup.ALERT_TYPE, _callback);
    popup.openPopup();
};
ComplexPopup.confirm = function(title, content, _callback){
    var popup = new ComplexPopup(title, content,Popup.CONFIRM_TYPE, _callback);
    popup.openPopup();
};
/*Popup.openPopup = function(title, content, _callback){
    var popup = new Popup(title, content,Popup.ALERT_TYPE, _callback);
    popup.openPopup();
}*/



