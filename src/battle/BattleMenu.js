var MenuBtn = function(btn){
    this.button = btn.getChildByName('btn');
}
//UI的Menu父类
var BattleMenu = cc.Node.extend({
    ctor:function(battle,res){
        this._super();
        var layer = ccs.csLoader.createNode(res);
        this.addChild(layer);
        this.root = layer.getChildByName('root');

        //大部分Menu有显示玩家金钱的组件，但是位置不同，所以写了这个组件作为父类
        //这里是处理刷新金钱的显示
        this.playerGoldText = this.root.getChildByName('goldLayer').getChildByName('root').getChildByName('gold_text');
        this.refreshPlayerGoldText = function(){
            this.playerGoldText.setString(player.getGold());
        };

        this.onHeroDead = function(){}
        this.onHeroRecover = function(){}
    }
});
//UI上显示的技能ICON
var SkkillIcon = function(battle,root,index){
    this.button = root.getChildByName('skill_btn');
    this.deadTimeTitle = root.getChildByName('die_text');
    this.deadTimeText = root.getChildByName('die_time_text');
    this.coolTimeText = root.getChildByName('CD_time_text');

    this.deadTimeTitle.setVisible(false);
    this.deadTimeText.setVisible(false);
    this.coolTimeText.setVisible(false);

    this.button.addClickEventListener(function(){

    });

    this.setVisible = function(visit){
        root.setVisible(visit);
    }
    this.showDead = function(){
        this.deadTimeTitle.setVisible(true);
        this.deadTimeText.setVisible(true);
        this.coolTimeText.setVisible(false);
    }
    this.showCooldown = function(){
        this.deadTimeTitle.setVisible(false);
        this.deadTimeText.setVisible(false);
        this.coolTimeText.setVisible(true);
    }
    this.showActive = function(){
        this.deadTimeTitle.setVisible(false);
        this.deadTimeText.setVisible(false);
        this.coolTimeText.setVisible(false);
    }
    this.setDeadTime = function(time){
        this.deadTimeText.setString(time);
    }
    this.setCoolTime = function(time){
        this.coolTimeText.setString(time);
    }
}
var SkillListMenu = BattleMenu.extend({
    ctor:function(battle){
        this._super(battle,res.skill_layer_json);
        skills = [];
        for(var i=0;i<7;i++){
            var pane = this.root.getChildByName('skill'+(i+1)).getChildByName('root');
            var skill = new SkkillIcon(battle,pane,i);
            if(i < player.getHeroCount()){
                skill.setVisible(true);
            }else{
                skill.setVisible(false);
            }
            skills[i] = skill;
        }
        function format(time){
            return new Date(time).Format('mm:ss');
        }
        //为了显示CD和复活的时候显示的格式
        Date.prototype.Format = function (fmt) { //author: meizz
            var o = {
                "M+": this.getMonth() + 1, //�·�
                "d+": this.getDate(), //��
                "h+": this.getHours(), //Сʱ
                "m+": this.getMinutes(), //��
                "s+": this.getSeconds(), //��
                "q+": Math.floor((this.getMonth() + 3) / 3), //����
                "S": this.getMilliseconds() //����
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }

        this.refreshSkillState = function(){
            for(var i=0;i<7;i++) {
                skills[i].setVisible(false);
            }
            battle.foreachHeroSprite(function(hero,i){
                var skill = skills[i];
                skill.setVisible(true);
                if(hero.isDead()){
                    skill.showDead();
                }else{
                    if(hero.getCooldown() > 0){
                        skill.showCooldown();
                    }else{
                        skill.showActive();
                    }
                }
            });
        }

        this.update = function(dt){
            battle.foreachHeroSprite(function(hero,i){
                var skill = skills[i];
                if(hero.isDead()){
                    skill.setDeadTime(format(hero.getRecover()*1000));
                }else if(hero.getCooldown() > 0){
                    skill.setCoolTime(format(hero.getCooldown()*1000));
                }
            });
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
            var lv = root.getChildByName('level_text');
            var dps = root.getChildByName('dps_text');
            var stars = root.getChildByName('stars_fore');


            name.setString(hero.getName());
            lv.setString('Lv.'+hero.getLv());
            dps.setString(hero.getAttack());
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
        function buildSkillView(skill){
            var root = skillTemp.clone();
            var icon = root.getChildByName('skill_icon');
            var name = root.getChildByName('skillName_text');
            var desc = root.getChildByName('skill_text');
            var lv = root.getChildByName('skillLevel_text');

            name.setString(skill.getName());
            desc.setString(skill.getDesc());
            lv.setString(skill.getLv());

            return root;
        }

        this.views = {};
        {//填充英雄的列表 循环填充英雄+技能
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
            var icon =  root.getChildByName('hero_icon');
            var name =  root.getChildByName('heroName_text');
            var lv =  root.getChildByName('level_text');
            var dps =  root.getChildByName('dps_text');
            var tap =  root.getChildByName('tatk_text');

            name.setString(hero.getName());
            lv.setString(hero.getLv());
            dps.setString(hero.getAttack());
            tap.setString(hero.getHit());

            return root;
        }

        function buildEquipView(equip){
            var root = equipView.clone();
            var icon = root.getChildByName('equip_icon');
            var name = root.getChildByName('equipName_text');
            var desc = root.getChildByName('equipBuffDecs_text');
            var lv = root.getChildByName('equipLevel_text');

            name.setString(equip.getName());
            desc.setString(equip.getDesc());
            lv.setString(equip.getLv());

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
                    var _equipView = buildEquipView(equipData);
                    this.heroList.addChild(_equipView);

                    _heroView.equips = _heroView.equips || [];
                    _heroView.equips[j] = _equipView;
                }
            }
        }
    }
});