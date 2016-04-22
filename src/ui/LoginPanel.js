/**
 * Created by peisy on 2016/04/20.
 */
var LoginPanel = cc.Node.extend({
    ctor: function (/*user,*/userName_text) {
        this._super();
        this.loginLayer = ccs.csLoader.createNode(res.user_layer_json);
        this.initData(/*user,*/userName_text);
    },
    initData: function (/*user,*/userName_text) {

        var root = this.loginLayer.getChildByName('root');
        var userName = root.getChildByName('user');
        var loginBtn = root.getChildByName('btn').getChildByName('btn');
        var register_layout = root.getChildByName('new');
        var closeBtn = root.getChildByName('close_btn');
        var psw = root.getChildByName('psw');
        var username = localStorage.getItem("sgt-" + sgt.context.appId + "-username");
        var password = localStorage.getItem("sgt-" + sgt.context.appId + "-password");
        if (username && password) {
            userName.setString(username);
            psw.setString(password);
        }
        bindButtonCallback(loginBtn, function () {
            if(!cc.isString(userName.getString() || userName.getString().length === 0)){
                BasicPopup.alert('提示',"用户名不能为空或格式不正确");
            }else if(cc.isString(psw.getString()) && psw.getString().length >= 6){
                Network.login(userName.getString(),psw.getString(),function(result,data){
                    if(result){
                        this.hiddenLoginPopup();
                        userName_text.setString(userName.getString());
                    }else{
                        BasicPopup.alert('提示',data);
                    }
                }.bind(this))
            }else{
                BasicPopup.alert('提示',"密码位数不能小于6位");
            }
        }.bind(this));
        bindButtonCallback(closeBtn, function () {
            this.hiddenLoginPopup();
        }.bind(this));
        register_layout.setTouchEnabled(false);
        bindTouchEventListener(function(){
            RegisterPanel.open();
        },register_layout)

    },
    openLoginPopup: function () {
        GamePopup.openPopup(this.loginLayer, null/*cc.p(335, 585)*/,false);
    },
    hiddenLoginPopup: function () {
        GamePopup.closePopup(this.loginLayer);
    }
});