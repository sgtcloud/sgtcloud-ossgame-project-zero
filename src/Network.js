(function () {
    var NetworkResolve = function () {
    };
    NetworkResolve.prototype = {
        getSgtApi: function () {
            return SgtApi || sgt;
        },
        //微信自动登录业务
        autoWxLoginService: function (wxInfo, cb) {
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: wxInfo.result.wxAppId, // 必填，公众号的唯一标识
                timestamp: wxInfo.result.timestamp, // 必填，生成签名的时间戳
                nonceStr: wxInfo.result.noncestr, // 必填，生成签名的随机串
                signature: wxInfo.result.signature, // 必填，签名，见附录1
                jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            if (SgtApi.context.openid) {
                SgtApi.UserService.login3rd_manual(SgtApi.User.WECHAT_MP, function (result, data) {
                    if (!result) {
                        sgt.WxCentralService.getUserInfo(function (result, data) {
                            if (result) {
                                var user = new SgtApi.User();
                                user.userName = data.openid;
                                user.nickName = data.nickname;
                                user.registryType = SgtApi.User.WECHAT_MP;//注册类型
                                SgtApi.UserService.regist_manual(user, function (result, data) {
                                    if (result) {
                                        console.log(data);
                                        //登陆成功 获取用户存档
                                        // this.getPlayerSave();
                                        cb();
                                    } else {
                                        // console.error("注册失败");
                                        cb("注册失败");
                                        // this.loginSuccess = false;
                                        //注册失败
                                    }
                                }.bind(this));
                            } else {
                                //授权异常，重新授权
                                sgt.WxCentralService.auth(wxInfo.result.wxAppId, 'snsapi_userinfo');
                            }
                        }.bind(this));
                    } else {
                        console.log(data);
                        //登陆成功 获取用户存档
                        //this.getPlayerSave(cb);
                        cb();
                    }
                }.bind(this));
            } else {
                //还未授权，重新授权
                sgt.WxCentralService.auth(wxInfo.result.wxAppId, 'snsapi_userinfo');
            }
        },
        //一般自动登录业务
        autoLoginService: function (cb) {
            var isVisitor = localStorage.getItem('is-sgt-html5-game-visitor');
            if (!isVisitor) {
                localStorage.setItem('is-sgt-html5-game-visitor', 1);
            }
            SgtApi.UserService.quickLogin_manual(function (result, user) {
                if (result) {
                    if (user !== null) {
                        // console.log("自动注册成功" + user);
                        //登陆成功 获取用户存档
                        //this.getPlayerSave(cb);
                        SgtApi.context.user = user;
                        cb();
                    } else {
                        cb('用户信息异常');
                    }
                } else {
                    // console.error('快速注册失败。');
                    cb('快速注册失败。');
                    // this.loginSuccess = false;
                }
            }.bind(this));
        },
        getSignature: function (cb) {
            SgtApi.WxCentralService.getSignature(function (result, data) {
                if (result)
                    this.autoWxLoginService(data, cb);
                else {
                    // console.error("获取签名失败");
                    cb("获取签名失败");
                    // this.loginSuccess = false;
                }
            }.bind(this));
        },
        //初始化业务+自动登录
        initAndAutoLogin: function (cb) {
            if (SgtApi) {
                SgtApi.init({appId: 'h5game', async: true});
                //自定义异常提示
                SgtApi.customException(CONSTS.exceptions);
                if (typeof wx != "undefined" && is_weixin()) {
                    if (getUrlParam('code')) {
                        SgtApi.WxCentralService.getUserAccessToken(getUrlParam('code'), function (result, data) {
                            SgtApi.context.openid = data.openid;
                            SgtApi.context.access_token = data.access_token;
                            localStorage.setItem('sgt-' + SgtApi.context.appId + '-access_token', SgtApi.context.access_token);
                            localStorage.setItem('sgt-' + SgtApi.context.appId + '-openid', SgtApi.context.openid);
                            this.getSignature(cb);
                        }.bind(this));
                    } else {
                        this.getSignature(cb);
                    }
                } else {
                    this.autoLoginService(cb);
                }
                //同步服务器时间
                this.syncServerTime();
                setInterval(function () {
                    PlayerData.serverCurrentTime += 100;
                }, 100);
            } else {
                cb('上下文中没有引入sgt-sdk');
            }
        },

        //同步服务器时间
        syncServerTime: function (callback) {
            sgt.RouterService.getCurrentTimestamp(function (result, data) {
                if (result) {
                    PlayerData.serverCurrentTime = data;
                    console.log('同步服务器时间：' + data);
                } else {
                    console.error('同步服务器时间失败');
                }
                if (callback)
                    return callback(result);
            });
        },
        //获取角色信息+存档信息（扩展信息）
        getPlayerSave: function (cb) {
            sgt.PlayerService.getByUserId(sgt.context.user.userid, function (result, data) {
                // console.log("getByUserId" + result);
                this.buildCustomService();
                if (result) {
                    // console.log("成功获取用户角色" + data);
                    if (cc.isArray(data) && data.length > 0) {
                        var playerData = data[0];
                        PlayerData.modelPlayer = playerData;
                        sgt.PlayerExtraService.getPlayerExtraById(playerData.id, function (result, data) {
                            if (result) {
                                if (cc.isObject(data) && data.content) {
                                    PlayerData.modelSave = data;
                                    //PlayerData.init(JSON.parse(data.content));
                                    //localStorage.setItem("save", data.content);
                                } else {
                                    //没有存档
                                    //PlayerData.init();
                                    // console.log("当前用户没有存档");
                                }
                                cb();
                            } else {
                                cb('获取存档出错');
                            }
                        });
                    } else {
                        //未创建用户
                        // console.log("未创建角色");
                        cb();
                    }
                } else {
                    // console.error("失败获取用户角色" + data);
                    cb("失败获取用户角色" + data);
                    // this.loginSuccess = false;
                }
            }.bind(this))
        },
        getReadedAndUnreadedMails: function () {
            sgt.MailService.getReadedAndUnreadedMails(player.id, function (result, data) {
                if (result && cc.isObject(data)) {
                    PlayerData.mails = data;
                }
            })
        },
        updatePlayerMails: function (timestamp) {
            this.syncServerTime(function () {
                timestamp = PlayerData.serverCurrentTime - timestamp;
                sgt.MailService.receiveUnread(timestamp, player.id, function (result, data) {
                    if (result && cc.isArray(data) && data.length > 0) {
                        PlayerData.mails.unreadMails = PlayerData.mails.unreadMails.concat(data);
                    }
                });
            });
        },
        updateunReadMailStatus: function (callback) {
            var unReadMailIds = [];
            var temp = PlayerData.mails.unreadMails;
            if (PlayerData.mails.unreadMails.length > 0) {
                for (var i in PlayerData.mails.unreadMails) {
                    unReadMailIds.push(PlayerData.mails.unreadMails[i]['id']);
                    PlayerData.mails.unreadMails[i]['status'] = sgt.Mail.READ;
                }
                sgt.MailService.readMail(unReadMailIds, function (result) {
                    if (result) {
                        PlayerData.mails.readedMails = PlayerData.mails.readedMails.concat(PlayerData.mails.unreadMails);
                        PlayerData.mails.unreadMails = [];
                        console.log('批量阅读邮件');
                    } else {
                        console.log('%c批量阅读邮件失败', 'color:red');
                        PlayerData.mails.unreadMails = temp;
                    }
                    return callback(result);
                });
            } else {
                return callback(true);
            }
        },
        _setAttachments: function (reward, obj) {
            var unit;
            var value;
            if (reward.hasOwnProperty('unit')) {
                unit = reward["unit"];
                value = reward["value"];
            } else {
                for (var key in reward) {
                    unit = key;
                    value = reward[key];
                }
            }
            if (obj.attachments.hasOwnProperty(unit)) {
                obj.attachments[unit] += value;
            } else {
                obj.attachments[unit] = value;
            }
        },
        readAndPickAttachment: function (mail, obj, callback) {
            var rewards = /*JSON.parse*/eval("(" + mail.attachment + ")");
            if (rewards instanceof Array) {
                for (var i in rewards) {
                    this._setAttachments(rewards[i], obj);
                }
            } else {
                this._setAttachments(rewards, obj);
            }
            sgt.MailService.readAndPickAttachment(mail.id, function (result) {
                if (result) {
                    mail['attachStatus'] = sgt.Mail.STATUS_ATTACH_PICKED;
                    PlayerData.updateResource(rewards);
                    customEventHelper.sendEvent(EVENT.UPDATE_RESOURCE, rewards);
                    PlayerData.updatePlayer();
                    obj.attachNoPickNum--;
                    obj.setNum();
                    if (obj.attachNoPickNum == 0) {
                        var descText = "";
                        for (var key in  obj.attachments) {
                            descText += CONSTS.resources_mapping[key] + " * " + obj.attachments[key] + ",";
                        }
                        if (descText) {
                            descText = descText.substr(0, descText.length - 1);
                            tip.toggle({'delay': 2.0, 'text': '成功领取：' + descText});
                        }
                        obj.initData();
                    }
                }
                if (callback) {
                    return callback(result);
                }
            });
        },
        pickAttachment: function (btn, btnText, mail, rewards, descText, obj) {
            sgt.MailService.readAndPickAttachment(mail.id, function (result) {
                if (result) {
                    tip.toggle('成功领取：' + descText);
                    obj.attachNoPickNum--;
                    //移除已领取的mailId
                    //this.attachNoPicks.splice(this.attachNoPicks.indexOf(mail.id),1);
                    obj.setNum();
                    btn.setEnabled(false);
                    btn.setBright(false);
                    btn.setColor(cc.color(90, 90, 90));
                    btnText.setColor(cc.color(90, 90, 90));
                    mail['attachStatus'] = sgt.Mail.STATUS_ATTACH_PICKED;
                    PlayerData.updateResource(rewards);
                    customEventHelper.sendEvent(EVENT.UPDATE_RESOURCE, rewards);
                    PlayerData.updatePlayer();
                }
            }.bind(this));
        },
        deleteAllMails: function (obj, callback) {
            if (obj.attachPicks.length > 0) {
                var tempArray = PlayerData.mails.readedMails;
                for (var i = 0; i < PlayerData.mails.readedMails.length; i++) {
                    var mail = PlayerData.mails.readedMails[i];
                    if (!mail.attachment || mail.attachStatus == 1) {
                        PlayerData.mails.readedMails.splice(i, 1);
                        i--;
                    }
                }
                sgt.MailService.deleteMail(obj.attachPicks, function (result) {
                    if (result) {
                        console.log('删除成功');
                        this.initData();
                    } else {
                        console.log('%c删除失败', 'color:red');
                        PlayerData.mails.readedMails = tempArray;
                    }
                    if (callback) {
                        return callback(result);
                    }
                }.bind(obj));
            }
        },
        updateLeaderBoardScore: function (stageNum, leaderId) {
            sgt.LeaderBoardService.submitLeaderBoardScore(leaderId, player.id, stageNum);
        },
        //上传存档到服务器
        updatePlayerSave: function () {
            if (PlayerData.isUpdate) {
                var playerExtra = new SgtApi.PlayerExtra();
                playerExtra.content = JSON.stringify(player);
                playerExtra.playerId = player.id;
                sgt.PlayerExtraService.updatePlayerExtraMap(playerExtra, function (result, data) {
                    console.log('上传存档：' + result + ",内容为" + data);
                });
                PlayerData.isUpdate = false;
            }
        },
        updatePlayer: function (modelPlayer, callback) {
            //localStorage.setItem("save", JSON.stringify(player));
            PlayerData.isUpdate = true;
            if (modelPlayer.level != PlayerData.heroes[0].getLv()) {
                modelPlayer.level = PlayerData.heroes[0].getLv();
                sgt.PlayerService.update(modelPlayer, function (result) {
                    if (callback) {
                        return callback(result);
                    }
                });
            }
        },
        getCurrentRanksByType: function (leaderId, callback) {
            if (leaderId === 'pvp_rank') {
                this.arenaService.getPlayersByIndex([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 'pvp_rank', callback);
            } else {
                SgtApi.LeaderBoardService.getTopLeaderBoardScoreByLeaderId(leaderId, 0, 9, callback);
            }
        }
        ,
        getMyRankByType: function (leaderId, callback) {
            if (leaderId === 'pvp_rank') {
                this.arenaService.getIndexFromLeaderBoard('pvp_rank', player.id, callback);
            } else {
                SgtApi.LeaderBoardService.getLeaderBoardScoreByLeaderIdAndPlayerId(leaderId, player.id, function (result, data) {
                    if (result && cc.isObject(data)) {
                        return callback(true, data.index);
                    } else {
                        return callback(false);
                    }
                });
            }
        },
        checkIn_createByValidate: function (isIgnoreCheckIn) {
            sgt.CheckinBoardService.validateCheckin(player.id, 'h5game', function (result, data) {
                if (result) {
                    //data 为 true 可以签到 false 不能签到
                    //isIgnoreCheckIn 为 true,已签到状态也打开面板;false,只有未签到才打开面板
                    if(isIgnoreCheckIn){
                        this.openCheckInPanel(data);
                    }else if(data){
                        this.openCheckInPanel(true);
                    }
                } else {
                    console.log('签到异常');
                }
            }.bind(this));
        },openCheckInPanel: function(isCheckIn){
            //获取累计签到次数
            sgt.CheckinBoardService.accumulateCount(player.id, 'h5game', function (result, data) {
                if (result) {
                    sgt.CheckinBoardService.getRewardByCheckinBoardId('h5game', function (result2, data2) {
                        if (result2) {
                            CheckInPanel.open(data2, data,isCheckIn);
                        } else {
                            console.error('sgt.CheckinBoardService.getRewardByCheckinBoardId:' + data2);
                        }
                    });
                } else {
                    console.error('sgt.CheckinBoardService.accumulateCount:' + data);
                }
            })
        },_getBonus: function (icon, image2, image3, bonus) {
            icon.setTouchEnabled(false);
            icon.setColor(cc.color(90, 90, 90));
            image3.setVisible(true);
            image2.setVisible(false);
            PlayerData.updateResource(bonus);
            customEventHelper.sendEvent(EVENT.UPDATE_RESOURCE, bonus);
            PlayerData.updatePlayer();
        },
        checkin: function (icon, image2, image3, bonus, layer) {
            //sgt.CheckinBoardService.validateCheckin(player.id,'h5game',function(result1,data1) {
            //true 可以签到 false 不能签到
            //if (result1 && data1) {
            sgt.CheckinBoardService.checkin(player.id, 'h5game', function (result, data) {
                if (result) {
                    var text = '签到成功，成功获取了以下奖励：\n';
                    for (var i in bonus) {
                        text += (" " + CONSTS.resources_mapping[bonus[i]['unit']] + " * " + bonus[i]['value']);
                    }
                    tip.toggle({
                        beforeShow: [cc.callFunc(function () {
                            this._getBonus(icon, image2, image3, bonus)
                        }.bind(this))], afterHide: [cc.callFunc(function () {
                            GamePopup.closePopup(layer)
                        })]
                        , delay: 2.0, text: text
                    });
                } else {
                    console.log("签到失败");
                }
            }.bind(this));
            //}else{
            //    tip.toggle('今天已签到');
            //}
            //});
        },
        _addPlayer: function (playerName, callback) {
            var sgtPlayer = new sgt.Player();
            sgtPlayer.name = playerName;
            sgtPlayer.userId = sgt.context.user.userid;
            sgtPlayer.level = 1;
            sgtPlayer.avatarUrl = "h102.png";
            sgt.PlayerService.create(sgtPlayer, function (result, data) {
                if (result) {
                    //初始化角色存档
                    //异步加载全部资源
                    cc.loader.load(full_resouces, function () {
                        localStorage.setItem('mark-sgt-html5-game', 1);
                        PlayerData.modelPlayer = data;
                        return callback(true);
                    });
                } else {
                    return callback(false);
                }
            });
        },
        openNewNameLayer: function (scene, cb) {
            var createPlayer = ccs.csLoader.createNode(res.createPlayer);
            var root = createPlayer.getChildByName('root');
            var dice = root.getChildByName('dice');
            var name_text = root.getChildByName('name_text');
            var btn = root.getChildByName('btn');
            bindButtonCallback(btn, function () {
                var playName = name_text.getString();
                if (cc.isString(playName)) {
                    sgt.PlayerService.getByName(playName, 1, 1, function (result, data) {
                        if (cc.isArray(data) && data.length > 0) {
                            BasicPopup.alert("友情提醒", '角色名"' + playName + '"已存在');
                        } else {
                            tip2.toggle({'delay': 30, 'text': '正在创建角色并初始化游戏。。。。。。'});
                            this._addPlayer(playName, function () {
                                createPlayer.removeFromParent(true);
                                PlayerData.isUpdate = true;
                                Network.updatePlayerSave();
                                tip2.stopAllActions();
                                tip2.setVisible(false);
                                initGame(cb);
                            });
                        }
                    }.bind(this));
                } else {
                    BasicPopup.alert("友情提醒", "角色名字格式不正确");
                }
            }.bind(this));
            bindButtonCallback(dice, function () {
                sgt.RandomNameGroupService.defaultRandomName(function (result, data) {
                    name_text.setString(data);
                });
            });
            sgt.RandomNameGroupService.defaultRandomName(function (result, data) {
                name_text.setString(data);
                createPlayer.setPosition(cc.p(140, 400));
                scene.addChild(createPlayer, 100);
            });

        },
        chooseWXPay: function (chargePoint, callback) {
            var desc = '购买' + chargePoint.name + " " + chargePoint.amount;
            sgt.WxCentralService.getPayOrder(desc, chargePoint.money, player.id, function (result, order) {
                if (result) {
                    var obj = {"orderId": order.did, "chargePoint": chargePoint};
                    PlayerData.addPlayerNoPayOrders(obj);
                    //微信支付
                    wx.chooseWXPay({
                        timestamp: order.time_start, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                        nonceStr: order.nonce_str, // 支付签名随机串，不长于 32 位
                        package: 'prepay_id=' + order.prepay_id, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                        signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                        paySign: order.paySign, // 支付签名
                        success: function () {
                            // 支付成功后的回调函数验证是否支付成功 暂为异步。
                            this.queryByDid(obj);
                            tip.toggle('购买成功');
                            return callback(true);
                        }.bind(this),
                        fail: function () {
                            tip.toggle('购买失败');
                            return callback(false);
                        }, cancel: function () {
                            tip.toggle('购买取消');
                            return callback(false);
                        }
                    });
                } else {
                    return callback(false);
                }
            }.bind(this));
        },
        //验证是否支付成功
        queryByDid: function (obj) {
            SgtApi.DelegateDidService.queryByDid(obj.orderId, function (result1, data) {
                if (result1 && cc.isNumber(data.updateTime)) {

                    var amount = obj.chargePoint.amount;
                    //判断当前充值项是否为首冲
                    if (player.vip < 2) {
                        /*if (cc.isNumber(obj.chargePoint.firstChargeRewardAmount) && obj.chargePoint.firstChargeRewardAmount > 0) {
                         amount += obj.chargePoint.firstChargeRewardAmount;
                         }*/
                        //在此只做标示是否充值过。
                        player.vip = 2;
                    }
                    if (isNaN(player.completed_order_total[obj.chargePoint.id])) {
                        if (cc.isNumber(obj.chargePoint.firstChargeRewardAmount) && obj.chargePoint.firstChargeRewardAmount > 0) {
                            amount += obj.chargePoint.firstChargeRewardAmount;
                        }
                        player.completed_order_total[obj.chargePoint.id] = 1;
                    } else {
                        player.completed_order_total[obj.chargePoint.id] += 1;
                    }
                    if (obj.chargePoint.type === 'mCard') {
                        //第一次购买 或者 当前没有有效月卡
                        if (!player.month_card_end_time) {
                            //发送邮件
                            this.sendSystemMail('月卡title', '月卡内容', JSON.stringify(CONSTS.monthCard_daily_bonus), function (result, data) {
                            });
                        } else {
                            //判断月卡有效性
                            if (getDays(PlayerData.getServerTime(), player.month_card_end_time) < 0) {
                                //发送邮件
                                this.sendSystemMail('月卡title', '月卡内容', JSON.stringify(CONSTS.monthCard_daily_bonus), function (result, data) {
                                });
                            }
                        }
                        PlayerData.updatePlayerMCardInfo();
                    } else {
                        var resource = PlayerData.createResourceData(obj.chargePoint.type, amount);
                        PlayerData.updateResource(resource);
                        customEventHelper.sendEvent(EVENT.UPDATE_RESOURCE, resource);
                        PlayerData.delePlayerNoPayOrdersById(obj);
                        PlayerData.updatePlayer();
                        //直接上传服务器需放到updatePlayer 之后
                        this.updatePlayerSave();
                    }
                }
            }.bind(this))
        },
        queryByCondition: function () {
            SgtApi.DelegateDidService.queryByCondition(player.id, function (result, data) {
                if (result && cc.isArray(data) && data.length > 0) {
                    for (var i in data) {
                        if (data[i].updateTime > 0) {
                            return true;
                        }
                    }
                }
                return false;
            })
        },
        sendSystemMail: function (title, content, attachment, callback) {
            var mail = new SgtApi.Mail();
            mail.title = title;
            mail.type = SgtApi.Mail.TYPE_SYSTEM;
            mail.toId = player.id;
            mail.toName = player.name;
            mail.fromId = -1;
            mail.fromName = "GM";
            mail.attachment = attachment;
            mail.content = content;
            SgtApi.MailService.sendMail(mail, callback);
        },
        buildCustomService: function () {
            this.arenaService = sgt.getCustomService('arena', ["getPlayersByIndex", "getIndexFromLeaderBoard", "pushAndInitTimesIfNecessity", "fightResult", "checkInArena", "createArenaChallenge", "updateChallenge", "getTopChallenges"]);
            this.taskServiceExt = sgt.getCustomService('taskachieve', ["getDailyTaskByTypes", "getAchievementTaskByTypes"]);
        },
        initArenaBattle: function (id, callback) {
            sgt.PlayerExtraService.getPlayerExtraById(id, function (result, data) {
                if (result) {
                    if (cc.isObject(data) && data.content) {
                        return callback(true, JSON.parse(data.content));
                    } else {
                        //没有存档
                        console.log("当前用户没有存档");
                        return callback(false);
                    }
                }
            });
        },
        getAnnounceByType: function (type, i, cb) {
            sgt.AnnouncementService.getAllServerAnnounceByType(type, function (result, data) {
                if (result && cc.isObject(data)) {
                    //if(cc.isObject(PlayerData.announces) && [types[i]])
                    PlayerData.updateAnnounces(i, data);
                    cb();
                } else if (!result) {
                    cb('获取公告出错了', data);
                } else {
                    cb();
                }
            });
        },
        getAnnounces: function () {
            var types = [SgtApi.Announcement.ACTIVITY, SgtApi.Announcement.MAINTAIN, SgtApi.Announcement.BULLETIN];
            var tasks = [];
            var self = this;
            /*for(var i in types){
             var type = types[i];
             tasks.push(function(cb){
             self.getAnnounceByType(type,i,cb);
             });
             }*/
            tasks.push(function (cb) {
                self.getAnnounceByType(types[0], 0, cb);
            }, function (cb) {
                self.getAnnounceByType(types[1], 1, cb);
            }, function (cb) {
                self.getAnnounceByType(types[2], 2, cb);
            });
            return tasks;
        },
        redeemAndGetReward: function (giftCode) {
            SgtApi.GiftCodeService.redeem(player.id, giftCode, function (result, data) {
                if (result) {
                    if (cc.isString(data)) {
                        data = JSON.parse(data);
                        tip.toggle(formatResourceToString(data));
                        PlayerData.updateResource(data);
                        customEventHelper.sendEvent(EVENT.UPDATE_RESOURCE, data);
                        PlayerData.isUpdate = true;
                        this.updatePlayerSave();
                    } else {
                        //没有礼包
                    }
                    return true;
                } else {
                    tip.toggle(data);
                    return false;
                }
            }.bind(this));
        },
        getServerList: function (isAuto, cb) {
            if (isAuto) {
                var servers = PlayerData.getLocalServerList();
                if (cc.isArray(servers) && servers.length > 0) {
                    return cb();
                    //return servers[servers.length-1];
                }
            }

            SgtApi.RouterService.getServerList(function (result, data) {
                if (result) {
                    if (cc.isArray(data)) {
                        PlayerData.servers = data.reverse();
                    }
                    cb();
                } else {
                    cb('获取服务器列表出错');
                }
            })
        },
        setServerInfo: function (server) {
            console.log(JSON.stringify(server));
            SgtApi.context.server = server;
        },
        updateLocalServerList: function () {
            var servers = PlayerData.getLocalServerList();
            for(var i in servers){
                //更新排序
                if(servers[i].id === SgtApi.context.server.id){
                    servers.splice(i, 1);
                    break;
                }
            }
            servers.push(SgtApi.context.server);
            localStorage.setItem("sgt-html5-game-announce-servers", JSON.stringify(servers));
        },
        //手动获取所有服务器数据
        getAllServer: function (cb) {
            if (typeof(PlayerData.servers) === 'undefined') {
                Network.getServerList(false, function (result) {
                    if (result) {
                        cb('当前应用没有服务器');
                    } else {
                        cb();
                    }
                });
            } else {
                cb();
            }
        },
        openLoginPopup: function(user_text){
            var login = new LoginPanel(/*null*//*sgt.context.user,*/user_text);
            login.openLoginPopup();
        },
        register: function(username,pwd,type,userBtn,callback){
            if(type === 1){
                SgtApi.UserService.updateUserNameAndPassword(SgtApi.context.user.userid,username,pwd,function(result,data){
                    if(result){
                        userBtn.setVisible(false);
                        sgt.UserService.saveLocalStorage(username,pwd);
                        localStorage.setItem('is-sgt-html5-game-visitor',2);
                    }
                    callback(result, data);
                });
            } else {
                var user = new SgtApi.User();
                user.userName = username;
                user.password = pwd;
                SgtApi.UserService.regist_manual(user, callback);
            }
        },
        login: function (username, pwd, callback) {
            SgtApi.UserService.login_manual(username, pwd, function (result, data) {
                if (result) {
                    localStorage.setItem('is-sgt-html5-game-visitor', 2);
                    sgt.UserService.saveLocalStorage(username, pwd);
                }
                callback(result, data);
            });
        },
        showCover: function () {
            var json = ccs.load(res.cover_scene_json);
            var scene = json.node.getChildByName('root');
            scene.setAnchorPoint(cc.p(0, 0));
            scene.runAction(json.action);
            var loginBtn = scene.getChildByName("cover_login_btn");
            var btn = loginBtn.getChildByName('btn');
            var chooseBtn = scene.getChildByName('choose');
            var text = chooseBtn.getChildByName('text');
            var state = chooseBtn.getChildByName('state');
            var list_btn = chooseBtn.getChildByName('list_btn');
            var full = chooseBtn.getChildByName('full');
            var user_layout = scene.getChildByName("user");
            var user_text = user_layout.getChildByName("text");
            tipTemplate = ccs.load(res.tips).node.getChildByName("root");
            window.tip2 = new Tip(scene);
            chooseBtn.setVisible(false);
            user_layout.setVisible(false);
            btn.setEnabled(false);
            btn.setBright(false);
            this.initData = function () {
                var tasks = Network.getAnnounces();
                tasks.push(function (cb) {
                    var done = false;
                    json.action.setLastFrameCallFunc(function () {
                        if (!done) {
                            done = true;
                            cb();
                        }
                    });
                    json.action.play('show', false);
                }, function (cb) {
                    Network.getServerList(true, cb);
                });
                async.parallel(tasks, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        this.RefreshStatus();
                    }
                }.bind(this));
            };
            this.RefreshStatus = function () {
                NoticePanel.open(true);
                btn.setEnabled(true);
                btn.setBright(true);
                chooseBtn.setVisible(true);
                user_layout.setVisible(true);
                var server;
                if (PlayerData.servers) {
                    server = PlayerData.servers[0];
                    server.isNew = true;
                } else {
                    var servers = PlayerData.getLocalServerList();
                    server = servers[servers.length - 1];
                }
                state.setVisible(server.isNew);
                full.setVisible(!server.isNew);
                var isVisitor = localStorage.getItem('is-sgt-html5-game-visitor');
                if (!isVisitor || parseInt(isVisitor) === 1) {
                    user_text.setString('游客账号');
                } else {
                    user_text.setString(sgt.context.user.userName);
                }
                //Network.setServerInfo(server);
                SgtApi.context.server = server;
                text.setString(server.name);
                chooseBtn.setTouchEnabled(false);
                loginBtn.setTouchEnabled(false);
                user_layout.setTouchEnabled(false);
                btn.setTouchEnabled(false);
                list_btn.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
                bindTouchEventListener(function () {
                    ChooseServerPanel.open(chooseBtn);
                    return true;
                }, chooseBtn);
                bindButtonCallback(list_btn, function () {
                    ChooseServerPanel.open(chooseBtn);
                });
                bindTouchEventListener(function(){
                    this.EnterGame();
                    return true;
                }.bind(this), loginBtn);
                bindTouchEventListener(function () {
                    Network.openLoginPopup(user_text);
                    return true;
                }, user_layout);
            };
            this.EnterGame = function () {
                SgtApi.CreateServices();
                Network.updateLocalServerList();
                Network.getPlayerSave(function (result) {
                    if (result) {
                        console.log(JSON.stringify(result));
                        return false;
                    }
                    //判断当前用户是否存在角色
                    if (!PlayerData.modelPlayer) {
                        loginBtn.setVisible(false);
                        chooseBtn.setVisible(false);
                        user_layout.setVisible(false);
                        Network.openNewNameLayer(scene, createPlayerComplete);
                    } else {
                        var mark = localStorage.getItem('mark-sgt-html5-game');
                        if (mark) {
                            tip2.toggle({'delay': 30, 'text': '正在加载角色数据并初始化游戏。。。。。。'});
                            initGame(createPlayerComplete);
                            tip2.stopAllActions();
                            tip2.setVisible(false);
                        } else {
                            async.series({
                                "flag1": function (callback) {
                                    tip2.toggle({'delay': 30, 'text': '正在加载角色数据并初始化游戏。。。。。。'});
                                    cc.loader.load(getSecondResource(), function () {
                                        initGame(createPlayerComplete);
                                        tip2.stopAllActions();
                                        tip2.setVisible(false);
                                        callback(null, "flag1");
                                    });
                                }, "flag2": function (callback) {
                                    //异步加载全部资源
                                    cc.loader.load(full_resouces, function () {
                                        localStorage.setItem('mark-sgt-html5-game', 1);
                                        console.log("flag2正在执行好了");
                                        callback(null, "flag2");
                                    });
                                }
                            }, function (callback) {
                                console.log(callback);
                            });
                        }
                    }
                    return true;
                });
            };
            this.initData();
            cc.director.runScene(scene);
        }

    };
    window.Network = new NetworkResolve();
})();
