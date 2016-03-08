/**
 * 竞技场面板
 * Created by maron on 2016/3/7.
 */
var ArenaPanel=cc.Node.extend({
    ctor:function(){
        this._super();
        this.panel=cc.csLoader.createNode(res.pvp_layer_json).getChildByName('root');
        this.changeLayer=this.panel.getChildByName('');
    }
});