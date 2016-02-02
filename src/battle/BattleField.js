/**
 * Created by highkay on 2016/2/2.
 */
var SpriteGroup = function (_sprites) {
    var sprites = _sprites || [];

    this.get = function (i) {
        return sprites[i];
    };
    this.count = function () {
        return sprites.length;
    };
    this.getAllLived = function () {
        var livedSprites = [];
        for (var i in sprites) {
            var sprite = sprites[i];
            if (!sprite.isDead()) {
                livedSprites.push(sprite);
            }
        }
        return livedSprites;
    };
    this.foreach = function (callback, context) {
        for (var i in sprites) {
            callback.call(context, sprites[i], i);
        }
    };
    this.push = function (sprite) {
        sprites.push(sprite);
    };
    this.clear = function () {
        while (sprites.length > 0) {
            sprites[0].onClear();
            sprites.splice(0, 1);
        }
    };
    //精灵组的生命值 显示怪物总血量
    this.getLife = function () {
        var val = 0;
        for (var i in sprites) {
            var sprite = sprites[i];
            if (!sprite.isDead()) {
                val += sprite.getLife();
            }
        }
        return val;
    };
    //精灵组的最大生命值 显示怪物总血量
    this.getMaxLife = function () {
        var val = 0;
        for (var i in sprites) {
            var sprite = sprites[i];
            val += sprite.getMaxLife();
        }
        return val;
    };
    //重置所有的精灵
    this.resetSprites = function () {
        for (var i in sprites) {
            var sprite = sprites[i];
            sprite.reset();
        }
    };
    this.findFirstAlive = function () {
        for (var i in sprites) {
            var sprite = sprites[i];
            if (!sprite.isDead()) {
                return sprite;
            }
        }
        return undefined;
    };
    this.findRandomAlive = function () {
        var temp = [];
        for (var i in sprites) {
            var sprite = sprites[i];
            if (!sprite.isDead()) {
                temp.push(sprite);
            }
        }
        if (temp.length > 0) {
            var rand = Math.round(Math.random() * (temp.length - 1));
            return temp[rand];
        }
        return undefined;
    }
};

var BattleField = cc.Class.extend({

    ctor: function () {
        this.heroSprites = new SpriteGroup();
        this.enemySprites = new SpriteGroup();

    }



})