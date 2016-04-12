var res_datas = {
    stages_json: "res/data/stages.json",
    heroes_json: "res/data/heroes.json",
    enemies_json: "res/data/enemies.json",
    equips_json: "res/data/equips.json",
    skills_json: "res/data/skills.json",
    goods_json: "res/data/goods.json",
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
    prompt2_layer_json: "res/Prompt2Layer.json",
    prompt_icon_json: "res/PromptIcon.json",
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
    mail_view_json: 'res/MailView.json',
    mail_layer_json: 'res/MailLayer.json',
    pvp_layer_json: 'res/PVPLayer.json',
    pvp_opponent_view_json: 'res/PVPOpponentView.json',
    pvp_record: 'res/PVPRecord.json',
    pvp_record_view:'res/PVPRecordView.json',
    recharge_icon_layer_json: 'res/RechargeIconLayer.json',
    recharge_layer_json: 'res/RechargeLayer.json',

    hero101skill01: 'res/hero101skill01.json',
    hero101skill02: 'res/hero101skill02.json',
    hero102skill02: 'res/hero102skill02.json',
    hero103skill01: 'res/hero103skill01.json',
    hero104skill02: 'res/hero104skill02.json',

    effect5001: "res/effect5001.json",
    effect5002: "res/effect5002.json",
    effect5003: "res/effect5003.json",
    effect5004: "res/effect5004.json",
    effect5005: "res/effect5005.json",
    effect5006: "res/effect5006.json",
    effect5007: "res/effect5007.json",
    effect5008: "res/effect5008.json",
    effect5009: "res/effect5009.json",
    effect5010: "res/effect5010.json",

    guideMsgBox: 'res/Guide.json',
    guideGirl: 'res/GuideGirl.json',
    guideHand: 'res/GuideHand.json',
    first_recharge_layer_json: 'res/FirstRechargeLayer.json',
    countdown_json: 'res/countdown.json',
    arena_result_tip: 'res/SettlementLayer.json',
    guide_skip_json: 'res/GuideSkip.json',
    notice_view_json: 'res/NoticeView.json',
    notice_layer_json: 'res/NoticeLayer.json',
    gift_code_layer_json: 'res/GiftCodeLayer.json'
};
var full_resouces = [];
var first_resources = [];

for (var i in res_datas) {
    first_resources.push(res_datas[i]);
    full_resouces.push(res_datas[i]);
}

function getFirstResources(isNotMark,isNotPlayer){
    var res1 = [res.hero_102_json,res.hero_103_json,res.hero_104_json,res.hero_105_json,res.hero101skill02,res.hero102skill02,res.hero103skill01,res.hero104skill02,
        res.effect5003,res.effect5004,res.effect5005,res.effect5006,res.effect5007,res.effect5008,res.effect5009,res.effect5010,res.enemy_1003_json,res.enemy_1004_json,res.enemy_1005_json];
    var res2 = [res.mail_view_json ,res.mail_layer_json,res.first_recharge_layer_json,res.recharge_layer_json,res.recharge_icon_layer_json,res.hero_desc_json,res.prompt1_layer_json,res.prompt2_layer_json
        ,res.prompt_icon_json,res.offline_reward_layer,res.skill_desc_json,res.pack_layer_json,res.statistics_layer];
    for (var i in res) {
        if(isNotMark){
            if(isNotPlayer){
                if(res1.indexOf(res[i]) === -1 && res2.indexOf(res[i]) === -1){
                    first_resources.push(res[i]);
                }
            }else{
                if(res2.indexOf(res[i]) === -1){
                    first_resources.push(res[i]);
                }
            }
        }
        full_resouces.push(res[i]);
    }
}

