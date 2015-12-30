/**
 * Created by highkay on 2015/12/29.
 */

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
        };
        this.onDamaged = function () {
            battle.updateEnemyLife();
        };
        this.onDead = function () {
            var a = cc.delayTime(0.5);
            var b = cc.fadeTo(0.5, 0);
            var c = cc.callFunc(this.onVanish, this);
            this.node.runAction(cc.sequence(a, b, c));
            battle.onEnemyDead(this);
        };
        //敌人消失后被调用
        this.onVanish = function () {
            this.countLoot();
            this.removeFromParent(true);
            battle.onEnemyVanish(this);
        };
        this.countLoot = function () {
            var bonus = this.getBonus();
            var loot = Loot.createFromPool(bonus.unit, bonus.value);
            this.getParent().addChild(loot);
            loot.fire();
        };
        //获取杀死后的奖励
        this.getBonus = function () {
            return data.getBonus();
        }
    }
});
