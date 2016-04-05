var ArenaPlayerData = PlayerDataClass.extend({

    ctor: function(){
        this._super();
    },
    init: function (_player) {
        this._player= _player;
        this.initPlayerData();
    },
    initPlayerData: function(){
        this.heroes = [];
        var id = this.getPlayerId();
        for (var i in this._player.heroes) {
            this.heroes.push(new ArenaHero(this._player.heroes[i],id));
        }
        this.refreshGlobeProps();
    }
});
