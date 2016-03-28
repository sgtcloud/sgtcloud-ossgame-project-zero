var ArenaPlayerData = PlayerDataClass.extend({

    ctor: function(){
        this._super();
    },
    initHeroes: function () {
        for (var i in this.player.heroes) {
            this.heroes.push(new ArenaHero(this.player.heroes[i],this));
        }
    }


});
