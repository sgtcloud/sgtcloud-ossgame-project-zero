var GamePopup = cc.Layer.extend({
    _listener: null,
    ctor: function() {
        this._super(cc.color.BLACK);
        this.ignoreAnchorPointForPosition(false);   //忽略锚点设置为false，默认为true，锚点(0, 0)
        this.setOpacity(128);       //透明度

        //初始化对话框
        this._initDialog();

        return true;
    },
    onEnter: function()
    {
        this._super();
        //监听器
        this._listener = new cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: function(touch, event)
            {
                return true;
            }
        });

        //添加触摸监听
        cc.eventManager.addListener(this._listener, this);
    },

    //初始化对话框
    _initDialog: function()
    {
        var winSize = cc.winSize;

        //背景
        var bg = new cc.Sprite(res.dialog_png);
        bg.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
        this.addChild(bg, 0, 101);

        //OK按钮
        var OKLabel = new cc.LabelTTF("OK", "Arial", 36);
        var OKMenuItem = new cc.MenuItemLabel(OKLabel, this._onCallback, this);
        OKMenuItem.setPosition(cc.p(100, 50));

        //Cancel按钮
        var cancelLabel = new cc.LabelTTF("Cancel", "Arial", 36);
        var cancelMenuItem = new cc.MenuItemLabel(cancelLabel, this._onCallback, this);
        cancelMenuItem.setPosition(cc.p(250, 50));

        //菜单
        var menu = new cc.Menu(OKMenuItem, cancelMenuItem);
        menu.setPosition(cc.p(0, 0));
        bg.addChild(menu);      //注意是添加到背景里面

        this.setVisible(false);     //默认设置为不可见
    },

    _onCallback: function()
    {
        this.hidden();
    },

    //弹出
    popup: function()
    {
        this.setVisible(true);
        this._listener.setSwallowTouches(true);

        var bg = this.getChildByTag(101);
        bg.setScale(0);
        var scaleTo = new cc.ScaleTo(2.0, 1);
        var rotateBy = new cc.RotateBy(2.0, 360, 0);
        var spawn = new cc.Spawn(scaleTo, rotateBy);
        bg.runAction(spawn);
    },

    //隐藏
    hidden: function()
    {
        this.setVisible(false);
        this._listener.setSwallowTouches(false);
    },

    onExit: function()
    {
        this._super();
        //移除触摸监听
        cc.eventManager.removeListeners(cc.EventListener.TOUCH_ONE_BY_ONE, true);
    }
});
