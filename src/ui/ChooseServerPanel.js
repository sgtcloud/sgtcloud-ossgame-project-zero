/**
 * Created by peisy on 2016/04/13.
 */
var ChooseServerPanel = cc.Node.extend({
    ctor: function (servers,chooseBtn) {
        this._super();
        this.chooseListLayer = ccs.csLoader.createNode(res.choose_list_layer_json);
        this.chooseListView = ccs.csLoader.createNode(res.choose_list_view_json);
        this.chooseListViewRoot = this.chooseListView.getChildByName('root');
        this.initData(servers,chooseBtn);
    },
    initData: function (servers,chooseBtn) {
        var root = this.chooseListLayer.getChildByName('root');

        this.listView = root.getChildByName('list');
        this.listView.removeAllChildren();
        for (var i in servers) {
            if(servers.length-1 == i){
                this.setElement(servers[i],chooseBtn,false);
            }else{
                this.setElement(servers[i],chooseBtn,true);
            }
        }
    },
    validatePlayerExists: function(server){
        var localServers = PlayerData.getLocalServerList();
        if(localServers.indexOf(server) != -1){
            return true;
        }
        return false;

    },
    setElement: function (server,chooseBtn,_new) {
        var root = this.chooseListViewRoot.clone();
        var state_new = root.getChildByName("state_new");
        var state_full = root.getChildByName("state_full");
        var _player = root.getChildByName("player");
        var text = root.getChildByName("text");
        var text2 = chooseBtn.getChildByName('text');
        var state = chooseBtn.getChildByName('state');
        var full = chooseBtn.getChildByName('full');
        text.setString(server.name);
        setFont([text]);
        state_new.setVisible(_new);
        state_full.setVisible(!_new);
        if(this.validatePlayerExists(server)){
            _player.setVisible(true);
        }else{
            _player.setVisible(false);
        }
        bindTouchEventListener(function(){
            Network.setServerInfo(server);
            full.setVisible(!_new);
            state.setVisible(_new);
            text2.setString(server.name);
            this.hiddenServerListPopup();
            return true;
        }.bind(this),root);
        this.listView.setItemsMargin(10);
        this.listView.pushBackCustomItem(root);
    },
    openServerListPopup: function () {
        GamePopup.openPopup(this.chooseListLayer,/*cc.p(140,210)*/null,false);
    },
    hiddenServerListPopup: function () {
        GamePopup.closePopup(this.chooseListLayer);
    }
});
ChooseServerPanel.open = function (chooseBtn) {
    Network.getAllServer(function(err){
        if(err){
            tip2.toggle(err);
        }else{
            var servers = PlayerData.servers;
            if(cc.isArray(servers) && servers.length > 0){
                var chooseServerPanel = new ChooseServerPanel(servers,chooseBtn);
                chooseServerPanel.openServerListPopup();
            }
        }
    });
};