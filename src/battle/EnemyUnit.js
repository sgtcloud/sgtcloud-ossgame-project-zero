/**
 * Created by highkay on 2015/12/29.
 */

var EnemyUnit = BattleUnit.extend({
    ctor: function (battle, data) {
        this._super(battle, data, BattleConsts.Camp.Enemy);
        this.node.setScale(-1, 1);
        this.onMove = function () {
            var target = battle.findRandomHero();
            if (target) {
                this.playAnimation('atk', false, function () {
                    this.playAnimation("stand", true);
                }.bind(this));
                target.doDamage(this.attack);
            }
        };
        this.onDamaged = function () {
            battle.updateEnemyLife();
        };
        this.onDead = function () {
            this.playAnimation("die", false, function () {
                this.generateLoot();
                var a = cc.delayTime(0.5);
                var b = cc.fadeTo(0.5, 0);
                var c = cc.callFunc(this.onVanish, this);
                this.runAction(cc.sequence(a, b, c));
            });
            battle.onEnemyDead(this);
        };
        //敌人消失后被调用
        this.onVanish = function () {
            this.remove();
            battle.onEnemyVanish(this);
        };
        this.generateLoot = function () {
            Loot.generateLoots(this.getBonus(), this.parent.convertToWorldSpace(this.getPosition()));
        };
        //获取杀死后的奖励
        this.getBonus = function () {
            return data.getBonus();
        };
    }
});
