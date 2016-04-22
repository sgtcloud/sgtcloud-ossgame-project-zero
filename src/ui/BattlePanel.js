var BATTLE_STATE = {
    STATE_NORMAL_BATTLE: 0,
    STATE_BOSS_BATTLE: 1,
    STATE_BOSS_READY: 2,
    STATE_ARENA_BATTLE: 3
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

        this.boss_stage = root.getChildByName("boss_stage");

        this.boss_btn = this.boss_stage.getChildByName('boss_btn');
        this.stage_icon = this.boss_stage.getChildByName('enemy_icon');
        this.battle_num = this.boss_stage.getChildByName('enemy_num');
        this.battleNum_bg = this.boss_stage.getChildByName('enemy_bg');
        this.enemyList = root.getChildByName('enemy_list');
        this.prev_stage_num = this.enemyList.getChildByName("level_text1");
        this.current_stage_num = this.enemyList.getChildByName("level_text2");
        this.next_stage_num = this.enemyList.getChildByName("level_text3");
        //this.buffList.setLocalZOrder(9000);

        this.taskBtn=root.getChildByName('task_btn');
        bindButtonCallback(this.taskBtn, function () {
            TaskPanel.open();
        }.bind(this));

        this.timeText.setVisible(false);

        this.rewardBtn = root.getChildByName('reward_btn');
        bindButtonCallback(this.rewardBtn, function () {
            //open offlineReward popup
            OfflineRewardPanel.open(this.rewardBtn);
        }.bind(this));
        this.loadRewardBtn();

        Loot.prototype.getPackPosition = function () {
            return this.rechargeBtn.convertToWorldSpace(this.rechargeBtn.getPosition());
        }.bind(this);

        this.rechargeBtn = root.getChildByName('recharge_btn');
        bindButtonCallback(this.rechargeBtn, function () {
            RechargePanel.open();
        }.bind(this));

        this.userBtn = root.getChildByName('user_btn');
        this.userBtn.setVisible(false);
        var isVisitor = localStorage.getItem('is-sgt-html5-game-visitor');
        if(!isVisitor || parseInt(isVisitor) === 1){
            this.userBtn.setVisible(true);
        }
        bindButtonCallback(this.userBtn, function () {
            RegisterPanel.open(1,this.userBtn);
        }.bind(this));
        /*var scale = this.pack_btn.scale;
        customEventHelper.bindListener(EVENT.UPDATE_RESOURCE, function (data) {
            var resources = data.getUserData();
            if (!resources) {
                return;
            }
            if (resources instanceof Array) {
                for (var i = 0; i < resources.length; i++) {
                    if (cc.isNumber(resources[i].value) && resources[i].value > 0) {
                        this.pack_btn.runAction(cc.sequence(cc.scaleTo(0.1, 1.5 * scale), cc.scaleTo(0.1, scale)));
                        break;
                    }
                }
            } else {
                if (cc.isNumber(resources.value) && resources.value > 0) {
                    this.pack_btn.runAction(cc.sequence(cc.scaleTo(0.1, 1.5 * scale), cc.scaleTo(0.1, scale)));
                }
            }
        }.bind(this));*/

        var container = root.getChildByName('battle_bg');
        container.setTouchEnabled(false);
        this.battleField = new BattleField(container);
        this.battleField.initUnitPositions(root.getChildByName('sprites'));
        this.disableSpecialBattleTimeCounter();
        this.battleField.initBattle(PlayerData.getStageData());

        /*Loot.prototype.getPackPosition = function () {
            var world_position = root.convertToWorldSpace(this.pack_btn.getPosition());
            return container.convertToNodeSpace(world_position);
        }.bind(this);*/

        this.arenaBattledHandle = function () {
            this.loadRewardBtn();
            setVisibles([this.rechargeBtn, this.userBtn], true);
            var stage = PlayerData.getStageData();
            if (stage.isBossBattle()) {
                scheduleOnce(this, function () {
                    this.enableSpecialBattleTimeCounter(stage, true);
                }, CONSTS.arena_challenged_interval_timestamp);
            } else {
                this.disableSpecialBattleTimeCounter();
            }
        };
        customEventHelper.bindListener(EVENT.FIGHT_BOSS_BATTLE, function () {
            tip.toggle({"text": BATTLE_TIPS.START_BOSS_BATTLE, "color": TIPS_COLOR.YELLOW});
            this.enableSpecialBattleTimeCounter(PlayerData.getStageData(), true);
        }.bind(this));
        customEventHelper.bindListener(EVENT.LEAVE_BOSS_BATTLE, function () {
            tip.toggle({"text": BATTLE_TIPS.BOSS_BATTLE_FAIL, "color": TIPS_COLOR.YELLOW});
            console.log('离开boss战');
            this.disableSpecialBattleTimeCounter();
        }.bind(this));
        customEventHelper.bindListener(EVENT.WIN_BOSS_BATTLE, function () {
            tip.toggle({"text": BATTLE_TIPS.BOSS_BATTLE_VICTORY, "color": TIPS_COLOR.YELLOW});
            this.disableSpecialBattleTimeCounter();
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

        customEventHelper.bindListener(EVENT.FIGHT_ARENA_BATTLE, function () {
            setVisibles([this.rechargeBtn,this.rewardBtn, this.userBtn], false);
            this.enableSpecialBattleTimeCounter(null, false);
        }.bind(this));

        customEventHelper.bindListener(EVENT.LOSE_ARENA_BATTLE, this.arenaBattledHandle.bind(this));
        customEventHelper.bindListener(EVENT.WIN_ARENA_BATTLE, this.arenaBattledHandle.bind(this));
        this.state = BATTLE_STATE.STATE_NORMAL_BATTLE;
        // register battle custom event
        customEventHelper.bindListener(EVENT.BATTLE_START, function (event) {
            var data = event.getUserData();
            if (data) {
                this.state = BATTLE_STATE.STATE_ARENA_BATTLE;
                this.refreshStageState();
            } else {
                this.state = BATTLE_STATE.STATE_NORMAL_BATTLE;
                this.refreshStageList();
                this.refreshStageState();
            }
        }.bind(this));
        bindButtonCallback(this.boss_btn, function () {
            var stage = PlayerData.getStageData();
            if (stage.isBossBattle()) {
                customEventHelper.sendEvent(EVENT.LEAVE_BOSS_BATTLE);
            }else{
                customEventHelper.sendEvent(EVENT.FIGHT_BOSS_BATTLE);
            }
        }.bind(this));

        this.refreshStageList();
        this.refreshStageState();
        DamageNumber.initPool();

        this.update = function (dt) {
            {
                //customEventHelper.sendEvent(EVENT.TEST_BLOCK);
                if (this.intervalState) {
                    this.intervalTime += dt;
                    if (this.intervalTime > CONSTS.flySpirit_interval_time) {
                        if (!this.battleField.arenaBattle) {
                            this.battleField.showFairy();
                            this.intervalState = false;
                        }
                    }
                }
                if (this.startBossTime && !this.battleField.arenaBattle) {
                    this.updateBossBattleTime(dt);
                }

                if (this.startarenaTime) {
                    this.updateArenaBattleTime(dt);
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
    disableSpecialBattleTimeCounter: function () {
        this.timeText.visible = false;
        this.timeBar.visible = false;
        this.icon.visible = true;
    }
    ,
    enableSpecialBattleTimeCounter: function (stage, bossBattle) {
        this.timeText.visible = true;
        this.timeBar.visible = true;
        this.icon.visible = false;
        if (bossBattle) {
            this.bossTimeMax = stage.getBossTimeMax();
            this.startBossTime = true;
        } else {
            this.startarenaTime = true;
            this.arenaTimeMax = CONSTS.arena_challenge_Max_time;
        }
        //var self = this;
        this.timeText.ignoreContentAdaptWithSize(true);
    }
    ,
    updateBossBattleTime: function (dt) {
        if (Math.floor(this.bossTimeMax) < 0) {
            this.startBossTime = false;
            customEventHelper.sendEvent(EVENT.LEAVE_BOSS_BATTLE);
        } else {
            this.bossTimeMax = this.bossTimeMax - dt;
            this.timeText.setString(Math.floor(this.bossTimeMax));
            this.timeBar.setPercent(Math.floor(this.bossTimeMax) / PlayerData.getStageData().getBossTimeMax() * 100);
        }
    },
    updateArenaBattleTime: function (dt) {
        if (Math.floor(this.arenaTimeMax) < 0) {
            this.startarenaTime = false;
            customEventHelper.sendEvent(EVENT.LOSE_ARENA_BATTLE);
        } else {
            this.arenaTimeMax = this.arenaTimeMax - dt;
            this.timeText.setString(Math.floor(this.arenaTimeMax));
            this.timeBar.setPercent(Math.floor(this.arenaTimeMax) / CONSTS.arena_challenge_Max_time * 100);
        }
    },
    refreshStageState: function () {

        var stage = PlayerData.getStageData();
        var cur = player.stage_battle_num;
        var max = stage.getRandomBattleCount();
        // 根据当前stage的battle状态设置gui状态
        if (this.state !== BATTLE_STATE.STATE_ARENA_BATTLE) {
            if (stage.isBossBattle()) {
                this.state = BATTLE_STATE.STATE_BOSS_BATTLE;
            } else {
                if (cur > max) {
                    this.state = BATTLE_STATE.STATE_BOSS_READY;
                } else {
                    this.state = BATTLE_STATE.STATE_NORMAL_BATTLE;
                }
            }
        }
        // 根据gui状态控制各个控件的可见性
        this.boss_stage.setVisible(true);
        if (this.state === BATTLE_STATE.STATE_NORMAL_BATTLE) {
            //cc.log("stage:" + cur + '/' + max);
            this.battle_num.setString(cur + '/' + max);
            this.boss_btn.setVisible(false);
            this.battle_num.setVisible(true);
            this.battleNum_bg.setVisible(true);
            this.stage_icon.setVisible(true);
        } else if (this.state === BATTLE_STATE.STATE_BOSS_BATTLE) {
            this.battle_num.setVisible(false);
            this.boss_btn.setVisible(true);
            this.boss_btn.setHighlighted(true);
            this.battleNum_bg.setVisible(false);
            this.stage_icon.setVisible(false);
        } else if (this.state === BATTLE_STATE.STATE_BOSS_READY) {
            this.boss_btn.setVisible(true);
            this.boss_btn.setHighlighted(false);
            this.battle_num.setVisible(false);
            this.battleNum_bg.setVisible(false);
            this.stage_icon.setVisible(false);
        } else {
            this.boss_stage.setVisible(false);
        }
    },
    refreshStageList: function () {
        var preStageId = PlayerData.getStageData().getPrevStageId();
        if (preStageId) {
            var preStage = new Stage(preStageId);
            //this.loadStageIcon(preStage, this.prev_stage_icon);
            this.prev_stage_num.setString(preStage.getStageNum());
            //cc.log("preStage:" + preStage.getStageNum());
            //this.prev_stage_arrow.setVisible(true);
        } else {
            //this.prev_stage_arrow.setVisible(false);
        }
        //this.loadStageIcon(PlayerData.getStageData(), this.current_stage_icon);
        this.current_stage_num.setString(PlayerData.getStageData().getStageNum());
        //cc.log("curStage:" + PlayerData.getStageData().getStageNum());
        var nextStageId = PlayerData.getStageData().getNextStageId();
        if (nextStageId) {
            var nextStage = new Stage(nextStageId);
            //this.loadStageIcon(nextStage, this.next_stage_icon);
            this.next_stage_num.setString(nextStage.getStageNum());
            //cc.log("nextStage:" + nextStage.getStageNum());
        }
    },
    loadStageIcon: function (stage, stageIconWidget) {
        var icon_image_url = "res/stages/" + stage.getIcon();
        stageIconWidget.loadTexture(icon_image_url, ccui.Widget.LOCAL_TEXTURE);
    }

});
