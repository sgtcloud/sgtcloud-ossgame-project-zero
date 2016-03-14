/**
 * Created by zxh on 15/3/20.
 */
/**
 * Created by zxh on 15/3/18.
 */

var guideConfig = {
    tasks: {
        1: [
            {
                log: "intro",
                command: sz.GuideCommand.GC_SHOW_MSG,
                string: '这是一个点击放置RPG游戏，既然是RPG自然离不开杀怪升级，先来杀个怪吧~',
                onEnter: function (cb) {
                    customEventHelper.sendEvent(EVENT.PAUSE_THE_BATTLE);
                    cb();
                },
                onExit: function () {
                    customEventHelper.sendEvent(EVENT.RESUME_THE_BATTLE);
                },
                delayTime: 3
            }
        ],

        2: [
            {
                log: "tap",
                command: sz.GuideCommand.GC_FINGER_HINT,
                locator: "main>enemy",
                textHint: '点击越快，造成的伤害越多',
                onLocateNode: function (node) {
                    customEventHelper.sendEvent(EVENT.PAUSE_THE_BATTLE);
                },
                onExit: function () {
                    customEventHelper.sendEvent(EVENT.RESUME_THE_BATTLE);
                },
                delayTime: 1
            }]

    },
    locateNodeDurationTime: 0.1,
    fingerImage: 'res/GuideHand.json',
    eventType: 2,
    isShowMask: false,  //默认为不打开
    isAutoGuide: false,  //自动引导
    isShowTouchPoint: true,
    isFingerAnimation: true
};
