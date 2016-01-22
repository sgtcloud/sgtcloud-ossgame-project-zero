/**
 * Created by highkay on 2015/12/29.
 */
var PackUnit = cc.Node.extend({
    ctor: function () {
        this._super();
        this.packLayer = ccs.csLoader.createNode(res.pack_layer_json);
        this.root = this.packLayer.getChildByName('root');
        var pack = this.root.getChildByName('pack');
        var chest = this.root.getChildByName('chest');

        var packs = ["wood",
            "leather",
            "stone",
            "bronze",
            "iron",
            "crystal",
            "rune",
            "essence"];
        var chestsAndKeys = ["iron_chest",
            "iron_key",
            "silver_chest",
            "silver_key",
            "golden_chest",
            "golden_key"];
        for(var i in packs){
            var element = this.pack.getChildByName(packs[i]+"_num_text");
            element.ignoreContentAdaptWithSize(true);
            element.setString(player.resource[packs[i]]);
        }
        for(var i in chestsAndKeys){
            var element = this.chest.getChildByName(packs[i]+"_num_text");
            element.ignoreContentAdaptWithSize(true);
            element.setString(player.resource[packs[i]]);
        }
        var golden_chest_btn = this.chest.getChildByName('golden_chest_btn');
        var silver_chest_btn = this.chest.getChildByName('silver_chest_btn');
        var iron_chest_btn = this.chest.getChildByName('iron_chest_btn');

        this.checkKeyAndChest = function(key,chest){
            if(key > 0 && chest > 0){
                //开箱成功
                return true;
            }else{
                var errorContent = '';
                if(key <= 0){
                    errorContent += "钥匙不足";
                }
                if(chest <= 0){
                    errorContent += "箱子不足";
                }
                new Popup1("友情提示",errorContent,function(popup){
                    popup.hidden();
                });
            }
        };
        this.openChest = function(key,chest){
            if(this.checkKeyAndChest(key,chest)){
                //
            }
        };
        golden_chest_btn.addClickEventListener(function(){
            this.openChest();
        });
        silver_chest_btn.addClickEventListener(function(){
            this.openChest();
        });
        iron_chest_btn.addClickEventListener(function(){
            this.openChest();
        });
        this.addChild(this.packLayer);
    }
});