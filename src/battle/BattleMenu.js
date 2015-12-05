var BattleMenu = cc.Node.extend({
    ctor:function(battle,res){
        this._super();
        var layer = ccs.csLoader.createNode(res);
        this.addChild(layer);
        this.root = layer.getChildByName('root');

        this.playerGoldText = this.root.getChildByName('goldLayer').getChildByName('root').getChildByName('gold_text');
        this.refreshPlayerGoldText = function(){
            this.playerGoldText.setString(player.getGold());
        };
    }
});
var SkillListMenu = BattleMenu.extend({
    ctor:function(battle){
        this._super(battle,res.skill_layer_json);
        this.skills = [];
        for(var i=0;i<7;i++){
            var pane = this.root.getChildByName('skill'+(i+1)).getChildByName('root');
            var skill = {};
            skill.root = pane;
            skill.button =pane.getChildByName('skill_btn');
            skill.deadTimeTitle = pane.getChildByName('die_text');
            skill.deadTimeText = pane.getChildByName('die_time_text');
            skill.coolTimeText = pane.getChildByName('CD_time_text');
            if(i < player.getHeroCount()){
                skill.root.setVisible(true);
            }else{
                skill.root.setVisible(false);
            }
            skill.deadTimeTitle.setVisible(false);
            skill.deadTimeText.setVisible(false);
            skill.coolTimeText.setVisible(true);
            this.skills[i] = skill;
        }
        function format(time){
            return new Date(time).Format('mm:ss');
        }

        Date.prototype.Format = function (fmt) { //author: meizz
            var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }

        this.refreshSkillState = function(){
            for(var i=0;i<7;i++) {
                if (i < player.getHeroCount()) {
                    var hero = battle.heroSprites[i];
                    var skill = this.skills[i];

                    if(hero.isDead()){
                        skill.deadTimeTitle.setVisible(true);
                        skill.deadTimeText.setVisible(true);
                        skill.coolTimeText.setVisible(false);
                    }else{
                        if(hero.getCooldown() > 0){
                            skill.deadTimeTitle.setVisible(false);
                            skill.deadTimeText.setVisible(false);
                            skill.coolTimeText.setVisible(true);
                        }else{
                            skill.deadTimeTitle.setVisible(false);
                            skill.deadTimeText.setVisible(false);
                            skill.coolTimeText.setVisible(false);
                        }
                    }
                }
            }

        }


        this.update = function(dt){
            for(var i=0;i<7;i++){
                if(i < player.getHeroCount()){
                    var hero = battle.heroSprites[i];
                    var skill = this.skills[i];
                    if(hero.isDead()){
                        skill.deadTimeText.setString(format(hero.getRecover()*1000));
                    }else{
                        if(hero.getCooldown() > 0) {
                            skill.coolTimeText.setString(format(hero.getCooldown()*1000));
                        }
                    }
                }
            }
        }
        this.onHeroDead = function(_hero){
            this.refreshSkillState();
        }
        this.onHeroRecover = function(hero){
            this.refreshSkillState();
        }
        this.refreshSkillState();

        this.scheduleUpdate();
    }
});


var HeroListMenu = BattleMenu.extend({
    ctor:function(battle){
        this._super(battle,res.hero_layer_json);

        this.heroList = this.root.getChildByName('hero_list');

        var heroTemp = ccs.csLoader.createNode(res.hero_view_json).getChildByName('root');
        var skillTemp = ccs.csLoader.createNode(res.skill_view_json).getChildByName('root');

        function buildHeroView(hero){
            var root = heroTemp.clone();
            var name = root.getChildByName('heroName_text');
            name.setString(hero.getName());

            var lv = root.getChildByName('level_text');
            lv.setString('Lv.'+hero.getLv());

            var dps = root.getChildByName('dps_text');
            dps.setString(hero.getAttack());

            var stars = root.getChildByName('stars_fore');
            for(var i=0;i<5;i++){
                //var star = stars.getChildByName('icon0');
                //if(i<hero.getStar()){
                //  star.setVisible(true);
                //}else{
                //  star.setVisible(false);
                //}
            }

            return root;
        }
        function buildSkillView(skillData){
            var root = skillTemp.clone();
            return root;
        }

        this.views = {};
        {
            for(var i=0;i<player.getHeroCount();i++){
                var heroData = player.getHeroData(i);
                var _heroView = buildHeroView(heroData);
                this.heroList.addChild(_heroView);

                this.views.heros = this.views.heros || [];
                this.views.heros[i] = _heroView;

                for(var j=0;j<heroData.getSkillCount();j++){
                    var skillData = heroData.getSkillData(j);
                    var _skillView = buildSkillView(skillData);
                    this.heroList.addChild(_skillView);

                    _heroView.skills = _heroView.skills || [];
                    _heroView.skills[j] = _skillView;
                }
            }
        }
    }
});


var EquipListMenu = BattleMenu.extend({
    ctor:function(battle){
        this._super(battle,res.equip_layer_json);

        this.heroList = this.root.getChildByName('equip_list');

        var heroView = ccs.csLoader.createNode(res.equip_hero_view_json).getChildByName('root');
        var equipView = ccs.csLoader.createNode(res.equip_view_json).getChildByName('root');

        function buildHeroView(hero){
            var root = heroView.clone();
            return root;
        }

        this.views = {};
        {

            for(var i=0;i<player.getHeroCount();i++){
                var heroData = player.getHeroData(i);
                var _heroView = buildHeroView(heroData);
                this.heroList.addChild(_heroView);

                this.views.heros = this.views.heros || [];
                this.views.heros[i] = _heroView;

                for(var j=0;j<heroData.getEquipCount();j++){
                    var equipData = heroData.getEquipData(j);
                    var _equipView = equipView.clone();
                    this.heroList.addChild(_equipView);

                    _heroView.equips = _heroView.equips || [];
                    _heroView.equips[j] = _equipView;
                }
            }
        }
    }
});