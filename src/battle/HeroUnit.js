/**
 * Created by highkay on 2015/12/29.
 */

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
        };
        this.getLife = function () {
            return hero.life;
        };
        this.isDead = function () {
            return hero.life <= 0;
        };
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
        };
        this.changeLife = function (val) {
            hero.life += val;
            if (hero.life < 0) {
                hero.life = 0;
            }
        };
        this.onDamaged = function () {
            this.refreshLifeBar();
        };
        this.onDead = function () {
            this.recover = data.getRecover();
            battle.onHeroDead(this);
            //var lost = battle.checkPlayerLost();
            //if(lost){
            //  battle.resetBattle();
            //}
        };
        //复活时被调用的
        this.onRecover = function () {
            this.changeLife(this.getMaxLife());
            this.reset();
            this.refreshLifeBar();
            battle.onHeroRecover(this);
        };
        //使用主动技能时被调用
        this.onUseSkill = function () {

        };
        //复活的当前时间
        this.getRecover = function () {
            return this.recover;
        };
        //技能的当前CD
        this.getCooldown = function () {
            return this.cooldown;
        };
        //复活倒计时逻辑
        this.onUpdateDead = function (dt) {
            this.recover = Math.max(0, this.recover - dt);
            if (this.recover <= 0) {
                this.onRecover();
            }
        };
        this.isActive = function () {
            return !data.isLocked();
        };
        this.refreshLifeBar();
    }
});