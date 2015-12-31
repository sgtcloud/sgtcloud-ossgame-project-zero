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
            this.generateLoot();
            this.removeFromParent(true);
            battle.onEnemyVanish(this);
        };
        this.generateLoot = function () {
            var bonus = this.getBonus();
            var value = bonus.value;
            var lootSprites = [];
            if (value == 1) {
                lootSprites.push(new Loot(bonus.unit, "little"));
            } else if (value > 1 && value <= 5) {
                this.createLootSprites(lootSprites, 3, "little", bonus);
            } else if (value > 5 && value <= 10) {
                this.createLootSprites(lootSprites, 5, "little", bonus);
            } else if (value > 10 && value <= 50) {
                lootSprites.push(new Loot(bonus.unit, "some"));
                this.createLootSprites(lootSprites, 10, "little", bonus);
            } else if (value > 50 && value <= 100) {
                lootSprites.push(new Loot(bonus.unit, "amount"));
                this.createLootSprites(lootSprites, 5, "little", bonus);
            } else if (value > 100 && value <= 500) {
                lootSprites.push(new Loot(bonus.unit, "huge"));
                this.createLootSprites(lootSprites, 10, "little", bonus);
            } else if (value > 500 && value <= 1000) {
                lootSprites.push(new Loot(bonus.unit, "some"));
                lootSprites.push(new Loot(bonus.unit, "huge"));
                this.createLootSprites(lootSprites, 15, "little", bonus);
            } else if (value > 1000 && value <= 5000) {
                lootSprites.push(new Loot(bonus.unit, "amout"));
                lootSprites.push(new Loot(bonus.unit, "huge"));
                this.createLootSprites(lootSprites, 20, "little", bonus);
            } else {
                lootSprites.push(new Loot(bonus.unit, "some"));
                lootSprites.push(new Loot(bonus.unit, "amout"));
                lootSprites.push(new Loot(bonus.unit, "huge"));
                this.createLootSprites(lootSprites, 20, "little", bonus);
            }
            for (var i in lootSprites) {
                lootSprites[i].setPosition(this.getPosition());
                this.getParent().addChild(lootSprites[i]);
                lootSprites[i].fire();
            }
        };
        //获取杀死后的奖励
        this.getBonus = function () {
            return data.getBonus();
        };
        this.createLootSprites = function (lootSprites, num, size, bonus) {
            for (var i = 0; i < num; i++) {
                lootSprites.push(new Loot(bonus.unit, size));
                if (i == num - 1) {
                    lootSprites.push(new Loot(bonus.unit, size, bonus));
                }
            }
        }
    }
});
