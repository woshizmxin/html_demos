
// 个人中心-
mt.me = {
    page: '-/acc/home'
    , init: function () {

        $('.hdbtnr').off('click').on('click', function () {
            location = '/';
        }).addClass('hd_home');

        var getAge = function (birthday) {
            var d1 = (sjson.data.server_time).toDate();
            var d2 = birthday.toDate();
            var dd = (d1.getTime() - d2.getTime()) / 1000 / 60 / 60 / 24 / 365;
            dd = dd.toString().split('.')[0];
            if (dd.substr(0, 1) == '-') dd = '0';
            return dd;
        };
        $('.avatar').eq(0).attr('src', sjson.data.avatar.small);
        $('#hnick').html(sjson.data.nickname + (sjson.data.verify ? '<i class="v">V</i>' : ''));
        if (sjson.data.birthday) {
            var s = '<i class="tag {0}">{1} {2}岁</i>'.format(
                (sjson.data.gender == '男' ? 'tagd' : 'tagm')
                , (sjson.data.gender == '男' ? '潮爸' : '辣妈')
                , getAge(sjson.data.birthday)
                );
            $('#ptag').html(s);
        }
        if (!sjson.data.mobile) {
            $('#ptag').next().removeClass('none');
        }
        mt.t.jsonp('users/children', { id: sjson.data.id }, function (ret) {
            var ss = '';
            for (var i = 0; i < ret.length; i++) {
                ss += '<i class="tag {0}">{1}<i class="right">{2}岁</i></i>'.format(
                (ret[i].gender == '男' ? 'tagb' : 'tagg')
                , (ret[i].gender == '男' ? '男孩' : '女孩')
                , getAge(ret[i].birthday)
                );
            }
            if (ss) {
                $('#ptag').append(ss);
            }
        });
        // 通知-
        mt.t.jsonp('users/getnotifications', { user_id: sjson.data.id,_tt:Math.random() }, function (ret) {

            if (ret.invitable)
                $('.invite').append('<em class="dot"></em>');
            if (ret.num_unpaid_orders > 0)
                $('.meod1').parent().append('<em>{0}</em>'.format(ret.num_unpaid_orders));
            if (ret.num_undo_orders > 0)
                $('.meod2').parent().append('<em>{0}</em>'.format(ret.num_undo_orders));
            if (ret.num_uncommented_orders > 0)
                $('.meod3').parent().append('<em>{0}</em>'.format(ret.num_uncommented_orders));

            if (ret.num_favorites > 0)
                $('.utr3').append('<i class="numtag2">{0}</i>'.format(ret.num_favorites));
            if (ret.num_new_coupon_items > 0)
                $('.utr4').append('<i class="numtag2">{0}</i>'.format(ret.num_new_coupon_items));
            if (ret.has_coupon_unread)
                $('.utr4').append('<i class="reddot"></i>');
            if (ret.num_unread_messages > 0)
                $('.utr7').append('<i class="numtag2">{0}</i><i class="reddot"></i>'.format(ret.num_unread_messages));

            $('.utr11').append('<i class="numtag2 money">{0}</i>'.format(ret.remainder||0));
            if (ret.num_unread_cash_logs > 0)
                $('.utr11').append('<i class="reddot"></i>');

            if (ret.credit)
                $('.utr14').append('<i class="numtag2">{0}分</i>'.format(ret.credit));
            if (ret.num_unread_credit_logs > 0)
                $('.utr14').append('<i class="reddot"></i>');

        });      

        mt.t.mclick2('.meod i', function (e) {
            location = $(e).attr('data-href');
        });
        $('.btn-red').click(function () {
            mt.t.confirm('退出后您将看不到您的订单和个人信息，确定退出吗？', null, function () {
                location = '/login/out';
            });
        });
    }
};
// 个人资料-
mt.profile = {
    page: '-/acc/profile'
    , init: function () {
        mt.t.loadJs('/content/scripts/profile.js');
    }
};
// 修改手机-
mt.chgmobile = {
    page: '-/acc/changemobile'
    , init: function () {
        mt.t.head1();
        var hasm = !!sjson.data.mobile;
        if (hasm) {
            $('#mobile').val(sjson.data.mobile);
        }
        $('.btn-red').click(function () {
            var data = {
                mobile: $.trim($('#mobile').val()),
                code: $('#code').val()
            };
            if (!mt.p.check(data)) return;
            if (!data.code) {
                mt.t.alert('请输入验证码'); return;
            }
            mt.t.wait();
            mt.t.post('q=users/bindMobile&tp=log&c=uid', data, function (ret) {
                mt.t.waitok();
                mt.t.alert(hasm ? '新手机号已保存' : '手机号已绑定成功', function () {
                    location = mt.t.query('from') || '/acc/profile';
                });
            });
        });
        $('.btn-red2').click(function () {
            if ($('.btn-red2').hasClass('btn-gray')) return;

            var data = {
                user_id: sjson.data.id,
                mobile: $.trim($('#mobile').val())
            };
            if (!mt.p.check(data)) return;
            // send sms code
            mt.t.wait();
            mt.t.jsonp('users/bindMobile', data, function () {
                mt.t.waitok();
                var i = 60;
                $('.btn-red2').html(i + 's').addClass('btn-gray');
                var inter = setInterval(function () {
                    $('.btn-red2').html(--i + 's');
                    if (i == 0) {
                        $('.btn-red2').html('获 取').removeClass('btn-gray');
                        clearInterval(inter);
                    }
                }, 1000);

            });

        });
    }
    , check: function (data) {
        if (!data.mobile) {
            mt.t.alert('请输入您的手机号'); return false;
        }
        if (!mt.t.check.mobile(data.mobile)) {
            mt.t.alert('手机号格式不正确，请重新输入'); return false;
        }
        if (data.mobile == sjson.data.mobile) {
            mt.t.alert('手机号没有变更'); return false;
        }
        return true;
    }
};
mt.usefocde = {
    page: '-/acc/usefcode'
    , init: function () {
        $('.btn-red').click(function () {
            var data = {
                fcode: $('#fcode').val()
            };
            if (!data.fcode) {
                mt.t.alert('请输入朋友给你的邀请码');
                return;
            }
            mt.t.wait();
            mt.t.post('q=users/addfcode&m=get&c=uid', data, function (ret) {
                mt.t.waitok();
                mt.t.alert('欢迎加入蚂蚁大家庭，<br>30元优惠券已放入您的账户', function () {
                    location = '/acc/home';
                });
            });
        });
    }
};
// 我的订单-
mt.myorders = {
    page: '-/acc/orders(/\\w+)?'
    , init: function () {
        $('.hdbtnr').off('click').on('click', function () {
            location = '/';
        }).addClass('hd_home');

        document.title = ['待付款', '未出行', '待评价', '已完成'][mt.t.id];

        var ispaid = mt.t.id != 0;
        var s = '';
        s += '<div class="obox" data-id="{0}">';
        s += '<div class="ohd"><i class="left">{1}</i><i class="money">{2}</i></div>';
        s += '<div class="obd goto" data-href="/order/details/{0}">';
        s += '<h2 class="f34">{3}</h2>';
        s += '{4}';
        s += '</div>';

        mt.t.jsonp('users/orders', { id: sjson.data.id, type: mt.t.id }, function (ret) {
            var ss = '';
            for (var i in ret) {
                var m = ret[i];
                var s1 = '';
                for (var j in m.details) {
                    var name = m.details[j].name;
                    if (name.length == 3) name = name.split('').join('<i class="sp05"></i>');
                    else if (name.length == 2) name = name.split('').join('<i class="sp2"></i>');
                    s1 += '<p class="f26"><i class="c9">{0}</i><i>{1}</i></p>'.format(
                        name, m.details[j].value);
                }
                ss += s.format(m.order_id, m.status_txt, m.total_fee, m.title, s1);

                if (!ispaid) {
                    ss += '<div class="ofd">';
                    if (m.can_pay) {
                        ss += '<a class="left odel" href="javascript:void(0);"><i>取消订单</i></a>';
                        ss += '<a class="right opay" href="/order/{0}/{1}"><i>去支付</i></a>'.format(m.paid_fee>0?'payment':'join', m.order_id);
                    } else {
                        ss += '<a class="odel" href="javascript:void(0);"><i>删除订单</i></a>';
                    }
                    ss += '</div>';
                } else if (m.commentable) {
                    ss += '<div class="ofd">';
                    ss += '<a class="ocmt2" href="/order/postcmt/{0}"><i>去评价</i></a>'.format(m.order_id);
                    ss += '</div>';
                }
                ss += '</div>';
            }
            if (!ss) {
                $('.nodata').removeClass('none');
            } else {
                $('#dorders').html(ss);
                mt.t.goto();
                $('.odel').click(mt.p.del_order);
            }
        });
        $('.otab i').eq(ispaid ? 1 : 0).addClass('hover');
        $('.otab i').eq(0).click(function () {
            location = '/acc/orders/0';
        });
        $('.otab i').eq(1).click(function () {
            location = '/acc/orders/1';
        });

    }
    , del_order: function () {
        var div = $(this).parent().parent();
        var oid = div.attr('data-id');
        mt.t.confirm('订单删除后无法恢复，确定要删除此次报名吗？', null, function () {
            mt.t.wait();
            mt.t.post('q=order/delete&m=get&c=uid', { id: oid }, function (ret) {
                mt.t.waitok();
                div.remove();
                if ($('#dorders .obox').length == 0) {
                    $('.nodata').removeClass('none');
                }
            });
        });
    }
};
// 我的优惠券- 
mt.coupon = {
    page: '-/acc/coupon'
    , init: function () {
        var dd = { id: sjson.data.id };
        dd.order_id = mt.t.query('order_id');

        mt.p.load_coupon(dd);

        $('.btn-red').eq(0).click(function () {
            var data = {
                user_id: sjson.data.id,
                number: $('.put1').val()
            };
            if (!data.number) {
                mt.t.alert('请输入兑换码'); return;
            }
            mt.t.wait();
            mt.t.post('q=users/addcoupon&m=post', data, function (ret) {
                mt.p.load_coupon(dd);
                setTimeout(function () {
                    mt.t.waitok();
                }, 1000);
                $('.put1').val('');
            });
        });

        if (dd.order_id) {
            $('.body').append('<div class="btn-red fixed">完成</div>');
            $('.btn-red').eq(1).on('click', function () {
                if ($('.cp_chk').length == 0) {
                    location = '/order/join/{0}?coupon=0#cp'.format(dd.order_id);
                } else {
                    location = '/order/join/{0}?coupon={1}#cp'.format(dd.order_id, $('.cp_chk').parent().attr('data-num'));
                }
            });
        }
        mt.t.ads.top();
    }
    , load_coupon: function (dd) {
        mt.t.jsonp('users/coupon', dd, function (ret) {
            var s = '';
            s += '<div class="coupon{0}" data-id="{6}" data-num="{7}">';
            s += '<i class="money m2">{1}</i>';
            s += '<div class="cp_body f22 con">';
            s += '<h2 class="f36">{2}</h2>';
            s += '<p>{3}</p>';
            s += '<p class="cp_p2">{4}</p>';
            s += '<p>{5}</p>';
            s += '</div>';
            s += '</div>';
            var ss = '';
            for (var i in ret) {
                ss += s.format((ret[i].enabled ? '' : ' cp_off')
                    , ret[i].price, ret[i].title, ret[i].expires, ret[i].threshold
                    , ret[i].description, ret[i].id, ret[i].number);
            }
            if (!ss) {
                $('.nodata').removeClass('none');
                return;
            }
            $('#dcp').html(ss);
            $('.cp_body').each(function () {
                var t = $(this);
                var h = t.height();
                if (h < 100) {
                    t.css('top', '80px');
                } else if (h < 130) {
                    t.css('top', '60px');
                }
            });
            if (dd.order_id) {
                $('.coupon').click(function () {
                    if ($(this).hasClass('cp_off')) return;
                    if ($(this).find('.cp_chk').length) {
                        $(this).find('.cp_chk').remove();
                    } else {
                        $('.cp_chk').remove();
                        $(this).append('<i class="cp_chk"></i>');
                    }
                });
            }
            var number = mt.t.query('coupon');
            if (number) {
                $('.coupon[data-num="' + number + '"]').append('<i class="cp_chk"></i>');
            }
        });
    }
};
// 分享邀请码-
mt.fcode = {
    page: '-/acc/fcode(/\\w+)?'
    , init: function () {
        var name = (sjson.data.nickname || sjson.data.realname);
        $('.fbox,.fc').html(sjson.data.fcode);

        if (mt.t.isweixin) {
            mt.t.wxshare('http://maitian.qiniudn.com/635629053804616248'
                , '现在注册加入蚂蚁周边游，立即获得20元优惠券！'
                , name + '邀请您加入蚂蚁周边游！现在下载APP注册，并在优惠券兑换处输入TA的邀请码' + sjson.data.fcode + '，立即获得¥20蚂蚁优惠券！'
                );
            $('.im_wx').click(function () {
                var msg = '<i class="n-msg n-wx f40">发送给朋友</i>';
                mt.t.wxnote(msg);
            });
            $('.im_pyq').click(function () {
                var msg = '<i class="n-msg n-pyq f40">分享到朋友圈</i>';
                mt.t.wxnote(msg);
            });
        } else {
            $('.im_wx').parent().addClass('none');
            $('.fbox').parent().prev().html('分享你的邀请码(长按复制)');
        }
    }
    , showd: function () {
        mt.t.alert($('#showd').html());
    }
};

