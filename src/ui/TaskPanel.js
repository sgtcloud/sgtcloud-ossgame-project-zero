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
            this.loadingBar.setPercent(20);
        };

        this.showTask=function(name){
            for(var k in tabObj){
                tabObj[k]['box'].setVisible(false);
            }
            tabObj[name]['box'].setVisible(true);
            this.list.removeAllChildren(true);
            this.refreshItems(name);
        };
        this.showMenuLayer('everyDay_tab');
    },openPopup: function(){
        GamePopup.openPopup(this.layer,null,false);
    },refreshItems:function(tab){
        if('everyDay_tab'===tab){
            var service= sgt.DailyTaskService;
            service.getDailyTasks(player.id,function(result,data){
                if(result&&data){
                    for(var i= 0,j=data.length;i<j;i++){
                        this.pushTaskItem(data(i));
                    }
                }
            }.bind(this));
        }else
        if('achievement_tab'===tab){
            var service= sgt.AchievementService;
            service.getAllAchievements(function(result,data){
                if(result&&data){
                    for(var i= 0,j=data.length;i<j;i++){
                        this.pushTaskItem(data(i));
                    }
                }
            }.bind(this));
        }
    },pushTaskItem:function(task){
        var taskItem=this.taskview.clone();
        var desc=taskItem.getChildByName('text');
        desc.setString(task.description);
        var bar=taskItem.getChildByName('bar');
        var num=bar.getChildByName('num');
        num.setString(task.currentProgress);
        var bar_purple=bar.getChildByName('bar_purple');
        var bar_blue=bar.getChildByName('bar_blue');
        bar_blue.setVisible(false);
        var btn=taskItem.getChildByName('btn');
        var rewardBtn=btn.getChildByName('buy_btn');
        rewardBtn.addClickEventListener(function(){
            console.log('get reward')
        });
        bar_purple.setPercent(Math.floor(task.currentProgress/task.goal*100));
        this.list.pushBackCustomItem(taskItem);
    }
});
TaskPanel.open=function(){
    new TaskPanel().openPopup();
}
