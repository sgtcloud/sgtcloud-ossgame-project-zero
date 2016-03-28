(function () {
    var NetworkResolve = function () {
    };
    NetworkResolve.prototype = {
        loginSuccess: true,
        getSgtApi: function () {
            return SgtApi || sgt;
        },
        //是否登陆
        isLoginSuccess: function () {
            return this.loginSuccess;
        },
        //微信自动登录业务
        autoWxLoginService: function (wxInfo) {
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: wxInfo.result.wxAppId, // 必填，公众号的唯一标识
                timestamp: wxInfo.result.timestamp, // 必填，生成签名的时间戳
                nonceStr: wxInfo.result.noncestr, // 必填，生成签名的随机串
                signature: wxInfo.result.signature, // 必填，签名，见附录1
                jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            if (SgtApi.context.openid) {
                SgtApi.UserService.login3rd(SgtApi.User.WECHAT_MP, function (result, data) {
                    if (!result) {
                        sgt.WxCentralService.getUserInfo(function (result, data) {
                            if (result) {
                                var user = new SgtApi.User();
                                user.userName = data.openid;
                                user.nickName = data.nickname;
                                user.registryType = SgtApi.User.WECHAT_MP;//注册类型
                                SgtApi.UserService.regist(user, function (result, data) {
                                    if (result) {
                                        console.log(data);
                                        //登陆成功 获取用户存档
                                        this.getPlayerSave(data.userid);
                                    } else {
                                        console.error("注册失败");
                                        this.loginSuccess = false;
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
                        this.getPlayerSave();
                    }
                }.bind(this));
            } else {
                //还未授权，重新授权
                sgt.WxCentralService.auth(wxInfo.result.wxAppId, 'snsapi_userinfo');
            }
        },
        //一般自动登录业务
        autoLoginService: function () {
            SgtApi.UserService.quickLogin(function (result, user) {
                if (result) {
                    if (user !== null) {
                        console.log("自动注册成功" + user);
                        //登陆成功 获取用户存档
                        this.getPlayerSave();
                    }
                } else {
                    console.error('快速注册失败。');
                    this.loginSuccess = false;
                }
            }.bind(this));
        },
        //初始化业务+自动登录
        initAndAutoLogin: function () {
            if (SgtApi) {
                SgtApi.init({appId: 'h5game', async: true});
                if (typeof wx != "undefined" && is_weixin()) {
                    if (getUrlParam('code')) {
                        SgtApi.WxCentralService.getUserAccessToken(getUrlParam('code'), function (result, data) {
                            SgtApi.context.openid = data.openid;
                            SgtApi.context.access_token = data.access_token;
                            localStorage.setItem('sgt-' + SgtApi.context.appId + '-access_token', SgtApi.context.access_token);
                            localStorage.setItem('sgt-' + SgtApi.context.appId + '-openid', SgtApi.context.openid);
                            SgtApi.WxCentralService.getSignature(function (result, data) {
                                if (result)
                                    this.autoWxLoginService(data);
                                else {
                                    console.error("获取签名失败");
                                    this.loginSuccess = false;
                                }
                            }.bind(this));
                        }.bind(this));
                    } else {
                        SgtApi.WxCentralService.getSignature(function (result, data) {
                            if (result)
                                this.autoWxLoginService(data);
                            else {
                                console.error("获取签名失败");
                                this.loginSuccess = false;
                            }
                        }.bind(this));
                    }
                } else {
                    this.autoLoginService();
                }
                //同步服务器时间
                this.syncServerTime();
                setInterval(function () {
                    PlayerData.serverCurrentTime += 100;
                }, 100);
                //同步服务器时间 10分钟校正服务器本地时间
                //setInterval(syncTime,600*1000);
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
        getPlayerSave: function () {
            sgt.PlayerService.getByUserId(sgt.context.user.userid, function (result, data) {
                console.log("getByUserId" + result);
                this.buildCustomService();
                if (result) {
                    console.log("成功获取用户角色" + data);
                    if (cc.isArray(data) && data.length > 0) {
                        var playerData = data[0];
                        PlayerData.modelPlayer = playerData;
                        sgt.PlayerExtraService.getPlayerExtraById(playerData.id, function (result, data) {
                            if (result) {
                                if (cc.isObject(data) && data.content) {
                                    //PlayerData.modelSave = data;
                                    PlayerData.init(JSON.parse(data.content));
                                    //localStorage.setItem("save", data.content);
                                } else {
                                    //没有存档
                                    PlayerData.init();
                                    console.log("当前用户没有存档");
                                }
                            }
                        });
                    } else {
                        //未创建用户
                        console.log("未创建角色");
                    }
                } else {
                    console.error("失败获取用户角色" + data);
                    this.loginSuccess = false;
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
        updatePlayerMails: function (timestramp) {
            this.syncServerTime(function () {
                timestramp = PlayerData.serverCurrentTime - timestramp;
                sgt.MailService.receiveUnread(timestramp, player.id, function (result, data) {
                    if (result && cc.isArray(data) && data.length > 0) {
                        PlayerData.mails.unreadMails = PlayerData.mails.unreadMails.concat(data);
                    }
                })
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
        _setAttachments: function (rewards, obj) {
            if (obj.attachments.hasOwnProperty(rewards['unit'])) {
                obj.attachments[rewards['unit']] += rewards['value'];
            } else {
                obj.attachments[rewards['unit']] = rewards['value'];
            }
        },
        readAndPickAttachment: function (mail, obj, callback) {
            var rewards = JSON.parse(mail.attachment);
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
            if(leaderId === 'pvp_rank'){
                this.arenaService.getPlayersByIndex([0,1,2,3,4,5,6,7,8,9],'pvp_rank',callback);
            }else{
                SgtApi.LeaderBoardService.getTopLeaderBoardScoreByLeaderId(leaderId, 0, 9, callback);
            }
        }
        ,
        getMyRankByType: function (leaderId, callback) {
            if(leaderId === 'pvp_rank'){
                this.arenaService.addToEnd('pvp_rank',player.id,callback);
            }else {
                SgtApi.LeaderBoardService.getLeaderBoardScoreByLeaderIdAndPlayerId(leaderId, player.id, function(result,data){
                    if(result && cc.isObject(data)){
                        return callback(true,data.index);
                    }else{
                        return callback(false);
                    }
                });
            }
        },
        checkIn_createByValidate: function () {
            sgt.CheckinBoardService.validateCheckin(player.id, 'h5game', function (result1, data1) {
                //true 可以签到 false 不能签到
                if (result1 && data1) {
                    //获取累计签到次数
                    sgt.CheckinBoardService.accumulateCount(player.id, 'h5game', function (result2, data2) {
                        if (result2) {
                            sgt.CheckinBoardService.getRewardByCheckinBoardId('h5game', function (result3, data3) {
                                if (result3) {
                                    var checkInUnit = new CheckInPanel();
                                    checkInUnit.initDate(data3, data2);
                                    GamePopup.openPopup(checkInUnit);
                                } else {
                                    console.error('sgt.CheckinBoardService.getRewardByCheckinBoardId:' + data3);
                                }
                            });
                        } else {
                            console.error('sgt.CheckinBoardService.accumulateCount:' + data2);
                        }
                    })
                } else {
                    console.log('已签到');
                }
            });
        }, _getBonus: function (icon, image2, image3, bonus) {
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
                    PlayerData.modelPlayer = data;
                    PlayerData.init();
                    return callback(true);
                } else {
                    return callback(false);
                }
            });
        },
        openNewNameLayer: function (scene,cb) {
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
                            })
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
            });
            createPlayer.setPosition(cc.p(140, 400));
            scene.addChild(createPlayer, 100);
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
                    if(isNaN(player.completed_order_total[obj.chargePoint.id])){
                        if (cc.isNumber(obj.chargePoint.firstChargeRewardAmount) && obj.chargePoint.firstChargeRewardAmount > 0) {
                            amount += obj.chargePoint.firstChargeRewardAmount;
                        }
                        player.completed_order_total[obj.chargePoint.id] = 1;
                    }else{
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
            this.arenaService = sgt.getCustomService('arena', ["getPlayersByIndex", "addToEnd", "fightResult", "checkInArena","createArenaChallenge","updateChallenge","getTopChallenges"]);
        },
        initArenaBattle: function(id,callback){
            sgt.PlayerExtraService.getPlayerExtraById(id, function (result, data) {
                if (result) {
                    if (cc.isObject(data) && data.content) {
                        return callback(true,JSON.parse(data.content));
                    } else {
                        //没有存档
                        console.log("当前用户没有存档");
                        return callback(false);
                    }
                }
            });
        }
    };
    window.Network = new NetworkResolve();
})();
