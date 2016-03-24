var RankLayerMenu = BattleMenu.extend({
    ctor: function (battle) {
        this._super(battle, res.rank_layer_json);
        var listView = this.root.getChildByName("List");
        var rankTab = this.root.getChildByName("rank_tab");
        var myNumText = this.root.getChildByName('myNum_text');
        var rankViewRoot = ccs.csLoader.createNode(res.rank_view_json).getChildByName('root');
        var tabParams = [
            {name: "gold_tab"},
            {name: "stage_tab"},
            {name: "pvp_tab"}
        ];
        this.buttons = {};
        var self = this;
        for (var i in tabParams) {
            var param = tabParams[i];
            var name = param.name;
            this.buttons[name] = rankTab.getChildByName(name);
            if (i == 0)
                this.buttons[name].setSelected(true);
            else
                this.buttons[name].setSelected(false);
            this.buttons[name].addEventListener(function (sender, type) {
                if (type === ccui.CheckBox.EVENT_SELECTED) {
                    this.showMenuLayer(sender.name);
                }
                else if (type === ccui.CheckBox.EVENT_UNSELECTED) {
                    sender.setSelected(true);
                }
            }.bind(this), this);
        }
        var n = 0;
        this.showMenuLayer = function (name) {
            for (var i in this.buttons) {
                this.buttons[i].setSelected(false);
            }
            this.showRankList(name);
            this.buttons[name].setSelected(true);
        };

        this.refeshRankLayer = function () {
            for (var i in this.buttons) {
                if (this.buttons[i].selected /*&& i === event.getUserData().leaderId.replace("rank","tab")*/) {
                    this.showMenuLayer(i);
                    break;
                }
            }
        };
        /*customEventHelper.bindListener(EVENT.UPDATE_SELF_RANK, function (event) {

         }.bind(this));*/

        this.showRankList = function (type) {
            listView.removeAllChildren();
            Network.getCurrentRanksByType(type.replace('tab', "rank"), function (result, data) {
                myNumText.setString('--');
                if (result) {
                    for (var i in data) {
                        listView.pushBackCustomItem(this.setRankView(data[i], type));
                        //rankView);
                    }
                    Network.getMyRankByType(type.replace('tab', "rank"), function (result, index) {
                        if (result && cc.isNumber(index))
                            myNumText.setString(index + 1);
                    });
                }
                myNumText.ignoreContentAdaptWithSize(true);
                myNumText.setColor(cc.color(63, 193, 61));
            }.bind(this));
        };
        this.setRankView = function (data, type) {
            var root = rankViewRoot.clone();
            rankViewRoot.ignoreContentAdaptWithSize(true);
            root.getChildByName('player_icon').loadTexture("res/icon/heroes/" + data.player.avatarUrl);
            var playerName = root.getChildByName('player_name');
            var levelText = root.getChildByName('level_text');
            root.getChildByName('player_prestige').setVisible(false);
            root.getChildByName('prestige_text').setVisible(false);
            var myBg = root.getChildByName('my_bg');
            var num = root.getChildByName('num');
            var text = root.getChildByName('text');
            setFont([playerName]);
            setIgnoreContentAdaptWithSize([levelText, /*prestigeText,*/ num, text]);
            levelText.setString("Lv." + data.player.level);
            num.setString(data.index + 1);
            playerName.setString(data.player.name);
            if (data.player.id == player.id) {
                myBg.setVisible(true);
            } else {
                myBg.setVisible(false);
            }
            text.setString(data.score);
            if (type === 'gold_tab') {
                root.getChildByName('gold_rank').setVisible(true);
                root.getChildByName('Max_gold').setVisible(true);
                root.getChildByName('stage_rank').setVisible(false);
                root.getChildByName('Max_stage').setVisible(false);
                root.getChildByName('Fight').setVisible(false);
                root.getChildByName('PVP_rank').setVisible(false);
                text.setColor(TIPS_COLOR.YELLOW);
            } else if(type === 'stage_tab') {
                root.getChildByName('stage_rank').setVisible(true);
                root.getChildByName('Max_stage').setVisible(true);
                root.getChildByName('gold_rank').setVisible(false);
                root.getChildByName('Max_gold').setVisible(false);
                root.getChildByName('Fight').setVisible(false);
                root.getChildByName('PVP_rank').setVisible(false);
            }else{
                root.getChildByName('stage_rank').setVisible(false);
                root.getChildByName('gold_rank').setVisible(false);
                root.getChildByName('Max_stage').setVisible(false);
                root.getChildByName('Max_gold').setVisible(false);
                root.getChildByName('Fight').setVisible(true);
                root.getChildByName('PVP_rank').setVisible(true);
            }
            return root;
        };

        this.showMenuLayer("stage_tab");
    }
});