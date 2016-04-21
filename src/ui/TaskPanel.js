/**
 * Created by Administrator on 2016/4/20.
 */

var TaskPanel=cc.Class.extend({
    ctor:function(){
        this.layer=ccs.csLoader.createNode(res.task_layer_json);
        this.taskview=ccs.csLoader.createNode(res.task_view_json).getChildByName('root');
        var root=this.layer.getChildByName('root');
        var tab=root.getChildByName('tab');
        var tabParams = [
            {name: "everyDay_tab"},
            {name: "achievement_tab"}
        ];

        var bar=root.getChildByName('bar');
        this.achevementBox=bar.getChildByName('achievementBox');
        this.everyDayBox=bar.getChildByName('everyDayBox');
        var tabObj={
            'everyDay_tab':{'box':this.everyDayBox},
            'achievement_tab':{'box':this.achevementBox}
        };
        this.loadingBar=bar.getChildByName('bar_yellow');
        this.list=root.getChildByName('list');
        this.list.pushBackCustomItem(this.taskview.clone());
        this.buttons = {};
        for (var i in tabParams) {
            var param = tabParams[i];
            var name = param.name;
            this.buttons[name] = tab.getChildByName(name);
            if (i == 0)
                this.buttons[name].setSelected(true);
            else
                this.buttons[name].setSelected(false);
            this.buttons[name].addEventListener(function(sender,type){
                if (type === ccui.CheckBox.EVENT_SELECTED) {
                    this.showMenuLayer(sender.name);
                }
                else if (type === ccui.CheckBox.EVENT_UNSELECTED) {
                    sender.setSelected(true);
                }
            }.bind(this), this);
        }

        var n = 0;
        this.showMenuLayer = function (name) {
            for (var i in this.buttons) {
                this.buttons[i].setSelected(false);
            }
            this.showTask(name);
            this.buttons[name].setSelected(true);
            this.loadingBar.setPercent(10);
        };

        this.showTask=function(name){
            for(var k in tabObj){
                tabObj[k]['box'].setVisible(false);
            }
            tabObj[name]['box'].setVisible(true);

        }

    },openPopup: function(){
        GamePopup.openPopup(this.layer,null,false);
    }
});
TaskPanel.open=function(){
    new TaskPanel().openPopup();
}
