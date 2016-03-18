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
        this.myNum_text = this.panel.getChildByName('myNum_text');//剩余次数
        this.surplusNum.setString(CONSTS.arena_challenge_times);
        this.opponentBox = this.panel.getChildByName('opponent_box');//挑战者列表
        //setFont(this.changeText,this.buyText,this.recordText,this.surplusNum,this.surplusText);
        //setColor(this.changeText,this.buyText,this.recordText,this.surplusNum,this.surplusText);
        this._arenakey = 'test-arena';
        this._itemTemplate = ccs.csLoader.createNode(res.pvp_opponent_view_json).getChildByName('root');
        this.changeBtn.addClickEventListener(function (e) {
            this.refreshItems(this._index);
        }.bind(this));
        this.buyBtn.addClickEventListener(function () {
            Popup.openPopup("购买挑战次数", "是否花费" + CONSTS.arena_times_purchase.value + unit2Text(CONSTS.arena_times_purchase.unit) + "购买" + CONSTS.arena_times_purchase.times + "场挑战次数",
                function () {
                    CONSTS.arena_challenge_times += CONSTS.arena_times_purchase.times;
                    PlayerData.updateResource(CONSTS.arena_times_purchase);
                    PlayerData.updatePlayer();
                    this.refreshTimes();
                }.bind(this));
        });
        function unit2Text(unit) {
            switch (unit) {
                case "gem":
                    return "钻石";
                case "gold":
                    return "金币";
                case "relic":
                    return "宝物";
            }
        }

        this.pullData();
    }, pushItem: function (data, i) {
        var item = this._itemTemplate.clone();
        var icon = item.getChildByName("player_icon");
        //icon.loadTexture('');
        var player_name = item.getChildByName("player_name");
        player_name.setString(data.player.name);
        var level_text = item.getChildByName("level_text");
        level_text.setString('Lv.' + data.player.level);
        var rank = item.getChildByName("rank");
        var rank_num = item.getChildByName("rank_num");
        rank_num.setString(data.index + 1);
        var fight_num = item.getChildByName("fight_num");
        fight_num.setString(data.score);
        var btnLayer = item.getChildByName("btn");
        var btn = btnLayer.getChildByName("btn");
        item.setPositionY(this.opponentBox.height - i * item.height - i * 3);
        item.setPositionX((this.opponentBox.width - item.width) / 2);
        btn.addClickEventListener(function (e) {
            this.fight(data, e);
        }.bind(this));
        this.opponentBox.addChild(item);
    }, pullData: function () {
        this._arenaService = sgt.getCustomService('arena', ["getPlayersByIndex", "addToEnd", "exchangeIndex", "checkInArena"]);
        this._arenaService.addToEnd(this._arenakey, player.id, function (result, data) {
            if (result) {
                this._index = data;
                this.refreshItems(this._index);
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
        return this._random(index, 1);
    }, _indexOuter30: function (index) {
        console.log('player index:[' + index + '] outer 30');
        return this._random(index, 5);
    }, _exchangeIndex: function (targetPlayerId) {
        console.log('exchange index with player:[' + targetPlayerId + ']');
    }, _random: function (index, base) {
        var items = [];
        for (var i = 0; i < 4; i++) {
            var _index = index / (4 - i);
            if (i === 3) {
                _index = index / 1.05;
            }
            items.push(getRandomInt(_index - base, _index + base));
        }
        items.sort();
        return items;
    }, fight: function (data, e) {
        CONSTS.arena_challenge_times--;
        this.refreshTimes();
    }, refreshTimes: function () {
        this.surplusNum.setString(CONSTS.arena_challenge_times);
    }, refreshItems: function (index) {
        this.opponentBox.removeAllChildrenWithCleanup(true);
        var items;
        this.myNum_text.setString(index + 1);
        if (index < 5) {
            items = this._indexInner5(index);
        } else if (index <= 30) {
            items = this._indexInner30(index);
        } else {
            items = this._indexOuter30(index);
        }
        this._arenaService.getPlayersByIndex(items, this._arenakey, function (result, data) {
            if (result) {
                for (var i=0;i<data.length;i++) {
                    this.pushItem(data[i], i + 1);
                }
            }
        }.bind(this));
    }
});