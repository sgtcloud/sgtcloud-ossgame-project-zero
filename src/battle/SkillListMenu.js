/**
 * Created by Maron on 2016/2/29.
 */
//UI上显示的技能ICON
var SkillIcon = function (root, index, skillsBox, skill, hero) {
    this.root = root;
    var x = root.width;
    var y = root.height;
    var num = 5;
    var boxWidth = skillsBox.width;
    var margin = 5;
    var offsetX = boxWidth - num * x - (num - 1) * margin;
    root.setPosition((index < num ? offsetX : 0) + (x + margin) * (index - num * Math.floor(index / num)), (y + margin) * Math.floor(index / num));
    this.skill_icon = root.getChildByName('skill_icon');
    this.reviveText = root.getChildByName('reviveTime_text');
    this.time = root.getChildByName('time');
    this.cooldownText = root.getChildByName('cooldown_text');
    this.durationText = root.getChildByName('duration_text');
    this.reviveText.setVisible(false);
    this.time.setVisible(false);
    this.time.setColor(cc.color(255, 0, 0));
    this.cooldownText.setVisible(false);
    this.durationText.setVisible(false);
    var isCoolDowning = false;
    var heroDead = false;
    var randomBuff = false;
    this.skill_icon.setTouchEnabled(true);
    skillsBox.addChild(this.root);
    this.skill = skill;
    this.setVisible = function (visit) {
        root.setVisible(visit);
    };
    this.showDead = function () {
        this.reviveText.setVisible(true);
        this.time.setVisible(true);
        this.cooldownText.setVisible(false);
    };
    this._doSchedule = function (time, target, cb) {
        var remaining = time;
        target.schedule(function () {
                if (!heroDead) {
                    this.setString(remaining);
                }
                if (remaining <= 0) {
                    if (typeof cb === "function") {
                        cb();
                    }
                    this.unschedule(this.__instanceId);
                    return;
                }
                remaining--;
            }, 1, time, 0, target.__instanceId
        );
    };
    this._doCoolDown = function (cd) {
        isCoolDowning = true;
        this.cooldownText.setVisible(true);
        this.time.setVisible(true);
        this.time.setString(cd);
        this.skill_icon.setColor(cc.color(90, 90, 90));
        this._doSchedule(cd - 1, this.time, function () {
            if (!heroDead && !randomBuff) {
                this.skill_icon.setColor(cc.color(255, 255, 255));
            }
            this.cooldownText.isVisible() && this.cooldownText.setVisible(false);
            if (!heroDead) {
                this.time.isVisible() && this.time.setVisible(false)
            }
            isCoolDowning = false;
            delete  player['time']['cd'][this.skill.getId()];
            PlayerData.updatePlayer();
        }.bind(this));
    };
    this.refresh = function () {
    };
    this.isActive = function () {
        return !skill.isLocked();
    };
    this._bindListeners = function () {
        var that = this;
        customEventHelper.bindListener(EVENT.UNLOCK_ACTIVITY_SKILL, function (event) {
            var skillId = event.getUserData();
            if (!that.root.isVisible() && that.skill.getId() === skillId) {
                that.root.setVisible(true);
            }
        });
        customEventHelper.bindListener(EVENT.CAST_SKILL_READY, function (e) {
            var data = e.getUserData();
            if (that.skill.getId() === data.skillId) {
                if (!randomBuff) {
                    var duration = that.skill.getLevelData(data.level)['duration'];
                    var randomSkill = new Skill(data.skillId, data.level);
                    if (duration > 0) {
                        toggleBufflayer(duration, buildSkillBuffDesc(randomSkill), that.skill.getIcon());
                    }
                    customEventHelper.sendEvent(EVENT.CAST_SKILL, randomSkill);
                    randomBuff = true;
                    that.skill_icon.setColor(cc.color(90, 90, 90));
                    setTimeout(function () {
                        if (!(heroDead || isCoolDowning))
                            that.skill_icon.setColor(cc.color(255, 255, 255));
                        randomBuff = false;
                    }, duration * 1000);
                } else /*if ( randomBuff)*/ {
                    tip.toggle('已使用相同效果的技能！');
                }
            }
        });
        customEventHelper.bindListener(EVENT.HERO_DIE, function (event) {
            var dieHero = event.getUserData();
            if (dieHero.hasSkill(that.skill.getId())) {
                heroDead = true;
                !that.time.isVisible() && that.time.setVisible(true);
                that.reviveText.setVisible(true);
                if (isCoolDowning) {
                    that.cooldownText.setVisible(false);
                } else {
                    that.skill_icon.setColor(cc.color(90, 90, 90));
                }
                that.time.setString(Math.round(dieHero.getLevelData()['resurge']['time']));
            }
        });
        customEventHelper.bindListener(EVENT.HERO_REVIVE, function (event) {
            var reviveHero = event.getUserData();
            if (reviveHero.hasSkill(that.skill.getId())) {
                if (!isCoolDowning) {
                    that.skill_icon.setColor(cc.color(255, 255, 255));
                    that.time.setVisible(false);
                }
                that.reviveText.setVisible(false);
                isCoolDowning && that.cooldownText.setVisible(true);
                heroDead = false;
            }
        });
        customEventHelper.bindListener(EVENT.HERO_REVIVE_COUNTDOWN, function (event) {
            var data = event.getUserData();
            var hero = PlayerData.getHeroById(data['id']);
            if (hero.hasSkill(that.skill.getId())) {
                that.setCoolTime(Math.round(data['recover']));
            }
        });
    };
    this.init = function () {
        var that = this;
        this.skill_icon.loadTexture("res/icon/skills/" + skill.getIcon());
        if (this.skill.getLv() > 0) {
            this.root.setVisible(true);
        } else {
            this.root.isVisible() && this.root.setVisible(false);
        }
        this.skill_icon.addClickEventListener(function () {
            var levelData = that.skill.getLevelData();
            if (!(heroDead || isCoolDowning) && randomBuff) {
                tip.toggle('已使用相同效果的技能！');
            } else {
                if (!(isCoolDowning || heroDead)) {
                    that.showCooldown(levelData['cooldown']);
                    if (levelData['duration'] > 0) {
                        randomBuff = true;
                        toggleBufflayer(levelData['duration'], buildSkillBuffDesc(skill), that.skill.getIcon(), function () {
                            randomBuff = false;
                        });
                    }
                    customEventHelper.sendEvent(EVENT.CAST_SKILL, that.skill);
                } else if (isCoolDowning && !heroDead) {
                    console.log('技能【' + that.skill.getId() + "】冷却中，请稍候再点！");
                } else if (heroDead) {
                    tip.toggle('英雄已死亡...');
                }
            }
        });
    };
    this.isCoolDown = function () {
        var cdStartTime = player['time']['cd'][this.skill.getId()];
        return typeof cdStartTime !== 'undefined';
    };
    this.showCooldown = function (cd) {
        if (typeof cd === 'undefined') {
            var cdtime = player['time']['cd'][this.skill.getId()];
            sgt.RouterService.getCurrentTimestamp(function (result, data) {
                cd = this.skill.getLevelData()['cooldown']
                cd = cd - Math.round(data / 1000 - cdtime / 1000);
                if (cd > 0) {
                    this._doCoolDown(cd);
                    console.log('%c ' + this.skill.getId() + ' init cooldown ' + Math.round(data / 1000 - cdtime / 1000), 'color:red')
                } else {
                    delete player['time']['cd'][this.skill.getId()];
                    console.log('%c ' + this.skill.getId() + ' delete cooldown ' + Math.round(data / 1000 - cdtime / 1000), 'color:red')
                }
            }.bind(this));
        } else if (cd > 0) {
            sgt.RouterService.getCurrentTimestamp(function (result, data) {
                player['time']['cd'][this.skill.getId()] = data;
                PlayerData.updatePlayer();
            }.bind(this));
            this._doCoolDown(cd);
        }
    };
    this.showActive = function () {
        this.reviveText.setVisible(false);
        this.time.setVisible(false);
        this.cooldownText.setVisible(false);
    };
    this.setDeadTime = function (time) {
        this.time.setString(time);
    };
    this.setCoolTime = function (time) {
        this.time.setString(time);
    };
    this.init();
    this._bindListeners();
};

