var MainScene = cc.Scene.extend({

    onEnter: function () {
        this._super();

        this.battlePanel = new BattlePanel(this);
        this.battlePanel.initBattleHeroes();
        //tab container
        this.tabContainer = new TabContainer(this.battlePanel);
        this.tabContainer.setPosition(0, 0);
        this.addChild(this.tabContainer, 100);
        this.tabContainer.updatePlayerGoldText();

        //battle panel
        this.battlePanel.setPosition(0, this.tabContainer.height);
        this.addChild(this.battlePanel);

        //top panel
        this.topPanel = new TopPanel(this);
        this.topPanel.setPosition(0, this.tabContainer.height + this.battlePanel.height);
        this.addChild(this.topPanel);
        this.topPanel.refreshAll();

        this.tabContainer.showMenuLayer('main');
        this.battlePanel.initBattle(PlayerData.getStageData());


    }
});
