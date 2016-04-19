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
        //this.buffList.setLocalZOrder(9000);


        this.timeText.setVisible(false);

        this.statistics_btn = root.getChildByName("statistics_btn");
        bindButtonCallback(this.statistics_btn, function () {
            //customEventHelper.sendEvent(EVENT.FIGHT_ARENA_BATTLE);
            //GamePopup.openPopup(new StatisticsPanel(), /*cc.p(320, 580)*/null, false);
            StatisticsPanel.open();
        }.bind(this));
        this.rewardBtn = root.getChildByName('reward_btn');

        bindButtonCallback(this.rewardBtn, function () {
            //open offlineReward popup
            /*GamePopup.openPopup(new OfflineRewardPanel(this.rewardBtn));*/
            OfflineRewardPanel.open(this.rewardBtn);
        }.bind(this));
        this.loadRewardBtn();

        Loot.prototype.getPackPosition = function () {
            return this.pack_btn.convertToWorldSpace(this.pack_btn.getPosition());
        }.bind(this);

        this.pack_btn = root.getChildByName('pack_btn');
        bindButtonCallback(this.pack_btn, function () {
            //GamePopup.openPopup(new PackUnit(), null/*cc.p(320, 580)*/, false);
            PackUnit.open();
        }.bind(this));

        this.mail_btn = root.getChildByName('maill_btn');
        bindButtonCallback(this.mail_btn, function () {
            MailPanel.open();
        }.bind(this));
        this.rechargeBtn = root.getChildByName('recharge_btn');
        bindButtonCallback(this.rechargeBtn, function () {
            RechargePanel.open();
        }.bind(this));

        this.firstRechargeBtn = root.getChildByName('firstRecharge_btn');
        if(cc.isNumber(player.vip) || player.vip < 2 || player.first_recharge_status != 2){
            bindButtonCallback(this.firstRechargeBtn, function () {
                FirstRechargePanel.open(this.firstRechargeBtn);
            }.bind(this));
        }else{
            this.firstRechargeBtn.setVisible(false);
        }
        this.noticeBtn = root.getChildByName('notice_btn');
        bindButtonCallback(this.noticeBtn, function () {
            NoticePanel.open(true);
        }.bind(this));

        this.giftCodeBtn = root.getChildByName('giftCode_btn');
        bindButtonCallback(this.giftCodeBtn, function () {
            GiftCodePanel.open();
        }.bind(this));
        var scale = this.pack_btn.scale;
        customEventHelper.bindListener(EVENT.UPDATE_RESOURCE, function (data) {
            var resources = data.getUserData();
            if (!resources) {
                return;
            }
            if (resources instanceof Array) {
                for (var i = 0; i < resources.length; i++) {
                    if(cc.isNumber(resources[i].value) && resources[i].value > 0 ){
                        this.pack_btn.runAction(cc.sequence(cc.scaleTo(0.1, 1.5*scale), cc.scaleTo(0.1, scale)));
                        break;
                    }
                }
            } else {
                if(cc.isNumber(resources.value) && resources.value > 0 ){
                    this.pack_btn.runAction(cc.sequence(cc.scaleTo(0.1, 1.5*scale), cc.scaleTo(0.1, scale)));
                }
            }
        }.bind(this));

        var container = root.getChildByName('battle_bg');
        container.setTouchEnabled(false);
        this.battleField = new BattleField(container);
        this.battleField.initUnitPositions(root.getChildByName('sprites'));
        this.disableSpecialBattleTimeCounter();
        this.battleField.initBattle(PlayerData.getStageData());

        Loot.prototype.getPackPosition = function () {
            var world_position = root.convertToWorldSpace(this.pack_btn.getPosition());
            return container.convertToNodeSpace(world_position);
        }.bind(this);

        customEventHelper.bindListener(EVENT.FIGHT_BOSS_BATTLE, function () {
            tip.toggle({"text": BATTLE_TIPS.START_BOSS_BATTLE, "color": TIPS_COLOR.YELLOW});
            this.enableSpecialBattleTimeCounter(PlayerData.getStageData(),true);
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
            setVisibles([this.rechargeBtn,this.firstRechargeBtn,this.mail_btn ,this.pack_btn ,this.rewardBtn ,this.statistics_btn,this.noticeBtn,this.giftCodeBtn],false);
            this.enableSpecialBattleTimeCounter(null,false);
        }.bind(this));

        customEventHelper.bindListener(EVENT.LOSE_ARENA_BATTLE, function () {
            setVisibles([this.rechargeBtn,this.firstRechargeBtn,this.mail_btn ,this.pack_btn ,this.rewardBtn ,this.statistics_btn,this.noticeBtn,this.giftCodeBtn],true);
            var stage = PlayerData.getStageData();
            if(stage.isBossBattle()){
                scheduleOnce(this,function(){
                    this.enableSpecialBattleTimeCounter(stage,true);
                },CONSTS.arena_challenged_interval_timestamp);
            }else{
                this.disableSpecialBattleTimeCounter();
            }
        }.bind(this));

        customEventHelper.bindListener(EVENT.WIN_ARENA_BATTLE, function () {
            setVisibles([this.rechargeBtn,this.firstRechargeBtn,this.mail_btn ,this.pack_btn ,this.rewardBtn ,this.statistics_btn,this.noticeBtn,this.giftCodeBtn],true);
            var stage = PlayerData.getStageData();
            if(stage.isBossBattle()){
                scheduleOnce(this,function(){
                    this.enableSpecialBattleTimeCounter(stage,true);
                },CONSTS.arena_challenged_interval_timestamp);
            }else{
                this.disableSpecialBattleTimeCounter();
            }
        }.bind(this));

        DamageNumber.initPool();

        this.update = function (dt) {
            {
                //customEventHelper.sendEvent(EVENT.TEST_BLOCK);
                if (this.intervalState) {
                    this.intervalTime += dt;
                    if (this.intervalTime > CONSTS.flySpirit_interval_time) {
                        if(!this.battleField.arenaBattle){
                            this.battleField.showFairy();
                            this.intervalState = false;
                        }
                    }
                }
                if (this.startBossTime && !this.battleField.arenaBattle) {
                    this.updateBossBattleTime(dt);
                }

                if(this.startarenaTime){
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
    enableSpecialBattleTimeCounter: function (stage,bossBattle) {
        this.timeText.visible = true;
        this.timeBar.visible = true;
        this.icon.visible = false;
        if(bossBattle){
            this.bossTimeMax = stage.getBossTimeMax();
            this.startBossTime = true;
        }else{
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
    }

});
