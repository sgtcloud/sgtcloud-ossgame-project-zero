

英雄`Hero`，技能`Skill`，装备`Equip`三个类有以下共同方法接口

* 是否最高等级`isMaxLevel`
* 获取当前等级`getLv`
* 获取指定等级信息`getLevelData`
* 获取ID`getId`
* 获取下一级升级资源`getNextLevelUpgrade`
* 是否解锁`isLocked`


## Hero

* 英雄实体类，包含英雄的所有属性，每个英雄一个对象，
* 对象初始化时需要给定id和初始等级
* 新注册玩家除第一个英雄是初始化一级，其余英雄都是0级未解锁状态，如定制初始等级可在`Player.js`中的`heroes`中配置
* 老玩家从存档中加载英雄数据
* 英雄初始化的时候绑定监听事件`EVENT.HERO_DIE`死亡和`EVENT.HERO_REVIVE`复活，用以判断上次退出游戏时的英雄状态。
* 如果上次退出时英雄是死亡状态，且距上次退出的时间小于复活时间，那么进入游戏后英雄依然是死亡状态并进行实时的复活倒计时
* 英雄在初始化时调用`isLocked()`方法判断当前是否是锁定状态
* 升级方法`upgrade`
* `refreshProps`刷新和计算所有属性值
* `getLife`是获取英雄最大的HP值，`getCurrentLife`获取英雄当前剩余HP值
* `getLevelData`获取指定级别需要的资源，默认当前级别
* 使用`dataSource.heros[this._id]`获取当前英雄的所有数据


## Skill
* 技能实体类，封装技能的属性，包含主动和被动技能
* 对象初始化时需要给定id和初始等级，初始化在`Hero#init`方法中
* 初始等级从存档中加载，若存档中没有则默认为0级
* 技能类型`type`,1为主动技能，其他为被动技能
* `traverseSkillEffects`遍历当前技能的所有技能效果

## Equip
* 装备实体类，结构基本同`Skill`
* 初始化过程同`Skill`,初始化在`Hero#init`方法中
* 装备的初始等级是1级
* 装备分为普通装备和神器，`type`为1的时候是普通装备，大于1为神器
* 神器增加全部英雄的属性，普通装备只增加当前英雄属性

## Enemy
* 敌人实体类，包括小怪和boss
* `getBonus`获取Enemy死亡后掉落资源


## ArenaHero
* 竞技场中英雄实体，继承自`Hero`，重写构造方法、`calcProp`、`isDead`
* `ArenaHero`使用新的PlayerData对象，不能使用全局PlayerData对象

## PlayerData
* 角色数据操作模型类

## ArenaPlayerData
* 继承自PlayerData，重写`initPlayerData`和`init`方法

## Stage
* 关卡实体类

## Player
* 存档模版模型，一个全局json对象
* 包含以下属性：
  * `id` 角色ID
  * `name`角色昵称
  * `vip` vip等级
  * `stage`战役ID
  * `stage_battle_num` 关卡数
  * `into_stage_battle_timestamp`开始战斗时间 
  * `not_get_reward` 为获取离线奖励
  * `first_time`首次进入游戏时间
  * `recovery_orders`未验证的订单ID
  * `completed_order_total`充值统计
  * `first_recharge_status`首次充值状态
  * `month_card_start_time`月卡开始时间
  * `month_card_end_time`月卡结束时间
  * `resource` 资源
    * `gold` 金币
    * `gem`钻石
    * `relic`宝物
    * `wood`木材
    * `leather`stage
    * `bronze`铜
    * `iron`铁
    * `crystal`水晶
    * `rune`符文
    * `essence`魔晶
    * `iron_chest`铁宝箱
    * `iron_key`铁钥匙
    * `silver_chest`银宝箱
    * `silver_key`银钥匙
    * `golden_chest`金宝箱
    * `golden_key`金钥匙
    * `small_blood`小HP药
    * `middle_blood`中HP药
    * `large_blood`大HP药
  * `time` 保存各种冷却开始时间戳
    * `die` 死亡冷却时间，json类型，格式为`{heroId:死亡时间}`
    * `cd`技能cd时间，json类型，格式为`{skillId:技能释放时间}`
  * `statistics`数据统计
    * `total_fairy`打开小精灵总数量
    * `total_gem`累计获得钻石总数
    * `total_relic`累计获得宝物总数
    * `total_gold`累计获得金币总数
    * `total_tap`总点伤
    * `total_damage`总秒伤
    * `total_enemy_kill`累计击杀普通怪物数量
    * `total_boss_kill`累计击杀Boss数量
    * `total_chest_open`累计打开宝箱总量
    * `total_max_level`已通关最高关卡
    * `total_offline_time`累计离线时间
    * `total_play_time`累计游戏时间
  * `arena`竞技场配置
    * `times` 每天初始的竞技场挑战次数
  * `heros`英雄信息，格式为json数组，每个json包含以下属性
    * `id` 英雄id
    * `lv`英雄等级
    * `life`英雄当前血量
    * `star`星级
    * `skills`技能信息，格式为json，`{"技能ID":{"leve":5}}`
    * `equips`装备信息，格式为json，`{"装备ID":{"level":5}}`