// 常用出行人-
mt.traveler = {
    page: '-/acc/traveler(edit/\\w+)?'
    , init: function () {
        mt.t.loadJs('/content/scripts/traveler.js');
    }
};
// 我的收藏-
mt.actmark = {
    page: '-/acc/actmark'
    , init: function () {

        mt.p.load_acts();

        mt.t.auto_more(function () {
            $('#pmore').html('加载中...');
            mt.p.load_acts();
        });

        $('.hdbtnl').off('click').on('click', function () {
            var t = $(this);
            if (t.html() == '完成') {
                $('#dacts2').removeClass('markdel');
                $('.btn-red').addClass('none');
                t.html('删除');
            } else {
                $('#dacts2').addClass('markdel');
                $('.btn-red').removeClass('none');
                t.html('完成');
            }
        }).html('删除').removeClass('hide').css('background', 'none');


        $('.btn-red').click(function () {
            var ids = [];
            $('.act-item-chk').each(function () {
                var id = $(this).attr('data-href').split('/')[2];
                ids.push(id);
            });
            if (ids.length == 0) {
                mt.t.alert('请选择要删除的活动');
            } else {
                mt.t.wait();
                mt.t.post('q=mark/delete&m=get&c=uid', { activity_id: ids.join(',') }, function (ret) {
                    mt.t.waitok();
                    $('.act-item-chk').remove();
                    $('.hdbtnl').click();
                });
            }
        });
    }
    , load_acts: function () {
        var qdata = {
            user_id: sjson.data.id
            , start: $('#dacts2 .act-item').length
            , limit: 10
        };
        mt.t.jsonp('mark/list', qdata, function (ret) {
            var ss = '';
            
            for (var i = 0; i < ret.list.length; i++) {
                var m = ret.list[i];
                ss += mt.t.actitem.format(m.id
                    , mt.t.reimg(m.logo, 180, 180)
                    , m.title, m.sub_title
                    , (m.payment_type == 2 ? '订金' : ''), m.price
                    , (m.status ? '' : ' full'), m.status_txt
                    , m.paid_cnt
                    );
            }
            if (ss) {
                $('#dacts2').append(ss);
                mt.p.set_click();

                if (ret.list.length < 10) {
                    $('#pmore').html('已加载全部数据');
                    document.onscroll = null;
                } else {
                    $('#pmore').html('上拉继续加载');
                }
            } else {
                if (qdata.start == 0) {
                    $('#pmore').addClass('none');
                    $('.nodata').removeClass('none');
                } else {
                    $('#pmore').html('已加载全部数据');
                }
                document.onscroll = null;
            }
            mt.doing = false;

        });
    }
    , set_click: function () {
        $('.act-item').off('click').on('click', function (ev) {
            var t = $(this);
            if ($('.hdbtnl').html() == '完成') {
                if (t.hasClass('act-item-chk')) {
                    t.removeClass('act-item-chk');
                } else {
                    t.addClass('act-item-chk');
                }
            } else {
                location = t.attr('data-href');
            }
        });
    }
};

