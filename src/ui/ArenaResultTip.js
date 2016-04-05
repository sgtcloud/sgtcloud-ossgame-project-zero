/**
 * Created by Administrator on 2016/4/1.
 */
var ArenaResultTip = cc.Class.extend({
    ctor: function (scene) {
        this.tip = ccs.csLoader.createNode(res.arena_result_tip);
        this.root = this.tip.getChildByName('root');
        this.win = this.root.getChildByName('win');
        this.lose = this.root.getChildByName('lose');
        this.rewardIcon = this.root.getChildByName('reward_icon');
        this.rewardNum = this.root.getChildByName('reward_num');
        this.preWinNum = this.win.getChildByName('before_num');
        this.afterWinNum = this.win.getChildByName('now_num');
        this.preLoseNum = this.lose.getChildByName('before_num');
        var tipHeight = this.root.height;
        var tipWidth = this.root.width;
        var size = cc.winSize;
        var height = size.height;
        var width = size.width;
        this.root.setPosition((width - tipWidth) / 2, (height - tipHeight) / 2);
        this.close=this.root.getChildByName('close');
        this.tip.setVisible(false);
        bindTouchEventListener(function(){
            this.tip.setVisible(false);
        }.bind(this),this.close);
        scene.addChild(this.tip, 110);
    }, toggleWin: function (data) {
        this.preWinNum.setString(data['lowLevel']);
        this.afterWinNum.setString(data['highLevel']);
        var _reward = this._processReward(data);
        this.rewardNum.setString(_reward['value']);
        this.lose.setVisible(false);
        this.win.setVisible(true);
        this._toggle();
    }, toggleLose: function (data) {
        var _reward = this._processReward(data);
        this.rewardNum.setString(_reward['value']);
        this.preLoseNum.setString(data['rank']);
        this.lose.setVisible(true);
        this.win.setVisible(false);
        this._toggle();
    }, _toggle: function () {
        this.tip.setVisible(true)
    }, _processReward: function (data) {
        var reward = data['attachment'];
        if (typeof reward === 'string') {
            reward = eval('(' + reward + ')')
        }
        var _reward = {};
        if (reward instanceof Array && reward.length > 0) {
            if (reward[0].hasOwnProperty('unit')) {
                _reward = reward[0];
            } else {
                for (var key in reward[0]) {
                    _reward['unit'] = key;
                    _reward['value'] = reward[0][key];
                }
            }
        } else {
            for (var key in reward) {
                _reward['unit'] = key;
                _reward['value'] = reward[key];
            }
        }
        return _reward;
    }
});