var BATTLE_STATE = {
    STATE_NORMAL_BATTLE: 0,
    STATE_BOSS_BATTLE: 1,
    STATE_BOSS_READY: 2
};


var BattlePanel = cc.Node.extend({

    ctor: function () {
        this._super();

        var battleLayer = ccs.csLoader.createNode(res.battle_layer_json);
        this.height = battleLayer.height;
        this.width = battleLayer.width;
        this.addChild(battleLayer);

        var root = battleLayer.getChildByName('root');
        this.enemyLifeText = root.getChildByName('enemy_life_text');
        this.enemyLifeBar = root.getChildByName('enemy_life_bar');
        this.timeText = root.getChildByName('time_text');
        this.icon = root.getChildByName('icon');
        this.timeBar = root.getChildByName('time_bar');

        this.buffList = root.getChildByName('buff_list');
        //this.buffList.setLocalZOrder(9000);


        this.timeText.setVisible(false);

        this.statistics_btn = root.getChildByName("statistics_btn");
        bindButtonCallback(this.statistics_btn, function () {
            GamePopup.openPopup(new StatisticsUnit(), cc.p(320, 580), false);
        }.bind(this));
        this.rewardBtn = root.getChildByName('reward_btn');

        bindButtonCallback(this.rewardBtn, function () {
            //open offlineReward popup
            GamePopup.openPopup(new OfflineRewardUnit(this.rewardBtn));
        }.bind(this));
        this.loadRewardBtn();

        Loot.prototype.getPackPosition = function () {
            return this.pack_btn.convertToWorldSpace(this.pack_btn.getPosition());
        }.bind(this);

        this.pack_btn = root.getChildByName('pack_btn');
        bindButtonCallback(this.pack_btn, function () {
            GamePopup.openPopup(new PackUnit(), cc.p(320, 580), false);
        }.bind(this));

        customEventHelper.bindListener(EVENT.UPDATE_RESOURCE, function (data) {
            var resources = data.getUserData();
            if (!resources) {
                return;
            }
            //如果是有增有减资源 也禁止背包按钮动画
            if (resources instanceof Array) {
                for (var i = 0; i < resources.length; i++) {
                    if(cc.isNumber(resources.value) && resources.value > 0 ){
                        this.pack_btn.runAction(cc.sequence(cc.scaleTo(0.1, 1.2), cc.scaleTo(0.1, 0.8)));
                        break;
                    }
                }
            } else {
                if(cc.isNumber(resources.value) && resources.value > 0 ){
                    this.pack_btn.runAction(cc.sequence(cc.scaleTo(0.1, 1.2), cc.scaleTo(0.1, 0.8)));
                }
            }
        }.bind(this));

        var container = root.getChildByName('battle_bg');
        container.setTouchEnabled(false);
        this.battleField = new BattleField(container);
        this.battleField.initSpritesPositions(root.getChildByName('sprites'));
        this.disableBossBattleTimeCounter();
        this.battleField.initBattle(PlayerData.getStageData());

        Loot.prototype.getPackPosition = function () {
            var world_position = root.convertToWorldSpace(this.pack_btn.getPosition());
            return container.convertToNodeSpace(world_position);
        }.bind(this);

        customEventHelper.bindListener(EVENT.FIGHT_BOSS_BATTLE, function () {
            tip.toggle({"text": BATTLE_TIPS.START_BOSS_BATTLE, "color": TIPS_COLOR.YELLOW});
            this.enableBossBattleTimeCounter(PlayerData.getStageData());
        }.bind(this));
        customEventHelper.bindListener(EVENT.LEAVE_BOSS_BATTLE, function () {
            tip.toggle({"text": BATTLE_TIPS.BOSS_BATTLE_FAIL, "color": TIPS_COLOR.YELLOW});
            this.disableBossBattleTimeCounter();
        }.bind(this));
        customEventHelper.bindListener(EVENT.WIN_BOSS_BATTLE, function () {
            tip.toggle({"text": BATTLE_TIPS.BOSS_BATTLE_VICTORY, "color": TIPS_COLOR.YELLOW});
            this.disableBossBattleTimeCounter();
        }.bind(this));

        customEventHelper.bindListener(EVENT.UPDATE_ENEMY_LIFE, function (event) {
            var max = event.getUserData().max;
            var life = event.getUserData().life;
            if (cc.isNumber(max) && cc.isNumber(life)) {
                this.enemyLifeText.ignoreContentAdaptWithSize(true);
                this.enemyLifeText.setString(life);
                this.enemyLifeBar.setPercent(life / max * 100);
            }
        }.bind(this));

        customEventHelper.bindListener(EVENT.RESET_FAIRY_COUNTDOWN, function () {
            this.reset();
        }.bind(this));

        DamageNumber.initPool();

        this.update = function (dt) {
            {
                //customEventHelper.sendEvent(EVENT.TEST_BLOCK);
                if (this.intervalState) {
                    this.intervalTime += dt;
                    if (this.intervalTime > CONSTS.flySpirit_interval_time) {
                        this.battleField.showFairy();
                        this.intervalState = false;
                    }
                }
                var stage = PlayerData.getStageData();
                if (stage.isBossBattle()) {
                    this.updateBossBattleTime(dt, stage);
                }
            }
        };
        this.reset();
        this.scheduleUpdate();
    },

    reset: function () {
        this.intervalTime = 0;
        this.intervalState = true;
        this.bossTimeMax = 0;
    }
    ,
    loadRewardBtn: function () {
        this.rewardBtn.visible = cc.isObject(player.not_get_reward);
    }
    ,
    disableBossBattleTimeCounter: function () {
        this.timeText.visible = false;
        this.timeBar.visible = false;
        this.icon.visible = true;
    }
    ,
    enableBossBattleTimeCounter: function (stage) {
        this.timeText.visible = true;
        this.timeBar.visible = true;
        this.icon.visible = false;
        this.bossTimeMax = stage.getBossTimeMax();
        //var self = this;
        this.timeText.ignoreContentAdaptWithSize(true);
    }
    ,
    updateBossBattleTime: function (dt, stage) {
        if (Math.floor(this.bossTimeMax) < 0) {
            customEventHelper.sendEvent(EVENT.LEAVE_BOSS_BATTLE);
        } else {
            this.bossTimeMax = this.bossTimeMax - dt;
            this.timeText.setString(Math.floor(this.bossTimeMax));
            this.timeBar.setPercent(Math.floor(this.bossTimeMax) / stage.getBossTimeMax() * 100);
        }
    }

});
