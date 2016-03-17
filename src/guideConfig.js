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
                string: '这是一个点击放置RPG游戏，既然是RPG自然离不开杀怪升级，在杀怪之前，我们先把今天的签到奖励领了，记得每天登陆游戏都可以领取哦',
                onEnter: function (cb) {
                    customEventHelper.sendEvent(EVENT.PAUSE_THE_BATTLE);
                    cb();
                },
                onExit: function (cb) {
                    customEventHelper.sendEvent(EVENT.RESUME_THE_BATTLE);
                    cb();
                }
            }],

        2: [
            {
                log: "checkin",
                command: sz.GuideCommand.GC_FINGER_HINT,
                locator: "main>checkInPanel>checkInItem",
                textHint: '领取签到奖励',
                onEnter: function (cb) {
                    customEventHelper.sendEvent(EVENT.PAUSE_THE_BATTLE);
                    cb();
                },
                onExit: function (cb) {
                    customEventHelper.sendEvent(EVENT.RESUME_THE_BATTLE);
                    cb();
                }
            }],

        3: [
            {
                log: "intro",
                command: sz.GuideCommand.GC_SHOW_MSG,
                string: '您的英雄会自动攻击敌人，您可以直接点击敌人对他造成伤害',
                onEnter: function (cb) {
                    customEventHelper.sendEvent(EVENT.PAUSE_THE_BATTLE);
                    cb();
                },
                onExit: function (cb) {
                    customEventHelper.sendEvent(EVENT.RESUME_THE_BATTLE);
                    cb();
                }
            },
            {
                log: "tap",
                command: sz.GuideCommand.GC_FINGER_HINT,
                locator: "main>enemy",
                textHint: '点击越快，造成的伤害越多',
                /*onLocateNode: function (node) {
                 customEventHelper.sendEvent(EVENT.PAUSE_THE_BATTLE);
                 },
                 onExit: function (cb) {
                 customEventHelper.sendEvent(EVENT.RESUME_THE_BATTLE);
                 cb();
                 },*/
                delayTime: 1
            },
            {
                log: "intro",
                command: sz.GuideCommand.GC_SHOW_MSG,
                string: '击败怪物之后，可以获得金币，钻石等资源，这些资源可以用来强化英雄的等级，技能和装备哦',
                delayTime: 1
            }],
        4: [
            {
                log: "intro",
                command: sz.GuideCommand.GC_SHOW_MSG,
                string: '点击英雄面板升级英雄，英雄升级后可以解锁高级技能和新的伙伴'
            },
            {
                log: "open hero view",
                command: sz.GuideCommand.GC_FINGER_HINT,
                locator: "main/tab>hero"
            },
            {
                log: "upgrade",
                command: sz.GuideCommand.GC_FINGER_HINT,
                locator: cc.rect(480, 500, 140, 70)
            }],
        5: [
            {
                log: "intro",
                command: sz.GuideCommand.GC_SHOW_MSG,
                string: '技能分为主动和被动技能，主动技能需要在战斗面板中释放，被动技能是一直生效的'
            },
            {
                log: "open hero view",
                command: sz.GuideCommand.GC_FINGER_HINT,
                locator: "main/tab>hero"
            },
            {
                log: "upgrade",
                command: sz.GuideCommand.GC_FINGER_HINT,
                locator: cc.rect(480, 390, 140, 70)
            }
        ],
        6: [
            {
                log: "intro",
                command: sz.GuideCommand.GC_SHOW_MSG,
                string: '让我们看看这个技能的威力吧'
            },
            {
                log: "open battle view",
                command: sz.GuideCommand.GC_FINGER_HINT,
                locator: "main/tab>main"
            },
            {
                log: "cast view",
                command: sz.GuideCommand.GC_FINGER_HINT,
                locator: "main/tab>skill_btn"
            },
            {
                log: "intro",
                command: sz.GuideCommand.GC_SHOW_MSG,
                string: '善用技能可以极大提升战斗力，升级技能可以提高技能威力和缩短冷却时间'
            }
        ],
        7: [
            {
                log: "intro",
                command: sz.GuideCommand.GC_SHOW_MSG,
                string: '金币不够可消耗钻石来摇钱树'
            },
            {
                log: "open shop view",
                command: sz.GuideCommand.GC_FINGER_HINT,
                locator: "main/tab>shop"
            },
            {
                log: "open tab",
                command: sz.GuideCommand.GC_FINGER_HINT,
                locator: "main/tab>moneyTree_tab"
            },
            {
                log: "intro",
                command: sz.GuideCommand.GC_SHOW_MSG,
                string: '摇摇手机即可得到金币哦'
            }
        ],
        8: [
            {
                log: "intro",
                command: sz.GuideCommand.GC_SHOW_MSG,
                string: '购买和升级装备可以大大提升英雄的战斗力'
            },
            {
                log: "open equip view",
                command: sz.GuideCommand.GC_FINGER_HINT,
                locator: "main/tab>equip"
            },
            {
                log: "buy equip",
                command: sz.GuideCommand.GC_FINGER_HINT,
                locator: cc.rect(480, 500, 140, 70)
            },
            {
                log: "intro",
                command: sz.GuideCommand.GC_SHOW_MSG,
                string: '每个英雄都有自己的专属装备哦，记得解锁英雄之后升级他的装备'
            },
            {
                log: "open battle view",
                command: sz.GuideCommand.GC_FINGER_HINT,
                locator: "main/tab>main"
            }
        ]


    },
    locateNodeDurationTime: 0.1,
    fingerImage: 'res/GuideHand.json',
    eventType: 2,
    isShowMask: false,  //默认为不打开
    isAutoGuide: false,  //自动引导
    isShowTouchPoint: true,
    isFingerAnimation: true
};
