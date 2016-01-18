//战斗单位容器 英雄和敌人的父类
var BattleUnit = cc.Node.extend({
    ctor: function (battle, data, camp) {
        this._super();
        this.battle = battle;
        this.data = data;
        this.animateTime = 0;
        this.animateState = 'stand';
        var json = ccs.load(res[this.data.getFile()]);
        this.node = json.node;
        this.animation = json.action;
        this.addChild(this.node);
        {
            //去除CCS导出文件位移会自带缓动效果的问题
            var timelines = this.animation.getTimelines();
            removeCCSAnimationDefaultTween(timelines);
        }
        this.node.runAction(this.animation);

        this.getMaxLife = function () {
            return this.data.getLife();
        };

        {//data
            this.attack = this.data.getAttack();
            this.life = this.data.getLife();
            //设置生命值
            this.changeLife = function (val) {
                this.life += val;
                if (this.life < 0) {
                    this.life = 0;
                }
            };
            //重置复位单位的生命值，动画 ，复活时使用
            this.reset = function () {
                this.animateTime = 0;
                this.playAnimation('stand');
            }
        }
        //调用显示伤害值
        this.showDamageNumber = function (val, ctr) {
            var dmg = DamageNumber.create(val, ctr);
            dmg.setPosition(0, 64);
            this.addChild(dmg);
            dmg.fire();
        };
        //判断是否死亡
        this.isDead = function () {
            return this.life <= 0;
        };
        this.getLife = function () {
            return this.life;
        };
        //判断是否激活
        this.isActive = function () {
            return true;
        };
        //执行攻击时被调用 为了扩展
        this.onAttacked = function () {
            console.log("Unit Attack");
        };
        //受到伤害时被调用 为了扩展
        this.onDamaged = function () {
        };
        //死亡时被调用 为了扩展
        this.onDead = function () {
            console.log("Unit Dead");
        };
        //从精灵组里被删除时调用
        this.onClear = function () {
            this.removeFromParent(true);
        };
        //执行伤害的函数
        this.doDamage = function (dmg, ctr) {
            // prevent to be kill twice
            if (!this.isDead()) {
                if (ctr) {
                    dmg *= ctr;
                }
                this.changeLife(-dmg);
                this.showDamageNumber(dmg, ctr);
                this.onDamaged();
                if (this.isDead()) {
                    this.playAnimation('die');
                    this.onDead();
                } else {
                    this.playAnimation('hit');
                }
            }
        };
        //执行动画
        this.playAnimation = function (name) {
            this.animateState = name;
            this.animation.play(name, false);
        };
        //搜索攻击目标 扩展
        this.onFindTarget = function () {

        };
        //死亡后的更新track，扩展
        this.onUpdateDead = function (dt) {

        };
        this.whileDying = false;
        //动画更新函数
        this.onUpdateAnimate = function (dt) {
            if (!this.animation.isPlaying()) {
                switch (this.animateState) {
                    case 'dead':
                        this.whileDying = false;
                        break;
                    case 'die':
                        if (camp === BattleConsts.Camp.Player && !this.whileDying) {
                            var srcPos = this.getPosition();
                            var dropHeight = 500;
                            var dropMove = cc.jumpTo(0.2, srcPos, 0, 1);
                            var jump = cc.jumpBy(0.5, cc.p(0, 0), 16, 3);
                            this.runAction(cc.sequence(cc.fadeOut(0.5), cc.callFunc(function () {
                                this.setPosition(srcPos.x, srcPos.y + dropHeight);
                                this.playAnimation('dead');
                            }, this), cc.fadeIn(0.2), dropMove, jump));
                            this.whileDying = true;
                        }
                        break;
                    default:
                        this.playAnimation('stand');
                        break;
                }
            }
        };

        this.update = function (dt) {
            this.onUpdateAnimate(dt);
            if (this.isDead()) {
                this.onUpdateDead(dt);
                return;
            }

            {//animate
                var animateDelay = this.data.getAnimateDelay();
                if (animateDelay > 0) {
                    this.animateTime += dt;
                    while (this.animateTime >= animateDelay) {
                        this.animateTime -= animateDelay;
                        this.onAttacked();
                    }
                }
            }
        };
        this.reset();
        this.scheduleUpdate();
        //this.runAction(cc.sequence(cc.delayTime(Math.random()*10),cc.callFunc(this.scheduleUpdate(),this)));
    }
});