// 账户余额-
mt.balance = {
    page: '-/acc/balance'
    , init: function () {
        $('.hdbtnr').off('click').on('click', function () {
            location = '/acc/paysetting';
        }).addClass('hdbtnr2').html('设置');

        mt.t.jsonp('users/{0}/cash/remainder'.format(sjson.data.id), '', function (ret) {
            $('.money').eq(0).html(ret.remainder);
        });
        mt.t.jsonp('users/{0}/cash/list'.format(sjson.data.id), { start: 0, limit: 200 }, function (ret) {
            var s = '<div class="yue-item botl">';
            s += '<p>{0}</p><p class="f24 c6">{1}</p><i class="right{2}"><i>{3}</i>{4}</i>';
            s += '</div>';
            var ss = '';
            for (var i in ret.list) {
                var m = ret.list[i];
                var cls = '', dot = '+', fee = m.amount;
                if (fee < 0) {
                    cls = ' red'; dot = '-'; fee *= -1;
                }
                ss += s.format(m.desc, m.create_date, cls, dot, fee);
            }
            if (ss) {
                $('#dlist').html(ss);
            } else {
                $('.nodata').removeClass('none');
            }
        });
    }
};
// 账户充值-
mt.balin = {
    page: '-/acc/balin'
    , init: function () {
        $('.btn-red').on('click', function () {
            var data = {
                number: $('#tcard').val(),
                password: $('#tpwd').val()
            };
            mt.t.wait();
            mt.t.post('q=cash/activate&c=uid', data, function (ret) {
                mt.t.post('q=cash/password/exist&c=uid', '', function (ret2) {
                    mt.t.waitok();
                    if (ret2.existed) {
                        mt.t.alert('充值成功！', function () {
                            location = '/acc/balance';
                        });
                    } else {
                        mt.t.alert('充值成功，请设置支付密码！', function () {
                            location = '/acc/paypwd?from=/acc/balance';
                        });
                    }
                });
            });
        });
    }
};
// 支付设置-
mt.paysetting = {
    page: '-/acc/paysetting'
    , init: function () {

        $('.hdbtnr').off('click').on('click', function () {
            location = '/plus/payqa';
        }).html('常见问题').addClass('hdbtnr2').css('width', '136px');

        if (sdata.data.existed) {
            $('.utr12').attr('href', '/acc/paypwd2').html('修改支付密码');
            $('.utr13').parent().removeClass('none');
        }
    }
};
// 设置支付密码-
mt.paypwd = {
    page: '-/acc/paypwd'
    , init: function () {

        if (sjson.data.mobile) {
            $('#mobile').val(sjson.data.mobile).attr('readonly', true);
        } else {
            $('.btn-red').eq(0).html('绑 定');
        }
        $('.btn-red').eq(0).on('click', mt.p.chkmobile);
        $('.btn-red2').on('click', mt.p.smscode);

        $('.btn-red').eq(1).on('click', mt.p.savepwd);

        $('.pwdbox').on('click', function () {
            $('.tpwd').focus();
        });
        mt.t.rsa();

        // 输入密码事件-
        mt.p.pidx = 0;
        setInterval(function () {
            var arr = $('.pwdbox').eq(mt.p.pidx - 1).find('i');
            var len = $('.tpwd').val().length;
            if (mt.p.pidx == 2) len -= 6;
            arr.each(function (i, e) {
                if (i < len) $(e).addClass('act');
                else $(e).removeClass('act');
            });
            if (mt.p.pidx == 1 && len >= 6) {
                $('.tpwd').val($('.tpwd').val().substr(0, 6));
                mt.p.topage(2);
            }
            if (mt.p.pidx == 2 && len == 12) {
                $('.tpwd').blur();
            }
        }, 10);
    }
    , topage: function (i) {
        $('.pages').css('margin-left', (-750 * i) + 'px');
        if (i == 1) setTimeout(function () { $('.tpwd').focus(); }, 1000);
        mt.p.pidx = i;
    }
    , chkmobile: function () {

        var data = {
            mobile: $.trim($('#mobile').val()),
            code: $('#code').val()
        };
        if (!data.mobile) {
            mt.t.alert('请输入手机号'); return;
        }
        if (!mt.t.check.mobile(data.mobile)) {
            mt.t.alert('手机号输入有误'); return;
        }
        if (!data.code) {
            mt.t.alert('请输入验证码'); return;
        }
        var api = 'q=cash/password/smsvalidate&tp=log&m=post';
        mt.t.wait();
        mt.t.post(api, data, function (ret) {
            mt.t.waitok();
            mt.p.topage(1);
        });
    }
    , smscode: function () {
        if ($('.btn-red2').hasClass('btn-gray')) return;

        var data = {
            user_id: sjson.data.id,
            type: 'retrieve_password',
            mobile: $.trim($('#mobile').val())
        };
        if (!data.mobile) {
            mt.t.alert('请输入手机号'); return;
        }
        if (!mt.t.check.mobile(data.mobile)) {
            mt.t.alert('手机号输入有误'); return;
        }
        // send sms code
        mt.t.wait();
        mt.t.jsonp('other/smscode', data, function () {
            mt.t.waitok();
            var i = 60;
            $('.btn-red2').html(i + 's').addClass('btn-gray');
            var inter = setInterval(function () {
                $('.btn-red2').html(--i + 's');
                if (i == 0) {
                    $('.btn-red2').html('获 取').removeClass('btn-gray');
                    clearInterval(inter);
                }
            }, 1000);

        });
    }
    , savepwd: function () {
        var data = {
            pwd1: $('.tpwd').val().substr(0,6),
            pwd2: $('.tpwd').val().substr(6)
        };
        if (!data.pwd2) {
            mt.t.alert('请再次输入密码'); return;
        }
        if (data.pwd1 != data.pwd2) {
            $('.tpwd').val('');
            mt.t.alert('两次输入密码不一致', function () {
                mt.p.topage(1);
            });
            return;
        }
        data = {
            mobile: $.trim($('#mobile').val()),
            smscode: $('#code').val(),
            code: mt.t.rsa(data.pwd1)
        };
        mt.t.wait();
        mt.t.post('q=cash/password&c=uid&m=post', data, function (ret) {
            mt.t.waitok();
            mt.t.alert('支付密码设置成功！', function () {
                location = mt.t.query('from') || '/acc/home';
            });
        });
        
    }
};
// 修改支付密码-
mt.paypwd2 = {
    page: '-/acc/paypwd2'
    , init: function () {

        $('.btn-red').eq(0).on('click', mt.p.savepwd);
        
        $('.pwdbox').on('click', function () {
            $('.tpwd').focus();
        });
        setTimeout(function () { $('.tpwd').focus(); }, 500);

        mt.t.rsa();
        // 输入密码事件-
        mt.p.pidx = 0;
        mt.p.inte = setInterval(mt.p.aaa, 10);
    }
    , aaa: function () {
        var arr = $('.pwdbox>i');
        var len = $('.tpwd').val().length;
        //len -= 6 * mt.p.pidx;
        arr.each(function (i, e) {
            if (i < len) $(e).addClass('act');
            else $(e).removeClass('act');
        });
        if (mt.p.pidx == 0 && len >= 6) {
            $('.tpwd').val($('.tpwd').val().substr(0, 6));
            clearInterval(mt.p.inte);
            $('.tpwd').blur();
            mt.t.wait();
            mt.t.post('q=cash/password/validate&c=uid&m=post', { code: mt.t.rsa($('.tpwd').val()) }, function (ret) {
                mt.t.waitok();
                if (ret.matched) {
                    mt.p.topage(1);
                    $('.tpwd').focus();
                } else {
                    $('.tpwd').val('');
                    $('.pwdbox i.act').removeClass('act');
                    mt.t.alert(ret.hint);
                }
                mt.p.inte = setInterval(mt.p.aaa, 10);
            });
        }
        if (mt.p.pidx == 1 && len >= 12) {
            $('.tpwd').val($('.tpwd').val().substr(0, 12));
            mt.p.topage(2);
        }
        if (mt.p.pidx == 2 && len == 18) {
            $('.tpwd').blur();
        }
    }
    , topage: function (i) {
        $('.pages').css('margin-left', (-750 * i) + 'px');
        mt.p.pidx = i;
    }
    , savepwd: function () {
        var data = {
            pwd1: $('.tpwd').val().substr(6, 6),
            pwd2: $('.tpwd').val().substr(12)
        };
        if (!data.pwd2) {
            mt.t.alert('请再次输入密码'); return;
        }
        if (data.pwd1 != data.pwd2) {
            $('.tpwd').val($('.tpwd').val().substr(0, 6));
            mt.t.alert('两次输入密码不一致', function () {
                mt.p.topage(1);
            });
            return;
        }
        data = {
            old_code: mt.t.rsa($('.tpwd').val().substr(0, 6)),
            new_code: mt.t.rsa(data.pwd1)
        };
        mt.t.wait();
        mt.t.post('q=cash/password/reset&c=uid&m=post', data, function (ret) {
            mt.t.waitok();
            mt.t.alert('支付密码设置成功！', function () {
                location = mt.t.query('from') || '/acc/home';
            });
        });

    }
};

