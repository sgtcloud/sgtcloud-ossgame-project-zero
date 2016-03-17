/**
 * 竞技场面板
 * Created by maron on 2016/3/7.
 */
var ArenaPanel = BattleMenu.extend({
    ctor: function (tabPanel) {
        this._super(tabPanel, res.pvp_layer_json);
        this.panel = this.root;//cc.csLoader.createNode(res.pvp_layer_json).getChildByName('root');
        this.changeLayer = this.panel.getChildByName('change_btn');
        this.changeBtn = this.changeLayer.getChildByName('change');
        this.changeText = this.changeLayer.getChildByName('change_text');
        this.buyLayer = this.panel.getChildByName('buy_btn');
        this.buyBtn = this.buyLayer.getChildByName('buy');
        this.buyText = this.buyLayer.getChildByName('buy_text');
        this.recordLayer = this.panel.getChildByName('record_btn');
        this.recordBtn = this.buyLayer.getChildByName('record');
        this.recordText = this.buyLayer.getChildByName('record_text');
        this.surplusText = this.panel.getChildByName('surplus_text');//剩余次数
        this.surplusNum = this.panel.getChildByName('surplus_num');//剩余次数
        this.opponentBox = this.panel.getChildByName('opponent_box');//挑战者列表
        //setFont(this.changeText,this.buyText,this.recordText,this.surplusNum,this.surplusText);
        //setColor(this.changeText,this.buyText,this.recordText,this.surplusNum,this.surplusText);
        this._arenakey='test-arena';
        this.pullData();
    }, pushItem: function () {

    }, pullData: function () {
        this._arenaService = sgt.getCustomService('arena', ["getPlayersByIndex", "addToEnd", "exchangeIndex", "checkInArena"]);
        this._arenaService.addToEnd(this._arenakey, player.id, function (result, data) {
            console.log(data);
            if (result) {
                var items;
                if (data < 5) {
                    items=this._indexInner5(data);
                } else if (data <= 30) {
                    items=this._indexInner30(data);
                } else {
                    items=this._indexOuter30(data);
                }
                this._arenaService.getPlayersByIndex(items,this._arenakey,function(){

                }.bind(this));
            }
        }.bind(this));
    }, _indexInner5: function (index) {
        console.log('player index:[' + index + '] inner 5');
        var items = [];
        for (var i = 0; i < 5; i++) {
            if (index != i) {
                items.push(i);
            }
        }
        items.sort();
        return items;
    }, _indexInner30: function (index) {
        console.log('player index:[' + index + '] inner 30');
       return this._random(index,1);
    }, _indexOuter30: function (index) {
        console.log('player index:[' + index + '] outer 30');
        return this._random(index,5);
    }, _exchangeIndex: function (targetPlayerId) {
        console.log('exchange index with player:[' + targetPlayerId + ']');
    },_random:function(index,base){
        var items = [];
        for (var i = 0; i < 4; i++) {
            var _index=index/(4-i);
            if(i===3){
                _index=index/1.05;
            }
            items.push(getRandomInt(_index-base,_index+base));
        }
        items.sort();
        return items;
    }
});