var BloodBox = function (root) {
    this.root = root.getChildByName('blood_box');
    this.init();
}
BloodBox.prototype.init = function () {
    this.smallBtn = this.root.getChildByName('small_btn');
    this.smallText = this.root.getChildByName('small_text');
    this.middleBtn = this.root.getChildByName('middle_btn');
    this.middleText = this.root.getChildByName('middle_text');
    this.largeBtn = this.root.getChildByName('large_btn');
    this.largeText = this.root.getChildByName('large_text');
    this.smallText.ignoreContentAdaptWithSize(true);
    this.middleText.ignoreContentAdaptWithSize(true);
    this.largeText.ignoreContentAdaptWithSize(true);
    var updateNum = function (text, num, btn) {
        text.setString(num);
        if (num <= 0) {
            btn.setEnabled(false);
            btn.setBright(false);
        }
    };
    var i = 0;
    var drawMaskLayer = function (root, node) {
        var drawNode = new cc.DrawNode();
        //root.addChild(drawNode, 1000);
        drawNode.clear()
        drawNode.ctor();
        var radius = Math.min(node.width, node.height) / 2 + 0.5;
        var color = cc.color(0, 0, 0, 100);
        var center = cc.p(node.getPositionX() + node.width / 2, node.height / 2);
        drawNode.drawDot(center, radius, color);
        drawNode.drawCircle(center, radius, 360, 60, false, node.width, color);
        return drawNode;
    };
    var MaskLayer = cc.LayerColor.extend({
        m_touchListener: null,
        ctor: function () {
            this._super();
            var touchListener = {
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: this.onTouchBegan,
                isTouchInside: function (owner, touch) {
                    if (!owner || !owner.getParent()) {
                        return false;
                    }
                    var touchLocation = touch.getLocation(); // Get the touch position
                    touchLocation = owner.getParent().convertToNodeSpace(touchLocation);
                    return cc.rectContainsPoint(owner.getBoundingBox(), touchLocation);
                }
            };
            cc.eventManager.addListener(touchListener, this);
            this.m_touchListener = touchListener;
        },
        onTouchBegan: function (touch, event) {
            var target = event.getCurrentTarget();
            return !target.isVisible() || (!this.isTouchInside(target, touch));
        }
    });
    var that = this;
    var initBtn = function (btn, text, data) {
        btn.setEnabled(true);
        btn.setBright(true);
        btn.addClickEventListener(function () {
            customEventHelper.sendEvent(EVENT.USE_GAME_ITEMS, data);
            switch (data.id) {
                case ITEM.small_hp_potion:
                    updateNum(text, --player.resource.small_blood, btn);
                    break;
                case ITEM.medium_hp_potion:
                    updateNum(text, --player.resource.middle_blood, btn);
                    break;
                case ITEM.large_hp_potion:
                    updateNum(text, --player.resource.large_blood, btn);
                    break;
            }
            PlayerData.updatePlayer();
        });
    };
    customEventHelper.bindListener(EVENT.PACK_VALUE_UPDATE, function () {
        refreshNum();
    });
    function refreshNum() {
        updateNum(that.smallText, player.resource.small_blood || (player.resource.small_blood = 100), that.smallBtn);
        updateNum(that.middleText, player.resource.middle_blood || (player.resource.middle_blood = 100), that.middleBtn);
        updateNum(that.largeText, player.resource.large_blood || (player.resource.large_blood = 100), that.largeBtn);
    }

    refreshNum();
    initBtn(this.smallBtn, this.smallText, {id: ITEM.small_hp_potion, name: 'small_btn', num: 1});
    initBtn(this.middleBtn, this.middleText, {id: ITEM.medium_hp_potion, name: 'middle_btn', num: 1});
    initBtn(this.largeBtn, this.largeText, {id: ITEM.large_hp_potion, name: 'large_btn', num: 1});
};
var SkillListMenu = BattleMenu.extend({
    ctor: function (tabPanel, battlePanel) {
        this._super(tabPanel, res.skill_layer_json);

      var getHeroActivtySkillls = function (hero) {
            var skills = hero.getSkills();
            var result = [];
            for (var i in skills) {
                if (skills[i].getType() === 1) {
                    result.push(skills[i]);
                }
            }
            return result;
        };
        /**
         * 初始化药品菜单
         */
        new BloodBox(this.root);
        this.skillBtns = [];
        var skillsBox = this.root.getChildByName('skill_box')
        var atk_text = this.root.getChildByName('atk_text');
        var tatk_text = this.root.getChildByName('tatk_text');
        atk_text.ignoreContentAdaptWithSize(true);
        tatk_text.ignoreContentAdaptWithSize(true);
        customEventHelper.bindListener(EVENT.UPGRADE_HERO_ATTACK, function () {
            var totalHit = PlayerData.getTotalHit();
            var totalAttack = PlayerData.getTotalAttack();
            tatk_text.setString(Math.floor(totalHit));
            atk_text.setString(Math.floor(totalAttack));
        });
        var skillIconTemplate = ccs.csLoader.createNode(res.skill_icon_json).getChildByName('root');
        var heroes = PlayerData.getHeroes();
        var index = 0;
        for (var q in heroes) {
            var hero = heroes[q];
            var activitySkills = getHeroActivtySkillls(hero);
            for (var i = 0; i < activitySkills.length; i++) {
                var skillBtn = new SkillIcon(skillIconTemplate.clone(), index++, skillsBox, activitySkills[i]);
                if (activitySkills[i].getLv() > 0 && !hero.isLocked()) {
                    if (hero.isDead()) {
                        skillBtn.showDead();
                    } else if (skillBtn.isCoolDown()) {
                        skillBtn.showCooldown();
                    }
                }
                this.skillBtns.push(skillBtn);
            }
        }

        function format(time) {
            return new Date(time).Format('mm:ss');
        }

        this.refreshSkillState();
        this.scheduleUpdate();
    },
    refreshSkillState: function () {
        var heroes = PlayerData.getHeroes();
    },
    update: function (dt) {
    },
    onHeroDead: function (_hero) {
        this.refreshSkillState();
    },
    onHeroRecover: function (hero) {
        this.refreshSkillState();
    }
});
function buildSkillBuffDesc(skill, levelData) {
    var effects = skill.traverseSkillEffects();
    return buildDesc(effects, skill.getBuffDesc(), {"duration": skill.getLevelData()['duration']});
}