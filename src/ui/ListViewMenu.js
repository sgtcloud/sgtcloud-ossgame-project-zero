/**
 * Created by Maron on 2016/3/4.
 */
var ListViewMenu = BattleMenu.extend({
    _bufferZone: 110,
    _updateInterval: 0.1,
    _initializeListSize: false,
    items: null,
    HERO_ITEM: "hero-item",
    SKILL_ITEM: "skill-item",
    EQUIP_NORMAL_ITEM: "equip_normal_item",
    EQUIP_MAGIC_ITEM: "equip_magic_item",
    ctor: function (tabPanel, res) {
        this._super(tabPanel, res);
        this.items = [];
        this._totalCount = 0;
        this._spawnCount = 7;
        this._itemTemplateHeight = 0;
        this._lastContentPosY = 0;
        this._updateTimer = 0;
        this._reuseItemOffset = 0;
    },
    setItemModel: function (item) {
        this._itemTemplateHeight = item.height;
        this._reuseItemOffset = this._itemTemplateHeight * this._spawnCount;
        this.listView.setItemModel(item);
    },
    addItem: function (item, i) {
        if (arguments.length == 1) {
            this.items.push(item);
        } else {
            this.items.splice(i, 1, item);
        }
    },
    setItems: function (items) {
        this.items = items;
    },
    setListView: function (listView) {
        this.listView = listView;
    },
    updateItem: function (itemID, item) {
        //var itemTemplate = this.listView.getItems()[templateID];
        //var btn = itemTemplate.getChildByName('TextButton');
        //itemTemplate.setTag(itemID);
        //btn.setTitleText(this.items[itemID]);
    },
    getItemPositionYInView: function (item) {
        var worldPos, viewPos;
         worldPos = item.getParent().convertToWorldSpaceAR(item.getPosition());
         viewPos = this.listView.convertToNodeSpaceAR(worldPos);
         return viewPos.y;
    },
    update: function (dt) {
        this._updateTimer += dt;
        if (this._updateTimer < this._updateInterval) {
            return;
        }
        this._updateTimer = 0;

        var items = this.listView.getItems();
        var isDown = this.listView.getInnerContainer().getPosition().y < this._lastContentPosY;
        for (var i = 0; i < this._spawnCount && i < this._totalCount; ++i) {
            var item = items[i];
            var itemPos = this.getItemPositionYInView(item);
            if (isDown) {
                //here 4 is the spacing between items
                var totalHeight = this._itemTemplateHeight * this._totalCount/*+ (this._totalCount - 1) * 4*/;
                if (itemPos < -this._bufferZone && item.getPosition().y + this._reuseItemOffset < totalHeight) {
                    var itemID = this._totalCount - this._spawnCount - 1 - item.getPositionY() / this._itemTemplateHeight/*item.getTag() - items.length*/;
                    item.setPositionY(item.getPositionY() + this._reuseItemOffset);
                    this.updateItem(itemID, item);
                }
            } else {
                var listViewHeight = this.listView.getContentSize().height;
                var y = item.getPositionY() - this._reuseItemOffset;
                if (itemPos > this._bufferZone + listViewHeight && y >= 0) {
                    item.setPositionY(y);
                    itemID = this._totalCount - 1 - item.getPositionY() / this._itemTemplateHeight/*item.getTag() + items.length*/;
                    this.updateItem(itemID, item);
                }
            }
        }
        this._lastContentPosY = this.listView.getInnerContainer().getPosition().y;
    },
    onEnter: function () {
        cc.Node.prototype.onEnter.call(this);
        //we must call foreceDoLayout in onEnter method in h5.
        this.listView.forceDoLayout();
        var totalHeight = this._itemTemplateHeight * this._totalCount /*+ (this._totalCount - 1) * 4*/;
        this.listView.getInnerContainer().setContentSize(cc.size(this.listView.getInnerContainerSize().width, totalHeight));
        this.listView.jumpToTop();
        this._lastContentPosY = this.listView.getInnerContainer().getPosition().y;
    },updateInnerContainerSize:function(){
        var totalHeight = this._itemTemplateHeight * this._totalCount;
        this.listView.getInnerContainer().setContentSize(cc.size(this.listView.getInnerContainerSize().width, totalHeight));
    }
});