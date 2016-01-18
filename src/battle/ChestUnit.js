/**
 * Created by highkay on 2015/12/29.
 */

var ChestUnit = cc.Node.extend({
    ctor: function () {
        this._super();
        var json = ccs.load(res.chest03_json);
        this.node = json.node;
        this.animation = json.action;
        this.animationState = 'close';
        var chest = this.node.getChildByName("chest03");
        {
            //去除CCS导出文件位移会自带缓动效果的问题
            var timelines = this.animation.getTimelines();
            removeCCSAnimationDefaultTween(timelines);
        }
        this.node.runAction(this.animation);
        this.initChest();
        var self = this;
        this.bindClickFairyEvent = function () {
            var listener = cc.EventListener.create({
                event: cc.EventListener.MOUSE,
                swallowTouches: true,
                onMouseDown: function (touch, event) {
                    //self.FairyUnit.convert
                    if(self.animationState == 'close'){
                        var touchPosition = chest.convertToNodeSpace(touch.getLocation());
                        var s = chest.getContentSize();
                        var rect = cc.rect(0, 0, s.width, s.height);
                        if (cc.rectContainsPoint(rect, touchPosition)) {
                            cc.log("获取金币");
                            self.stopAllActions();
                            self.playAnimation('open',false);
                            self.onOpenChest();
                        }
                        return true;
                    }
                    return false;

                },
            });
            cc.eventManager.addListener(listener, this);
        };
        this.bindClickFairyEvent();
        this.addChild(this.node);
    },
    playAnimation: function (name, falg) {
        this.animation.play(name, falg);
    },
    initChest: function(){
        var jumpPos = cc.p(Math.random() * 108 - 54, Math.random() * 36 - 16);
        this.appear = cc.jumpBy(0.2, jumpPos, 24, 1);
        var dropMove = cc.jumpTo(2, cc.p(280,250), 0, 3);
        var delay = cc.delayTime(5);

        var removeNode = cc.callFunc(function () {
            //打开
            this.playAnimation('open',false);
            this.onOpenChest();
            //this.removeFromParent(true);
        }, this);
        this.runAction(cc.sequence(this.appear,cc.delayTime(1),/*dropMove,*/ delay, removeNode));
    },
    generateLoot: function (rate) {
        var pos = cc.p(this.getPositionX() + this.getParent().getPositionX(), this.getPositionY() + this.getParent().getPositionY());
        var rank = PlayerData.getStageData().getOfflineRewardByUnit("gold");
        Loot.generateLoots({
            "unit":"gold",
            "value":(rank.value * rate)
        }, pos);
    },
    onOpenChest: function(){
        this.animationState = 'open';
        var a = cc.delayTime(0.5);
        var b = cc.fadeTo(0.5, 0);
        this.node.runAction(cc.sequence(cc.callFunc(function(){
            /*this.sk1001 = 0;
            this.sk1003 = 0;
            this.sk1004 = 0;
            this.gold = 0;
            for(var i = 0;i < 100;i++){*/
                this.getRandomEvent();
            //}

            //cc.log("sk1001:"+this.sk1001+" , sk1003:" +this.sk1003 +" , sk1004"+this.sk1004+" , gold"+this.gold);
        },this),a,b, cc.callFunc(function () {
            this.removeFromParent(true);
        }, this)));

        /*var random = getRandomInt(0,10);//Math.floor(Math.random()*10);
        if(random == 0){
            //45s内金币掉落2倍；
        }else if(random == 1){
            //秒伤15s内2倍伤害；
        }else if(random == 2){
            //30s内点击怪物掉落怪物金币的 20% 5% 80% 15%
        }else{
            //金子
            this.generateLoot();
        }*/
    },
    getRandomEvent: function(){
        var events = CONSTS.click_chest_random_events;
        var total_weight = 0;
        for(var i in events){
            total_weight += events[i].weight;
        }
        var random = getRandomInt(1,total_weight);
        var temp_weight = 0;
        for(var i in events){
            var event = events[i];
            temp_weight += event.weight;
            if(random < temp_weight){
                if(event.skill_id == 'gold'){
                    this.generateLoot(event.level);
                }else{
                    //发送释放buff事件
                    customEventHelper.sendEvent(EVENT.CAST_BUFF,{
                        skillId:event.skill_id,
                        level:event.level
                    });
                }
                /*if(event.skill_id == 'sk1001'){
                    this.sk1001 += 1;
                }else if(event.skill_id == 'sk1003'){
                    this.sk1003 += 1;
                }else if(event.skill_id == 'sk1004'){
                    this.sk1004 += 1;
                }else{
                    this.gold += 1;
                }*/
                cc.log(event.weight + " , "+event.skill_id +" , "+event.level);
                this.parent.reset();
                break;
            }
        }
    }


});
