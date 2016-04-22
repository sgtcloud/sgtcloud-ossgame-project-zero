/**
 * Created by peisy on 2016/04/20.
 */
var RegisterPanel = cc.Node.extend({
    ctor: function (type,userBtn) {
        this._super();
        this.registerLayer = ccs.csLoader.createNode(res.new_user_layer_json);
        this.initData(type,userBtn);
    },
    initData: function (type,userBtn) {

        var root = this.registerLayer.getChildByName('root');
        var userName = root.getChildByName('user');
        var registerBtn = root.getChildByName('btn').getChildByName('btn');
        var closeBtn = root.getChildByName('close_btn');
        var psw = root.getChildByName('psw');
        var psw2 = root.getChildByName('psw2');
        bindButtonCallback(registerBtn, function () {
            if(!cc.isString(userName.getString())){
                BasicPopup.alert('提示',"用户名不能为空或格式不正确");
            }else if(this.passwordValidate(psw.getString(),psw2.getString())){
                Network.register(userName.getString(),psw.getString(),type,userBtn,function(result,data){
                    if(result){
                        this.hiddenRegisterPopup();
                    }else{
                        BasicPopup.alert('提示',data);
                    }
                }.bind(this))
            }
        }.bind(this));
        bindButtonCallback(closeBtn, function () {
            this.hiddenRegisterPopup();
        }.bind(this));
    },
    passwordValidate: function(pws,pws2){
        var error = "";
        if(!cc.isString(pws) || pws.length < 6 || !cc.isString(pws2) || pws2.length < 6){
            error = '密码位数不能小于6位';
        }else if(pws !== pws2){
            error = '两次输入的密码不一致，请重新输入';
        }
        if(error){
            BasicPopup.alert('提示',error);
            return false;
        }else{
            return true;
        }
    },
    openRegisterPopup: function () {
        GamePopup.openPopup(this.registerLayer, null/*cc.p(335, 585)*/,false);
    },
    hiddenRegisterPopup: function () {
        GamePopup.closePopup(this.registerLayer);
    }
});
RegisterPanel.open = function(type,userBtn){
    var register = new RegisterPanel(type,userBtn);
    register.openRegisterPopup();
};