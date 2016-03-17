var MenuBtn = function (btn) {
    this.button = btn.getChildByName('btn');
};
//UI的Menu父类
var BattleMenu = cc.Node.extend({
    ctor: function (tabPanel, res) {
        this._super();
        var layer = ccs.csLoader.createNode(res);
        this.addChild(layer);
        this.height = layer.height;
        this.root = layer.getChildByName('root');
    },
    onHeroDead: function () {
    },
    onHeroRecover: function () {
    }
});



function canUnlockItem(hero, target) {
    var heroLv = hero.getLv();
    var unlockLevel = target.getUnlockLevel();
    return !(heroLv < unlockLevel);
}
function lockItem(hero, target, elements) {
    (!elements.lock_btn.layer.isVisible()) && elements.lock_btn.layer.setVisible(true);
    elements.upgrade_btn.layer.isVisible() && elements.upgrade_btn.layer.setVisible(false);
    elements.lock_btn.level_text.setString('Lv.' + target.getUnlockLevel());
}
function lockItemIfNecessary(hero, target, elements) {
    var flag = canUnlockItem(hero, target);
    if (!flag) {
        lockItem(hero, target, elements);
    }
    return flag;
}
