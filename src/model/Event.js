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
     * 英雄装备升级
     */
    HERO_EQUIP_UPGRADE: "EQUIP_UPGRADE",
    /**
     * 金币位置改变
     */
    GOLD_POSITION: "GOLD_POSITION",
    /**
     * 金币数量改变
     */
    GOLD_VALUE_UPDATE: "GOLD_VALUE_UPDATE",
    /**
     * 英雄升级按钮
     */
    HERO_UPGRADE_BTN: "HERO_UPGRADE_BTN",
    /**
     * 英雄技能升级按钮
     */
    HERO_SKILL_UPGRADE_BTN: "HERO_SKILL_UPGRADE_BTN",
    /**
     * 英雄死亡
     */
    HERO_DIE: "HERO_DIE",
    /**
     * 英雄复活
     */
    HERO_REVIVE: "HERO_REVIVE",
    /**
     * 英雄复活倒计时
     */
    HERO_REVIVE_COUNTDOWN: "HERO_REVIVE_COUNTDOWN",
    /**
     * 钻石数量改变
     */
    GEM_VALUE_UPDATE: "GEM_VALUE_UPDATE",
    /**
     * 刷新英雄属性
     */
    HERO_REFRESH_PROPS: "HERO_REFRESH_PROPS",
    /**
     * 释放主动技能
     */
    CAST_SKILL: "CAST_SKILL",
    /**
     * 震动战斗场景
     */
    SHOCK_BATTLE_FIELD: "SHOCK_BATTLE_FIELD",
    /**
     * 拉伸战斗场景
     */
    SCALE_BATTLE_FIELD: "SCALE_BATTLE_FIELD",
    /**
     * 英雄买活
     */
    HERO_BUY_REVIVE: "HERO_BUY_REVIVE"
};

var customEventHelper = {
    /**
     * 绑定自定义事件
     * @param eventName 事件名称
     * @param listener  事件监听函数
     */
    bindListener: function (eventName, listener) {
        this.customEventListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: eventName,
            callback: listener
        });
        cc.eventManager.addListener(this.customEventListener, 1);
    },
    /**
     * 触发事件
     * @param eventName 事件名称
     * @param eventData 发送的消息内容
     */
    sendEvent: function (eventName, eventData) {
        var event = new cc.EventCustom(eventName);
        event.setUserData(eventData);
        cc.eventManager.dispatchEvent(event);
    }
};