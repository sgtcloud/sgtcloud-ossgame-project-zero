/**
 * Created by highkay on 2015/12/29.
 */

//竞技敌人英雄扩展类
var ArenaHeroUnit = HeroUnit.extend({

    getArenaHeroRandomSkill: function(){
        var skills = this.hero.getSkills();
        var result = [];
        for(var i in skills){
            if (skills[i].getType() === 1 && skills[i].getLv() > 0) {
                result.push(skills[i]);
            }
        }

        var len = result.length;
        if(len > 0){
            return result[getRandomInt(0,len-1)];
        }
        return undefined;
    },

    onMove: function () {
        var target ;
        if (this.playerId === player.id) {
            target = this.battle.findRandomEnemy();
        }else {
            target = this.battle.findRandomHero();
        }

        if (target) {
            this.moveHandle(target);
            //当前英雄血量低于总血量3/5时随机触发一个主动技能
            if(this.isCastSkill && this.getLife()/this.getMaxLife() * 5  < 3){
                this.isCastSkill = false;
                var randomSkill = this.getArenaHeroRandomSkill();
                //console.log("randomSkill==============================="+JSON.stringify(randomSkill));
                if(randomSkill){
                    customEventHelper.sendEvent(EVENT.CAST_SKILL,{"id":this.playerId,"skill":randomSkill});
                }
            }
        }
    },
    onDamaged: function (dmg) {
        this._super(dmg);
        if(player.id != this.playerId){
            this.battle.updateEnemyLife();
        }
    },
    onClear: function () {
        this._super();
        this.tombstone.removeFromParent(this);
        for(var i in this.buffIcons){
            this.removeBuff(this.buffIcons[i]);
        }
    },

    onDead: function () {
        this.deadHandle();
        this.battle.onEnemyDead();
    },

    ctor: function (battle, arenaHero) {
        this._super(battle,arenaHero);
        this.isCastSkill = true;
        this.playerId = arenaHero._playerId;

        if(this.playerId != player.id){
            this.setScale(-1, 1);
        }

    },
    bindListeners: function(){
        //竞技场不需要英雄绑定事件
    },
    onEnter: function () {
        this._super();
    }
});