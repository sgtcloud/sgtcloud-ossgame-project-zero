var res = {
    HelloWorld_png : "res/HelloWorld.png",
    CloseNormal_png : "res/CloseNormal.png",
    CloseSelected_png : "res/CloseSelected.png",

    battles_json : "res/data/battles.json",
    heros_json : "res/data/heros.json",
    enemys_json : "res/data/enemys.json",
    exps_json : "res/data/exps.json",
    equips_json : "res/data/equips.json",

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
