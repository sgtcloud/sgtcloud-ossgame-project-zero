var EVENT = {
    /**
     * 战斗开始
     */
    BATTLE_START: "BATTLE_START",
    /**
     * 战斗胜利
     */
    BATTLE_WIN: "BATTLE_WIN",
    /**
     * 离开boss战斗
     */
    LEAVE_BOSS_BATTLE: "LEAVE_BOSS_BATTLE",
    /**
     * 进入boss战斗
     */
    FIGHT_BOSS_BATTLE: "FIGHT_BOSS_BATTLE",
    /**
     * boss战斗获胜
     */
    WIN_BOSS_BATTLE: "WIN_BOSS_BATTLE",
    /**
     * 更新敌人的总血量
     */
    UPDATE_ENEMY_LIFE: "UPDATE_ENEMY_LIFE",
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
     * 圣物数量改变
     */
    RELIC_VALUE_UPDATE: "RELIC_VALUE_UPDATE",
    /**
     * 背包数量改变
     */
    PACK_VALUE_UPDATE: "PACK_VALUE_UPDATE",
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
    HERO_BUY_REVIVE: "HERO_BUY_REVIVE",
    /**
     * 准备释放技能
     */
    CAST_SKILL_READY: "CAST_SKILL_READY",
    /**
     * 解锁主动技能
     */
    UNLOCK_ACTIVITY_SKILL: "UNLOCK_ACTIVITY_SKILL",
    /**
     * 解锁英雄
     */
    UNLOCK_HERO: "UNLOCK_HERO",
    /**
     * 更新技能总攻击显示
     */
    UPGRADE_HERO_ATTACK: "UPGRADE_HERO_ATTACK",
    /**
     * 更新指定资源（金币、钻石、宝物...）
     * 参数:{unit:资源类型,value:资源值}
     */
    UPDATE_RESOURCE: 'UPDATE_RESOURCE',
    /**
     * 英雄神器数量
     */
    UPGRADE_EQUIP_NUM: "UPGRADE_EQUIP_NUM",
    /**
     * 重置小精灵计数
     */
    RESET_FAIRY_COUNTDOWN: "RESET_FAIRY_COUNTDOWN",

    /**
     * 刷新所有英雄的属性
     */
    ALL_HERO_REFRESH_PROPS: "ALL_HERO_REFRESH_PROPS",
    /**
     * 使用道具
     */
    USE_GAME_ITEMS: "USE_GAME_ITEMS"


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