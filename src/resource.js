var res_datas = {
  stages_json : "res/data/stages.json",
  battles_json : "res/data/battles.json",
  heros_json : "res/data/heroes.json",
  enemys_json : "res/data/enemys.json",
  equips_json : "res/data/items.json",
  skills_json : "res/data/skills.json"
};
var res = {
    HelloWorld_png : "res/HelloWorld.png",
    CloseNormal_png : "res/CloseNormal.png",
    CloseSelected_png : "res/CloseSelected.png",

    aaa_png : "res/aaa.png",

    game_json : "res/game.json",
    cover_json : "res/cover.json",
    Login_json : "res/Login.json",

    cover_scene_json : "res/CoverScene.json",
    game_scene_json : "res/GameScene.json",

    player_layer_json : "res/PlayerLayer.json",
    menu_layer_json : "res/MenuLayer.json",
    battle_layer_json : "res/BattleLayer.json",
    equip_layer_json : "res/EquipLayer.json",

    title_layer_json : "res/TitleLayer.json",
    batter_layer_json : "res/BatterLayer.json",
    enemy_list_json : "res/EnemyList.json",
    skill_icon_json : "res/Skillicon.json",
    skill_layer_json : "res/SkillLayer.json",
    gold_layer : "res/GoldLayer.json",
    hero_btn_json : "res/HeroBtn.json",
    equip_btn_json : "res/EquipBtn.json",
    star_json : "res/Star.json",
    hero_layer_json : "res/HeroLayer.json",
    hero_view_json : "res/HeroView.json",
    skill_view_json : "res/SkillView.json",
    equip_layer_json : "res/Equiplayer.json",
    equip_view_json : "res/EquipView.json",
    equip_hero_view_json : "res/EquipHeroView.json",


    hero_101_json : "res/hero101.json",
    hero_102_json : "res/hero102.json",
    hero_103_json : "res/hero103.json",
    hero_104_json : "res/hero104.json",
    hero_105_json : "res/hero105.json",

    enemy_1001_json : "res/enemy1001.json",
    enemy_1002_json : "res/enemy1002.json",
    enemy_1003_json : "res/enemy1003.json",
    enemy_1004_json : "res/enemy1004.json",
    enemy_1005_json : "res/enemy1005.json",

    hero_blood_json : "res/blood.json",

    // hit_effect_json : "res/HitEffect.json",
    // hit_effect_0_png : "res/effects/player_hit_0.png",
    // hit_effect_1_png : "res/effects/player_hit_1.png",
    // hit_effect_2_png : "res/effects/player_hit_2.png",
    // hit_effect_3_png : "res/effects/player_hit_3.png",
    // battle_hero_list_json : "res/BattleHeroList.json",

    battle_hero_view_json : "res/BattleHeroView.json",
    equip_hero_view_json : "res/EquipHeroView.json",
    equip_item_view_json : "res/EquipItemView.json",

    test_json : "res/test.json",

    cover_bg : "res/cover/bg.jpg",
    cover_input_frame : "res/cover/input_frame.png",
    cover_login_btn_a : "res/cover/login_btn_a.png",
    cover_login_btn_b : "res/cover/login_btn_b.png",

    player_hit_png : "res/effects/player_hit.png",
    skill_0_png : "res/effects/skill_0.png"
};


var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
for (var i in res_datas) {
    g_resources.push(res_datas[i]);
}


var player_hit_frames = [
  "player_hit_0",
  "player_hit_1",
  "player_hit_2",
  "player_hit_3"
];
var skill_0_frames = [
    "skill_0_0",
    "skill_0_1",
    "skill_0_2",
    "skill_0_3",
    "skill_0_4"
];
