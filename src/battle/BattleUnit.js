//伤害数字类
var DamageNumber = cc.Node.extend({
    ctor: function (val, ctr) {
        this._super();
        this.text = new cc.LabelTTF(Math.round(val), "Arial");
        this.text.setAnchorPoint(0.5, 0.5);
        this.addChild(this.text);

        this.scaleLarge = cc.scaleTo(0.2, 2, 2);
        this.scaleBack = cc.scaleTo(0.1, 1, 1);

        this.moveUp = cc.moveBy(0.5, 0, 60);
        this.disappare = cc.callFunc(function () {
            this.removeFromParent(true);
            cc.pool.putInPool(this);
        }, this);
        this.initData(val, ctr);
    },

    initData: function (val, ctr) {
        this.size = ctr ? 40 : 20;
        this.text.setString(Math.round(val));
        if (ctr) {
            this.text.color = cc.color(255, 100, 100);
        } else {
            this.text.color = cc.color(255, 200, 200);
        }
    },

    unuse: function () {
        this.setVisible(false);
    },

    reuse: function (val, ctr) {
        this.setVisible(true);
        this.initData(val, ctr);
    },

    fire: function () {
        this.runAction(cc.spawn(cc.sequence(this.scaleLarge, this.scaleBack), cc.sequence(this.moveUp, this.disappare)));
    }
});

DamageNumber.createFromPool = function (val, ctr) {
    var pool = cc.pool;
    if (pool.hasObject(DamageNumber)) {
        return pool.getFromPool(DamageNumber, val, ctr);
    } else {
        return new DamageNumber(val, ctr);
    }
}

DamageNumber.initPool = function () {
    for (var i = 0; i < 32; i++) {
        cc.pool.putInPool(new DamageNumber());
    }
}

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
            return data.getLife();
        }

        {//data
            this.attack = data.getAttack();
            this.life = data.getLife();
            //设置生命值
            this.changeLife = function (val) {
                this.life += val;
                if (this.life < 0) {
                    this.life = 0;
                }
            }
            //重置复位单位的生命值，动画 ，复活时使用
            this.reset = function () {
                this.animateTime = 0;
                this.playAnimation('stand');
            }
        }
        //调用显示伤害值
        this.showDamageNumber = function (val, ctr) {
            var dmg = DamageNumber.createFromPool(val, ctr);
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
        }
        //执行攻击时被调用 为了扩展
        this.onAttacked = function () {
            console.log("Unit Attack");
        }
        //受到伤害时被调用 为了扩展
        this.onDamaged = function () {
            console.log("Unit Damage");
        }
        //死亡时被调用 为了扩展
        this.onDead = function () {
            console.log("Unit Dead");
        }
        //从精灵组里被删除时调用
        this.onClear = function () {
            this.removeFromParent(true);
        }
        //执行伤害的函数
        this.doDamage = function (dmg, ctr) {
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
        //执行动画
        this.playAnimation = function (name) {
            this.animateState = name;
            this.animation.play(name, false);
        }
        //搜索攻击目标 扩展
        this.onFindTarget = function () {

        }
        //死亡后的更新track，扩展
        this.onUpdateDead = function (dt) {

        }
        //动画更新函数
        this.onUpdateAnimate = function (dt) {
            if (!this.animation.isPlaying()) {
                switch (this.animateState) {
                    case 'dead':
                        break;
                    case 'die':
                        this.playAnimation('dead');
                        break;
                    default:
                        this.playAnimation('stand');
                        break;
                }
            }
        }

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
    }
});

//英雄扩展类
var HeroUnit = BattleUnit.extend({
    ctor: function (battle, data, hero) {
        this._super(battle, data, BattleConsts.Camp.Player);
        this.recover = 0;
        this.cooldown = 0;

        //血条的NODE
        var lifeNode = ccs.csLoader.createNode(res.hero_blood_json);
        lifeNode.setAnchorPoint(0.5, 0.5);
        this.addChild(lifeNode);

        //血条组件的引用
        this.lifeBar = lifeNode.getChildByName('root').getChildByName('blood_bar');
        //刷新刷条
        this.refreshLifeBar = function () {
            var max = this.data.getLife();
            this.lifeBar.setPercent(hero.life / max * 100);
        }
        this.getLife = function () {
            return hero.life;
        };
        this.isDead = function () {
            return hero.life <= 0;
        }
        this.onAttacked = function () {
            var target = battle.findNextEnemy();
            if (target) {
                this.playAnimation('atk');
                if (Math.random() < this.data.getCtrChance()) {
                    target.doDamage(this.attack, this.data.getCtrModify());
                } else {
                    target.doDamage(this.attack);
                }
            }
        }
        this.changeLife = function (val) {
            hero.life += val;
            if (hero.life < 0) {
                hero.life = 0;
            }
        }
        this.onDamaged = function () {
            this.refreshLifeBar();
        }
        this.onDead = function () {
            this.recover = data.getRecover();
            battle.onHeroDead(this);
            //var lost = battle.checkPlayerLost();
            //if(lost){
            //  battle.resetBattle();
            //}
        }
        //复活时被调用的
        this.onRecover = function () {
            this.changeLife(this.getMaxLife());
            this.reset();
            this.refreshLifeBar();
            battle.onHeroRecover(this);
        }
        //使用主动技能时被调用
        this.onUseSkill = function () {

        }
        //复活的当前时间
        this.getRecover = function () {
            return this.recover;
        }
        //技能的当前CD
        this.getCooldown = function () {
            return this.cooldown;
        }
        //复活倒计时逻辑
        this.onUpdateDead = function (dt) {
            this.recover = Math.max(0, this.recover - dt);
            if (this.recover <= 0) {
                this.onRecover();
            }
        }
        this.isActive = function () {
            return !data.isLocked();
        }
        this.refreshLifeBar();
    }
});

var EnemyUnit = BattleUnit.extend({
    ctor: function (battle, data) {
        this._super(battle, data, BattleConsts.Camp.Enemy);
        this.node.setScale(-1, 1);
        this.onAttacked = function () {
            var target = battle.findRandomHero();
            if (target) {
                this.playAnimation('atk');
                target.doDamage(this.attack);
            }
        }
        this.onDamaged = function () {
            battle.updateEnemyLife();
        }
        this.onDead = function () {
            var a = cc.delayTime(0.5);
            var b = cc.fadeTo(0.5, 0);
            var c = cc.callFunc(this.onVanish, this);
            this.node.runAction(cc.sequence(a, b, c));
            battle.onEnemyDead(this);
        }
        //敌人消失后被调用
        this.onVanish = function () {
            this.removeFromParent(true);
            battle.onEnemyVanish(this);
        }
        //获取杀死后的奖励
        this.getBonus = function () {
            return data.getBonus();
        }
    }
});