// 蚂蚁币-
mt.score = {
    page: '-/acc/score'
    , init: function () {

        mt.t.jsonp('users/{0}/credit/remainder'.format(uid), '', function (ret) {
            $('#nall').html(ret.remainder);
        });
        mt.p.getscore();
        // 福利活动-
        mt.t.jsonp('credit/products', { limit: 50,uid:uid }, function (ret) {
            mt.p.acts = ret.list;
            var s = '';
            s += '<div class="act-item botl zoom goto" data-href="/detail/{0}">';
            s += '<img class="act-img2" src="{1}" />';
            s += '<div class="right" style="width:510px;"><h2 class="f34">{2}</h2>';
            s += '<p class="f22">{3}</p></div>';
            s += '<p class="join_cnt"><i class="red f40">{4}</i><i class="dw">分</i></p>';
            s += '<p class="price"><i class="rbtn{5}" data-idx="{7}">{6}</i></p>';
            s += '</div>';
            var ss = '';
            for (var i = 0; i < ret.list.length; i++) {
                var m = ret.list[i];
                ss += s.format(m.product_id
                    , mt.t.reimg(m.logo||'', 180, 180), m.title
                    , m.subtitle, m.credits
                    , (m.exchangeable ? '' : ' rbtn2'), m.hint
                    , i
                    );
            }
            if (ss) {
                if (mt.t.query('token')) {
                    ss = ss.replace(/\/detail\//g, 'maitianqinzi://detail.html?id=');
                }
                $('#jifacts').html(ss);
                mt.t.goto();
                mt.p.rebtn();
            } else {
                $('#jifacts>div.none').removeClass('none');
                if (mt.t.query('token')) {
                    $('#jifacts a.blue').attr('href', 'maitianqinzi://cover.html');
                }
            }
        });

        $('.jif-tab>i.left').on('click', function () {
            $('.jif-tab>i.left').addClass('hover');
            $('.jif-tab>i.right').removeClass('hover');
            $('#jifacts').removeClass('none');
            $('#dlist').addClass('none');
        });
        $('.jif-tab>i.right').on('click', function () {
            $('.jif-tab>i.left').removeClass('hover');
            $('.jif-tab>i.right').addClass('hover');
            $('#jifacts').addClass('none');
            $('#dlist').removeClass('none');
        });
        if (mt.t.query('token')) {
            // 如果是通过APP打开的-
            mt.p.inapp();
        }
    }
    , getscore: function () {
        mt.t.jsonp('users/{0}/credit/list'.format(uid), { start: 0, limit: 200 }, function (ret) {
            var s = '<div class="yue-item{5} botl">';
            s += '<p>{0}</p><p class="f24 c6">{1}</p><i class="right{2}"><i>{3}</i>{4}</i>';
            s += '</div>';
            var ss = '';
            for (var i in ret.list) {
                var m = ret.list[i];
                var cls = '', dot = '+', fee = m.amount;
                if (fee < 0) {
                    cls = ' red'; dot = '-'; fee *= -1;
                }
                ss += s.format(m.type_desc.replace('\n', '</p><p>'), m.create_date || '', cls, dot, fee
                    , (m.type_desc.indexOf('\n') != -1 ? ' yi2' : ''));
            }
            if (ss) {
                $('#dlist').html(ss);
            } else {
                $('.nodata').removeClass('none');
            }
        });
    }
    , inapp: function () {
        if (!sdata.data.signable) {
            $('.abtn2').eq(0).addClass('none');
            $('.abtn2').eq(1).removeClass('none');
        }
        var d = sdata.data.sign_days;
        if (d > 0 && d % 7 == 0) $('.abtn2').eq(0).html('签到 +25');
        if ((d + 1) % 7 == 0) $('.abtn2').eq(1).html('已签到 明日+25');
        if (d > 0) {
            $('#n1').html(d).parent().removeClass('none');
        }
        // 签到-
        $('.abtn2').eq(0).on('click', function () {
            mt.t.wait();
            mt.t.post('q=credit/gain/sign', { user_id: uid }, function (ret) {
                mt.t.waitok();
                var d = ret.sign_days;
                if (d > 0 && d % 7 == 0) $('.abtn2').eq(0).html('签到 +25');
                if ((d + 1) % 7 == 0) $('.abtn2').eq(1).html('已签到 明日+25');
                $('#n1').html(d).parent().removeClass('none');

                $('.abtn2').eq(0).addClass('none');
                $('.abtn2').eq(1).removeClass('none');

                mt.p.checkin(ret.sign_credits, d);
                mt.p.getscore();
            });
        });
        // 分享-
        window.shareback = function (type) {
            if (type == 'timeline') {
                //mt.t.post('q=credit/gain/share&m=post', { user_id: uid });
            }
            //setTimeout(function () { location.reload(); }, 500);
        };
        $('.abtn2').eq(2).on('click', function () {

            mt.t.appshare(sdata.data.share_info.logo||'http://img.maitao.com/635627318209928748'
                , sdata.data.share_info.title
                , '蚂蚁周边游 发行身边的精彩'
                , 'http://{0}/act/sharemt'.format(location.host)
                , 'shareback');
        });
        // 修复一下app下的链接-
        $('.jifacts a.blue').attr('href', 'app:///cover.html');
        $('.jif-hd a')[0].href += '?new_page=1&hide_toolbar=1&title=蚂蚁币规则';

        $('.shide3').on('click', function () {
            $(this).addClass('none');
        });
    }
    , rebtn: function () {
        $('.rbtn').off('click').on('click', function (ev) {
            ev.stopPropagation();
            var t = $(this);
            if (t.hasClass('rbtn2')) return;
            var idx = parseInt(t.attr('data-idx'));
            $('.shide2').removeClass('none').attr('data-idx', idx);
            var act = mt.p.acts[idx];
            $('#p10').html(act.notice.replace(/\\n/g, '<br>'));
        });
    }
    , joinact: function () {
        var idx = $('.shide2').attr('data-idx');
        $('.shide2').addClass('none');
        mt.t.wait();
        mt.t.post('q=credit/pay/coupon&m=post', { product_id: mt.p.acts[idx].product_id,user_id:uid }, function (ret) {
            mt.t.waitok();
            mt.t.alert(ret.hint||'活动兑换成功，客服将在1个工作日内联系您。', function () {
                location.reload();
            });
        });
    }
    , checkin: function (sc, days) {

        $('.getnum').html(sc);
        $('#n2').html(days);
        $('#n3').html(7 - (days % 7));

        var n1 = $('#nall').html();
        var n2 = parseInt(n1, 10) + sc + '';
        $('#nall').html(n2);

        while (n1.length < 4) { n1 = '0' + n1; }
        while (n2.length < 4) { n2 = '0' + n2; }
        var s = '';
        for (var i = 0; i < 4; i++) {
            s += '<i><b>{0}</b><b>{1}</b></i>'.format(n1[i], n2[i]);
        }
        $('.scnum').html(s);

        $('.shide3').removeClass('none');
        window.dofunc = function (i) {
            if (i < 0) return;
            if (n1[i] != n2[i]) {
                $('.scnum>i').eq(i).css('margin-top', '-1em');
            }
            setTimeout('dofunc(' + (i - 1) + ')', 200);
        };
        setTimeout(function () {
            $('.scimgs>.img1').addClass('img12');
            $('.scimgs>.img2').addClass('img22');
            $('.scimgs>.img3').addClass('img32');
            $('.scimgs>.img4').addClass('img42');
            $('.scimgs>.img5').addClass('img52');
            setTimeout(function () {
                $('.scimgs>.bg2').addClass('bg22');

                dofunc($('.scnum>i').length - 1);
            }, 200);
        }, 100);
    }
};


mt.t.curr_page(true);