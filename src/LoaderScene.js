/**
 * Created by highkay on 2015/12/17.
 */
LoaderScene = cc.LoaderScene.extend({
    _interval: null,
    _progressBar: null,
    _className: "LoaderScene",
    cb: null,
    target: null,
    root: null,

    init: function () {
        var self = this;
        var json = ccs.load(res_loading.loading_scene_json);
        var node = json.node;
        var animation = json.action;
        node.runAction(animation);
        animation.play("rot", true);
        this.root = node.getChildByName("root");
        self.addChild(node, 0);
        return true;
    },

    /**
     * custom onEnter
     */
    onEnter: function () {
        var self = this;
        this.updatePercent(0);
        cc.Node.prototype.onEnter.call(self);
        self.schedule(self._startLoading, 0.2);
    },
    /**
     * custom onExit
     */
    onExit: function () {
        cc.Node.prototype.onExit.call(this);
        this.updatePercent(0);
    },

    updatePercent: function (percent) {
        var _progressBar = this.root.getChildByName("loading_bar");
        _progressBar.setPercent(percent);
        var star = this.root.getChildByName("star");
        var newStarPos = cc.p(_progressBar.x - _progressBar.width / 2 + _progressBar.width * percent / 100, _progressBar.y - _progressBar.height / 2);
        star.setPosition(newStarPos);
    },

    /**
     * init with resources
     * @param {Array} resources
     * @param {Function|String} cb
     * @param {Object} target
     */
    initWithResources: function (resources, cb, target) {
        if (cc.isString(resources))
            resources = [resources];
        this.resources = resources || [];
        this.cb = cb;
        this.target = target;
    },

    _startLoading: function () {
        var self = this;
        self.unschedule(self._startLoading);
        var res = self.resources;
        cc.loader.load(res,
            function (result, count, loadedCount) {
                var percent = (loadedCount / count * 100) | 0;
                percent = Math.min(percent, 100);
                self.updatePercent(percent);
            }, function () {
                if (self.cb)
                    self.cb.call(self.target);
            });
    }
})

var loaderScene;
var res_loading = {
    loading_scene_json: "res/loadingLayer.json"
}

LoaderScene.preload = function (resources, cb, target) {

    cc.loader.loadJson(res_loading.loading_scene_json, function (error, data) {
        var path = cc.path;
        if (data && data["Content"] && data["Content"]["Content"]["UsedResources"]) {
            cc.loader.cache[res_loading.loading_scene_json] = data;
            var UsedResources = data["Content"]["Content"]["UsedResources"],
                dirName = path.dirname("res"),
                list = [],
                tmpUrl, normalUrl;
            for (var i = 0; i < UsedResources.length; i++) {
                tmpUrl = path.join(dirName, UsedResources[i]);
                normalUrl = path._normalize(tmpUrl);
                if (!ccs.load.validate[normalUrl]) {
                    ccs.load.validate[normalUrl] = true;
                    list.push(normalUrl);
                }
            }
            cc.loader.load(list, function (error, data) {
                if (!loaderScene) {
                    loaderScene = new LoaderScene();
                    loaderScene.init();
                }
                loaderScene.initWithResources(resources, cb, target);
                cc.director.runScene(loaderScene);
            });
        } else {
            cb(error, data);
        }

    });
    return loaderScene;
};