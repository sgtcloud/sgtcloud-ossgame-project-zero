/**
 * Created by highkay on 2015/12/29.
 */

//竞技敌人英雄扩展类
var ArenaHeroUnit = BattleUnit.extend({

    getAnimateDelay: function () {
        return this.arenaHero.getAnimateDelay();
    },

    update: function (dt) {
        this._super(dt);
    },

    getLife: function () {
        return this.arenaHero.getCurrentLife();
    },
    isDead: function () {
        return this.arenaHero.getCurrentLife() <= 0;
    },
    getArenaHeroRandomSkill: function(){
        var len = this.arenaHero.getSkills().length;
        if(len > 0){
            return this.arenaHero.getSkills()[getRandomInt(0,len-1)];
        }
        return undefined;
    },

    onMove: function () {
        var target = this.battle.findRandomHero(this.arenaHero);
        if (target) {
            this.playAnimation('atk', false, function () {
                this.playAnimation("stand", true);
            }.bind(this));
            var rand = Math.random();
            var ctr_chance = this.arenaHero.getCtrChance();
            //cc.log("ctr:" + rand + "/" + ctr_chance);
            if (rand < ctr_chance) {
                customEventHelper.sendEvent(EVENT.SHOCK_BATTLE_FIELD, 2);
                target.doDamage(this.arenaHero.getAttack(), this.arenaHero.getCtrModify());
            } else {
                target.doDamage(this.arenaHero.getAttack());
            }
            //当前英雄血量低于总血量2/3时随机触发一个主动技能
            if(this.isCastSkill && this.arenaHero.getCurrentLife()/this.arenaHero.getMaxLife() * 3  > 1){
                this.isCastSkill = false;
                var randomSkill = this.getArenaHeroRandomSkill();
                if(randomSkill){
                    customEventHelper.sendEvent(EVENT.CAST_SKILL,{"id":this.player.id,"skill":randomSkill});
                }
            }
        }
    },
    changeLife: function (val) {
        this.arenaHero.changeLife(val);
    },
    onDamaged: function (dmg) {
        this._super(dmg);
        this.refreshLifeBar();
    },

    TOMBSTONE_ZORDER_OFFSET: 2,

    onDead: function (recover) {

        this.recover = recover || this.arenaHero.getRecover();
        //customEventHelper.sendEvent(EVENT.HERO_DIE, this.arenaHero);
        this.hideBuffIcons();
        this.refreshLifeBar();
        this.stopAllActions();
        var dropHeight = 500;
        var dropMove = cc.jumpBy(0.5, cc.p(0, -dropHeight), 0, 1);
        var jump = cc.jumpBy(0.5, cc.p(0, 0), 16, 3);
        this.tombstone.setVisible(true);
        this.tombstone.setPosition(0, dropHeight);
        this.tombstone.runAction(cc.sequence(dropMove, jump));
        this.battle.addSpriteRelatedNode(this, this.tombstone, this.TOMBSTONE_ZORDER_OFFSET);
        this.playAnimation("die", false, function () {
            this.runAction(cc.sequence(cc.fadeOut(0.5), cc.callFunc(function () {
                this.setVisible(false);
                this.arenaBattle = false;
                //如果是当前登陆角色的英雄dead 则挑战失败
                if(this.arenaHero.getId() == player.heroes[0].getId()){
                    customEventHelper.sendEvent(EVENT.LOSE_ARENA_BATTLE);
                }else{
                    customEventHelper.sendEvent(EVENT.WIN_ARENA_BATTLE);
                }
            }.bind(this), this)));
        }.bind(this));

    },

    getMaxLife: function () {
        return this.arenaHero.getLife();
    },

    isActive: function () {
        return !this.arenaHero.isLocked();
    },

    ctor: function (battle, player) {
        this._super(battle);
        this.player = player;
        this.arenaHero = new Hero(this.player.heroes[0]);
        this.isCastSkill = true;
        this.initSprite(res[this.arenaHero.getFile()], 'arenaHero', "stand");

        this.tombstone = CCSUnit.create(res.tombstone_json);
        this.tombstone.setVisible(false);
        this.refreshLifeBar();
    },

    onEnter: function () {
        this._super();
    }
});