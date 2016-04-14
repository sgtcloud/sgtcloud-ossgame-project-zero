/**
 * Created by peisy on 2016/04/13.
 */
var ChooseServerPanel = cc.Node.extend({
    ctor: function (servers) {
        this._super();
        this.chooseListLayer = ccs.csLoader.createNode(res.choose_list_layer_json);
        this.chooseListView = ccs.csLoader.createNode(res.choose_list_view_json);
        this.chooseListViewRoot = this.chooseListView.getChildByName('root');
        this.initData(servers);
    },
    initData: function (servers) {
        var root = this.chooseListLayer.getChildByName('root');

        this.listView = root.getChildByName('list');
        this.listView.removeAllChildren();
        for (var i in servers) {
            if(servers.length-1 == i){
                this.setElement(servers[i],true);
            }else{
                this.setElement(servers[i],false);
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
    setElement: function (server,_new) {
        var root = this.chooseListViewRoot.clone();
        var state_new = root.getChildByName("state_new");
        var state_full = root.getChildByName("state_full");
        var _player = root.getChildByName("player");
        var text = root.getChildByName("text");
        text.setString(server.name);
        setFont([text]);
        if(_new){
            state_new.setVisible(true);
            state_full.setVisible(false);
        }else{
            state_full.setVisible(true);
            state_new.setVisible(false);
        }
        if(this.validatePlayerExists(server)){
            _player.setVisible(true);
        }else{
            _player.setVisible(false);
        }
        bindTouchEventListener(function(){
            Network.setServerInfo(server);
            this.hiddenServerListPopup();
            return true;
        }.bind(this),root);
        this.listView.setItemsMargin(10);
        this.listView.pushBackCustomItem(root);
    },
    openServerListPopup: function () {
        GamePopup.openPopup(this.chooseListLayer,cc.p(455,660),false);
    },
    hiddenServerListPopup: function () {
        GamePopup.closePopup(this.chooseListLayer);
    }
});
ChooseServerPanel.open = function (ignoreVersion) {
    var servers = PlayerData.getAllServer();
    if(cc.isArray(servers) && servers.length > 0){
        var chooseServerPanel = new ChooseServerPanel(servers);
        chooseServerPanel.openServerListPopup();
    }
};