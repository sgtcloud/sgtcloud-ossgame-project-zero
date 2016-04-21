/**
 * Created by peisy on 2016/04/21.
 */
var BtnListPanel = cc.Class.extend({
    ctor: function (topPanel) {
        this.btnListLayer = ccs.csLoader.createNode(res.function_list_layer);
        this.ready = true;
        this.root = this.btnListLayer.getChildByName('Panel_4');
        this.root.setPosition(cc.p(640,10));
        topPanel.addChild(this.btnListLayer);
    },
    show: function(){
        var moveTo = cc.moveTo(0.5,cc.p(this.root.getPositionX()-this.root.width-50,this.root.getPositionY()));
        this.play(moveTo);
    },
    hide: function(){
        var moveTo = cc.moveTo(0.5,cc.p(this.root.getPositionX()+this.root.width+50,this.root.getPositionY()));
        this.play(moveTo);
    },
    play: function(moveTo){
        if(this.ready){
            this.ready = false;
            this.root.runAction(cc.sequence(moveTo,cc.callFunc(function () {
                this.ready = true;
            }.bind(this), this)));
        }
    }
});