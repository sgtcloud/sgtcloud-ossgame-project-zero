var res_datas = {
    stages_json: "res/data/stages.json",
    heroes_json: "res/data/heroes.json",
    enemies_json: "res/data/enemies.json",
    equips_json: "res/data/equips.json",
    skills_json: "res/data/skills.json",
    goods_json: "res/data/goods.json",
    players_json: "res/data/players.json"
};
var res = {
    cover_scene_json: "res/cover.json",

    menu_layer_json: "res/MenuLayer.json",
    battle_layer_json: "res/BattleLayer.json",
    equip_layer_json: "res/Equiplayer.json",

    title_layer_json: "res/TitleLayer.json",
    enemy_list_json: "res/EnemyList.json",
    skill_icon_json: "res/Skillicon.json",
    skill_layer_json: "res/SkillLayer.json",
    gold_layer: "res/GoldLayer.json",
    hero_btn_json: "res/HeroBtn.json",
    equip_btn_json: "res/EquipBtn.json",
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

    tap_effect_json: "res/effect5000.json",

    prompt1_layer_json: "res/Prompt1Layer.json",

    offline_reward_layer: "res/OfflineRewardLayer.json",
    shop_view: "res/ShopView.json",
    shop_layer: "res/ShopLayer.json",
    shop_icon_layer: "res/ShopIconLayer.json",
    rank_layer_json: "res/RankLayer.json",
    rank_view_json: "res/RankView.json",
    fairy01_json: "res/fairy01.json",
    chest03_json: "res/chest03.json",

    skill_magma_blaster: "res/effect5001.json",
    skill_fury_crawl: "res/effect5002.json",
    hero_desc_json: "res/HeroDescLayer.json",
    skill_desc_json: "res/SkillDescView.json"
};


var g_resources = [];
for (var i in res_datas) {
    g_resources.push(res_datas[i]);
}
for (var i in res) {
    g_resources.push(res[i]);
}

