var EVENT = {
    BATTLE_START: "BATTLE_START",
    BATTLE_WIN: "BATTLE_WIN",
    LEAVE_BOSS_BATTLE: "LEAVE_BOSS_BATTLE",
    FIGHT_BOSS_BATTLE: "FIGHT_BOSS_BATTLE"
    ,
    /**
     * 英雄升级
     */
    HERO_UPGRADE: "HERO_UPGRADE"
    ,
    /**
     * 英雄技能升级
     */
    HERO_SKILL_UPGRADE: "SKILL_UPGRADE",
    /**
     * 金币位置改变
     */
    GOLD_POSITION:"GOLD_POSITION",
    /**
     * 金币数量改变
     */
    GOLD_VALUE_UPDATE:"GOLD_VALUE_UPDATE",
    /**
     * 英雄升级按钮
     */
    HERO_UPGRADE_BTN:"HERO_UPGRADE_BTN",
    /**
     * 英雄技能升级按钮
     */
    HERO_SKILL_UPGRADE_BTN:"HERO_SKILL_UPGRADE_BTN"

};

var customEventHelper = {
    bindListener: function (eventName, listener) {
        this.customEventListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: eventName,
            callback: listener
        });
        cc.eventManager.addListener(this.customEventListener, 1);
    },

    sendEvent: function (eventName, eventData) {
        var event = new cc.EventCustom(eventName);
        event.setUserData(eventData);
        cc.eventManager.dispatchEvent(event);
    }
};