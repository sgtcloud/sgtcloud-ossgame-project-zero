/**
 * 竞技场面板
 * Created by maron on 2016/3/7.
 */
var ArenaPanel=cc.Node.extend({
    ctor:function(){
        this._super();
        this.panel=cc.csLoader.createNode(res.pvp_layer_json).getChildByName('root');
        this.changeLayer=this.panel.getChildByName('change_btn');
        this.changeBtn=this.changeLayer.getChildByName('change');
        this.changeText=this.changeLayer.getChildByName('change_text');
        this.buyLayer=this.panel.getChildByName('buy_btn');
        this.buyBtn=this.buyLayer.getChildByName('buy');
        this.buyText=this.buyLayer.getChildByName('buy_text');
        this.recordLayer=this.panel.getChildByName('record_btn');
        this.recordBtn=this.buyLayer.getChildByName('record');
        this.recordText=this.buyLayer.getChildByName('record_text');
        this.surplusText=this.panel.getChildByName('surplus_text');//剩余次数
        this.surplusNum=this.panel.getChildByName('surplus_num');//剩余次数
        this.opponentBox=this.panel.getChildByName('opponent_box');//挑战者列表
        setFont(this.changeText,this.buyText,this.recordText,this.surplusNum,this.surplusText);
        setColor(this.changeText,this.buyText,this.recordText,this.surplusNum,this.surplusText);
    }
});