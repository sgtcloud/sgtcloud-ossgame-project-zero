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
                log: "点击",
                command: sz.GuideCommand.GC_FINGER_HINT,
                locator:"main>enemy"
            },

            {
                log: "关闭第二盏灯",
                command: sz.GuideCommand.GC_FINGER_HINT,
                locator:"_fire2"
            }
        ],

        2: [
            {
                log:'点击home',
                command: sz.GuideCommand.GC_FINGER_HINT,
                locator:"_btnHome",
                eventType:0
            }
        ]

    },
    locateNodeDurationTime: 0.1,
    fingerImage: 'res/GuideHand.json',
    eventType: 2,
    isShowMask: true,  //默认为不打开
    isAutoGuide: false,  //自动引导
    isShowTouchPoint:true
};
