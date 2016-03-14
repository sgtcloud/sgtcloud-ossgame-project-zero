var res_datas = {
    stages_json: "res/data/stages.json",
    heroes_json: "res/data/heroes.json",
    enemies_json: "res/data/enemies.json",
    equips_json: "res/data/equips.json",
    skills_json: "res/data/skills.json",
    goods_json: "res/data/goods.json",
    players_json: "res/data/players.json",
    bonus_json: "res/data/bonus.json"
};
var res = {
    cover_scene_json: "res/cover.json",
    createPlayer: "res/NewNameLayer.json",
    menu_layer_json: "res/MenuLayer.json",
    battle_layer_json: "res/BattleLayer.json",
    equip_layer_json: "res/Equiplayer.json",

    title_layer_json: "res/TitleLayer.json",
    enemy_list_json: "res/EnemyList.json",
    skill_icon_json: "res/Skillicon.json",
    skill_layer_json: "res/SkillLayer.json",
    star_json: "res/Star.json",
    hero_layer_json: "res/HeroLayer.json",
    hero_view_json: "res/HeroView.json",
    skill_view_json: "res/SkillView.json",
    equip_view_json: "res/EquipView.json",

    hero_101_json: "res/hero101.json",
    hero_102_json: "res/hero102.json",
    hero_103_json: "res/hero103.json",
    hero_104_json: "res/hero104.json",
    hero_105_json: "res/hero105.json",

    enemy_1001_json: "res/enemy1001.json",
    enemy_1002_json: "res/enemy1002.json",
    enemy_1003_json: "res/enemy1003.json",
    enemy_1004_json: "res/enemy1004.json",
    enemy_1005_json: "res/enemy1005.json",

    hero_blood_json: "res/Blood.json",
    battle_num_json: "res/BattleNum.json",

    equip_hero_view_json: "res/EquipHeroView.json",

    little_gold_json: "res/gold01.json",
    some_gold_json: "res/gold02.json",
    amount_gold_json: "res/gold03.json",
    huge_gold_json: "res/gold04.json",

    gem_json: "res/diamond01.json",
    relic_json: "res/relic01.json",

    wood_json: "res/wood01.json",
    leather_json: "res/leather01.json",
    stone_json: "res/stone01.json",
    bronze_json: "res/bronze01.json",
    iron_json: "res/iron01.json",
    crystal_json: "res/crystal01.json",
    rune_json: "res/rune01.json",
    essence_json: "res/rune01.json",

    iron_chest_json: "res/chest02.json",
    silver_chest_json: "res/chest03.json",
    golden_chest_json: "res/chest04.json",

    iron_key_json: "res/key01.json",
    silver_key_json: "res/key01.json",
    golden_key_json: "res/key01.json",

    tap_effect_json: "res/effect5000.json",

    prompt1_layer_json: "res/Prompt1Layer.json",

    offline_reward_layer: "res/OfflineRewardLayer.json",
    shop_view: "res/ShopView.json",
    shop_layer: "res/ShopLayer.json",
    shop_icon_layer: "res/ShopIconLayer.json",
    rank_layer_json: "res/RankLayer.json",
    rank_view_json: "res/RankView.json",
    fairy01_json: "res/fairy01.json",
    chest01_json: "res/chest01.json",
    chest02_json: "res/chest02.json",
    chest03_json: "res/chest03.json",
    chest04_json: "res/chest04.json",

    skill_magma_blaster: "res/effect5001.json",
    skill_fury_crawl: "res/effect5002.json",
    skill_saint_aura: "res/effect5003.json",
    skill_cure_totem: "res/effect5004.json",
    skill_tornado_shock: "res/effect5005.json",
    hero_desc_json: "res/HeroDescLayer.json",
    skill_desc_json: "res/SkillDescView.json",
    pack_layer_json: "res/PackLayer.json",
    buff_tip_json: "res/BuffTips.json",
    buff_layer_json: "res/BuffLayer.json",
    buff_list_json: "res/BuffList.json",
    statistics_layer: "res/StatisticsLayer.json",
    small_item_layer_json: "res/SmallItemLayer.json",
    shop_list_view: "res/ShopListView.json",
    tips: 'res/Tips.json',
    tombstone_json: "res/dead.json",
    sign_icon: 'res/SignIcon.json',
    sign_layer: 'res/SignLayer.json',
    sign_view: 'res/SignView.json',
    maill_view_json: 'res/MaillView.json',
    maill_layer_json: 'res/MaillLayer.json',
    pvp_layer_json:'res/PVPLayer.json',

    hero101skill: 'res/hero101skill01.json',

    guideMsgBox: 'res/Guide.json',
    guideGirl: 'res/GuideGirl.json',
    guideHand: 'res/GuideHand.json'
};


var g_resources = [];
for (var i in res_datas) {
    g_resources.push(res_datas[i]);
}
for (var i in res) {
    g_resources.push(res[i]);
}

