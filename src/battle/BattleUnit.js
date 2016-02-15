//战斗单位逻辑类，英雄和敌人的父类
var BattleUnit = Unit.extend({

    ctor: function (battle, data, camp) {
        this._super();
        this.battle = battle;
        this.data = data;
        this.initSprite(this.data.getFile());
        this.playAnimation("stand");
        this.moveCounter = 0;

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
                this.moveCounter = 0;
                this.playAnimation('stand');
            }
        }
        //调用显示伤害值
        this.showDamageNumber = function (val, ctr) {
            var dmg = DamageNumber.create(val, ctr);
            dmg.setPosition(cc.p(0, 64));
            dmg.fire(this);
        };
        //判断是否死亡
        this.isDead = function () {
            return this.life <= 0;
        };
        this.getLife = function () {
            return this.life;
        };
        //执行攻击时被调用 为了扩展
        this.onMove = function () {
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
                if (camp === BattleConsts.Camp.Enemy && dmg > 0) {
                    player.statistics.total_damage += dmg;
                }
                this.onDamaged();
                if (this.isDead()) {
                    this.state = UNIT_STATE_DEAD;
                    this.onDead();
                } else {
                    this.playAnimation('hit');
                }
            }
        };
        //死亡后的更新track，扩展
        this.onUpdateDead = function (dt) {

        };

        this.update = function (dt) {

            {//animate
                var moveInterval = this.data.getAnimateDelay();
                if (moveInterval > 0) {
                    this.moveCounter += dt;
                    while (this.moveCounter >= moveInterval) {
                        this.moveCounter -= moveInterval;
                        this.onMove();
                    }
                }
            }
        };
        this.reset();
        this.scheduleUpdate();
        //this.runAction(cc.sequence(cc.delayTime(Math.random()*10),cc.callFunc(this.scheduleUpdate(),this)));
    }
});


