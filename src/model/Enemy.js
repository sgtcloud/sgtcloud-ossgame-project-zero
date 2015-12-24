var Enemy = function (src) {
  var id = src.id;
  var lv = src.lv;
  var data = dataSource.enemys[id];

  this.getId = function () {
    return id;
  }
  this.getLv = function () {
    return lv;
  }
  this.getName = function () {
    return data.name;
  }
  this.getFile = function () {
    return data.file;
  }
  this.getLife = function () {
    return getLevelData(data, "life", lv);
  }
  this.getAttack = function () {
    return getLevelData(data, "attack", lv);
  }
  this.getAnimateDelay = function () {
    var val = getLevelData(data, "atk_period", lv);
    return val;
  }
  this.getBonus = function () {
    return getLevelData(data, "bonus", lv);
  }
}


