var HeroDescScene = cc.Scene.extend({

    onEnter: function (hero,skills) {
        this.heroDesc = new HeroDesc(hero,skills);
        this.heroDesc.setPosition(0, 0);
        this.addChild(this.heroDesc);
    }
});
var HeroDesc = cc.Node.extend({

    ctor: function (hero,skills) {
        this._super();
        this.heroDesc = ccs.csLoader.createNode(res.hero_desc_json);
        this.initData(hero,skills);
    },

    initData: function (hero,skills) {

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
        popup(this.gamePopup, 1000);
        this.gamePopup.popup();
    },
    hiddenPopup: function(){
        this.prompt1Layer.removeFromParent();
        this.gamePopup.hidden();
    }
});

