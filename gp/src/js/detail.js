/*new detail*/

mt.curr = {
    init: function () {
        
        mt.p = mt.curr;
        mt.t.w = document.body.clientWidth;

        if (!sdata.data.product_id) {
            mt.t.alert('活动不存在或已被删除', function () {
                history.back();
            });
            return;
        }

        if (mt.t.isweixin) {
            mt.t.wxshare(mt.t.reimg(sdata.data.logo, 200, 200), sdata.data.title, sdata.data.pro_desc);
            if (mt.t.cookie.get('uid')) {
                window.wxback = function (res, type) {
                    /*if (type == 'timeline') {
                        mt.t.post('q=credit/gain/share&c=uid&m=post');
                    }*/
                };
            }
        }
        $('.ic-qa').on('click', function () {
            $('.dtab a').eq(2).click();
            var dtt = $('.dtab').parent().offset().top;
            mt.t.top(dtt);
        });
        $('.ic-share').on('click', function () {
            if (mt.t.isweixin) {
                var msg = '<i class="n-msg n-pyq f40">分享到朋友圈</i>';
                mt.t.wxnote(msg);
            } else {
                mt.t.alert('直接复制浏览器网址，发送给好友。');
            }
        });
        mt.p.in_details(sdata.data);
        mt.p.in_taocan();        
        mt.p.in_tabs();

        mt.t.ads.top();
    }
    , in_details: function (ret) {
        if (ret.paid_cnt) {
            $('#anum').parent().parent().removeClass('none');
            if (ret.more_orders) {
                $('.avbox').click(function () { location = $('#anum').attr('href'); });
            } else {
                $('#anum').attr('href', 'javascript:void(0)');
            }
            mt.t.jsonp('product/companion', { product_id: mt.t.id, gro_id: mt.t.query('gro_id') }, function (ret2) {
                var s = '';
                for (var i = 0; i < ret2.list.length; i++) {
                    s += '<img class="av" src="{0}" />'.format(ret2.list[i].avatar.small);
                }
                if (s) $('.avbox').html(s).removeClass('none');
                else $('#anum').parent().addClass('botl');
            });
        } 
        if (ret.payment_type == 2) {
            $('.dw').eq(0).html('订金&nbsp;');
        }

        // 活动多图展示-
        mt.t.jsonp('comment/getImagesByProduct', { product_id: mt.t.id }, function (ret) {
            var imgs = [mt.t.reimg($('.img0 img').attr('src'), 750)];
            for (var i in ret.images_url) {
                imgs.push(mt.t.reimg(ret.images_url[i], 750));
            }
            $('.picnum').html('1/' + (ret.images_num + 1));
            $('.img0 img').on('click', function () {
                mt.p.imgprev(imgs, 0);
            });
        });

        // tags
        var s = '';
        for (var i = 0; i < ret.tag.length; i++) {
            s += '<div class="ico ico{0} botl">{1}</div>'.format(ret.tag[i].type, ret.tag[i].text);
        }
		/*
			@jack
		*/
       // $('#dtags').html(s);

        /*if (ret.addr_name) {
            if ($('.ico3').length == 0) {
                $('#dtags').append('<div class="ico ico3 botl">{0}</div>'.format(ret.addr_name));
            } else {
                $('.ico3').html(ret.addr_name);
            }
        }*/
        if ($('#dtags .ico').length > 0) {
            $('#dtags .ico').last().removeClass('botl');
            if (ret.lat && ret.lat.substr(0, 1) != '0' && $('.ico3').length > 0) {
                $('.ico3').html('<div class="r2">' + $('.ico3').html().substr(0, 20) + '</div>').on('click', function () {
                    location = '/plus/map?point={0}&name={1}&addr={2}'.format(
                        '{0},{1}'.format(ret.lot, ret.lat)
                        , encodeURIComponent(ret.addr_name)
                        , encodeURIComponent(ret.addr_txt || $('.ico3').text())
                        );
                });
            }
        } else {
            $('#dtags').addClass('none');
        }
        // 组织方-
        if (ret.supp_id) {
            mt.t.jsonp('partner/detail', { partner_id: ret.supp_id }, function (ret2) {
                var s = '<img class="left av" src="{0}" />';
                s += '<div class="left" style="width:68%;"><p>{1}</p><p class="f12 c6 desc">{2}</p>';
                s += '<p class="cols"><i{6}>{3}</i><i{6}>{4}</i><i>{5}</i></p>';
                s += '<p class="cols f12 c6"><i{6}>报名人数</i><i{6}>活动数量</i><i>用户评分</i></p>';
                s += '</div>';
                var mr = (mt.t.w - 100) / 3 - 50;
                mr = ' style="margin-right:' + mr + 'px"';
                if (!ret2.logo) ret2.logo = 'http://img.maitao.com/635833714883012377';

                s = s.format(mt.t.reimg(ret2.logo, 200, 200), ret2.display_name, ret2.brief
                    , ret2.participantCnt, ret2.activity_cnt, ret2.satisfaction, mr);
                $('.pnbox').on('click', function () {
                    location = '/partner/{0}'.format(ret.supp_id);
                }).html(s).removeClass('none');
            });
        }
        if (ret.gro.length > 1) {
            var s = '<div class="bgfbox mt10 h44 c6">精选套餐</div>';
            for (var i in ret.gro) {
                var m = ret.gro[i];
                s += '<div class="botl taoc{0}" data-idx="{1}">'.format(m.status ? '' : ' taoc2', i);
                s += '<p class="tit b">{0}</p>'.format(m.title);
                s += '<p class="subtit f12">{0}</p>'.format(m.sub_title.replace(/\s+/g, ' &nbsp;'));
                s += '<p class="mm"><i class="money">{0}</i></p>'.format(m.price);
                s += '<p class="btn-red2">{0}</p>'.format(m.but_text);
                s += '</div>';
            }
            $('#dtaoc').html(s);
        }
        // 定制-
        if (ret.can_customized) {
            $('#ddz').removeClass('none').click(function () {
                location = '/plus/actcustom/' + mt.t.id;
            }).parent().removeClass('none');
        }
        // 直播-
        if (ret.live_halls && ret.live_halls.length > 0) {
            var ll = ret.live_halls[0];
            var s = '<div class="h44{0} r2" onclick="location=\'{1}\'"><i>{2}</i></div>'.format(
                (ret.can_customized ? ' topl' : '')
                , (ret.live_halls.length > 1 ? '/live/list?product_id=' + mt.t.id : '/live/room/' + ll.live_hall_id)
                , (ll.status_desc == '直播中' ? '活动正在直播，马上去围观' : '查看往期活动直播')
                );
            $('#ddz').after(s).parent().removeClass('none');
        }

        var can_order = function () {
            for (var i in ret.gro) {
                if (ret.gro[i].status) return true;
            }
            return false;
        }();
        //$('.btnr').html(ret.button || (ret.gro.length > 1 ? '选择套餐' : '立即报名'));

        if (can_order) {
            if (ret.is_forapp) {
               /* $('.btnr').html('请下载APP报名').click(function () {
                    location = mt.t.down.ios;
                });*/
            } else {
               /* $('.btnr').on('click', function () {
                    if (sdata.data.gro.length > 1) {
                        
                        mt.t.top($('#dtaoc')[0].offsetTop - 100);
                    } else {
                        mt.p.goto_join(sdata.data.gro[0]);
                    }
                });*/
            }
        } else {
            //$('.btnr').addClass('btnr-gray');
        }

        // 收藏-
        mt.p.in_mark();
    }
    , in_mark: function () {
        if (mt.t.cookie.get('uid')) {
            mt.t.post('q=mark/check&m=get&c=uid', { activity_id: mt.t.id }, function (ret) {
                if (ret.marked) {
                    $('.img0').append('<i class="ic_mark ic_mark2"></i>');
                } else {
                    $('.img0').append('<i class="ic_mark"></i>');
                }
                $('.ic_mark').click(function () {
                    mt.t.wait();
                    if ($('.ic_mark').hasClass('ic_mark2')) {
                        mt.t.post('q=mark/delete&m=get&c=uid', { activity_id: mt.t.id }, function (ret) {
                            mt.t.waitok();
                            $('.ic_mark').removeClass('ic_mark2');
                        });
                    } else {
                        mt.t.post('q=mark/create&m=get&c=uid', { activity_id: mt.t.id }, function (ret) {
                            mt.t.waitok();
                            $('.ic_mark').addClass('ic_mark2');
                        });
                    }
                });
            });

        } else {
            $('.img0').append('<i class="ic_mark"></i>');

            $('.ic_mark').click(function () {
                location = '/guest/login';
            });
        }
    }
    , in_taocan: function () {
        $('.taoc .tit').each(function () {
            var t = $(this);
            if (t.height() < 25) {
                t.css('top', '20px');
                t.next().css('bottom', '22px');
            }
        });
        $('.taoc').on('click', function (event) {
            var gro = sdata.data.gro[parseInt($(this).attr('data-idx'), 10)];
            var e = (event.srcElement || event.target);
            if (e.className == 'btn-red2' && !$(e).parent().hasClass('taoc2')) {
                mt.p.goto_join(gro);
                //event.preventDefault();
                return false;
            }
            var s = '<div class="shide"><div class="alert" style="border:none;"><div class="taoc-pop-con">';
            s += '<i class="taoc-pop-close" onclick="$(\'.shide\').remove()"></i>';
            s += '<h2 class="f18">{0}</h2><div class="con1">{1}</div>'.format(gro.title, gro.desc.replace(/[\n]/g, '<br>'));
            s += '</div><div class="taoc-pop-bot">';
            s += '<i class="money">{0}</i><i class="taoc-pop-btn right{1}">{2}</i>'.format(
                gro.price, gro.status ? '' : ' btn-gray', gro.but_text);
            s += '</div></div></div>';
            $('.body').append(s);
            if (gro.status) {
                $('.taoc-pop-btn').on('click', function () {
                    mt.p.goto_join(gro);
                });
            }
            if ($('.alert .con1').height() > 200) {
                $('.alert').css('margin-top', '50px');
            }
            $('.shide').on('touchstart', function (event) {
                var cls = (event.target || event.srcElement).className.split(' ')[0];
                if (['con1', 'taoc-pop-close', 'taoc-pop-btn'].indexOf(cls) == -1) {
                    event.preventDefault();
                    return false;
                }
            });
        });
    }
    , goto_join: function (gro) {
        if (!gro.status) return;
        // 判断是否加锁套餐-
        if (gro.has_lock) {
            if (!mt.t.cookie.get('uid')) {
                location = '/guest/login?from=' + encodeURIComponent(location.pathname + location.search);
                return;
            }
            mt.t.confirm(gro.question, null, function () {
                var data = { product_id: mt.t.id, group_id: gro.gro_id, answer: $('.alert .put').val() };
                if (data.answer) {
                    mt.t.wait();
                    mt.t.jsonp('order/validateAnswer', data, function (ret) {
                        if (ret.message) {
                            mt.t.waitok();
                            mt.t.alert(ret.message, function () {
                                if (ret.result) mt.p.goto_join2(gro);
                            });
                        } else {
                            if (ret.result) mt.p.goto_join2(gro);
                        }
                    });
                }
            });
            $('.alert .con').append('<p><input type="text" class="put" placeholder="{0}" /></p>'.format(gro.hint_msg));
            return;
        }
        mt.p.goto_join2(gro);
    }
    , goto_join2: function (gro) {
        location = '/order/{0}/{1}?gro_id={2}&date={3}&from={4}'.format(
            gro.default_date ? 'join1' : 'joincal'
            , mt.t.id, gro.gro_id, gro.default_date || ''
            , mt.t.query('from')
            );
    }
    // tab：活动详情：评价-
    , in_tabs: function () {
        mt.p.dtab = $('.dtab');
        $('.dtab a').attr('href', 'javascript:void(0);');
        $('#ddiv1,#ddiv2').addClass('none');

        var retab = function (i) {
            $('.dtab a.act').removeClass('act');
            $('.dtab a').eq(i).addClass('act');
            $('#ddiv0,#ddiv1,#ddiv2').addClass('none');
            $('#ddiv' + i).removeClass('none');
        };

        $('.dtab a').eq(0).click(function () {
            retab(0);
            if (mt.p.dtab.hasClass('dtab2')) {
                mt.t.top(dtt);
            }
            mt.t.auto_more(null);
        });
        $('.dtab a').eq(1).click(function () {
            retab(1);
            if (mt.p.dtab.hasClass('dtab2')) {
                mt.t.top(dtt);
            }
            $('#pmore').removeAttr('id');
            $('.pmore')[0].id = 'pmore';
            if ($('#pmore').html() != '') {
                mt.t.auto_more(function () {
                    $('#pmore').html('加载中...');
                    mt.p.load_cmt();
                });
            } else {
                mt.t.auto_more(null);
            }
            mt.p.in_cmt();
        });
        $('.dtab a').eq(2).click(function () {
            retab(2);
            if (mt.p.dtab.hasClass('dtab2')) {
                mt.t.top(dtt);
            }
            $('#pmore').removeAttr('id');
            $('.pmore')[1].id = 'pmore';
            if ($('#pmore').html() != '') {
                mt.t.auto_more(function () {
                    $('#pmore').html('加载中...');
                    mt.p.load_qa();
                });
            } else {
                mt.t.auto_more(null);
            }
        });
        mt.p.load_cmt();
        mt.p.load_qa();

        if (!mt.t.cookie.get('uid')) {
           /* $('.qabox .put0,.qabox .btn-red2').on('click', function () {
                location = '/guest/login';
            });*/
        } else {
            /*$('.qabox .btn-red2').on('click', function () {
                var data = {
                    product_id: mt.t.id,
                    content: $('.qabox .put0').val()
                };
                if (!data.content) {
                    mt.t.alert('请输入咨询内容'); return;
                }
                if (data.content.length > 500) {
                    mt.t.alert('您输入的内容太长啦，最多输入500字！'); return;
                }
                mt.t.wait();
                mt.t.post('q=product/ask&c=uid', data, function (ret) {
                    mt.t.waitok();
                    $('.qabox .put0').val('');
                    mt.t.alert(ret.hint);
                });
            });*/
        }
        var dtt = mt.p.dtab.offset().top;
        
        setTimeout(function () {
            dtt = mt.p.dtab.offset().top;

            setInterval(function () {
                var t = mt.t.top();
                if (t > dtt) {
                    if (!mt.p.dtab.hasClass('dtab2')) {
                        mt.p.dtab.addClass('dtab2');
                    }
                } else if (t < dtt) {
                    if (mt.p.dtab.hasClass('dtab2')) {
                        mt.p.dtab.removeClass('dtab2');
                    }
                }
            }, 100);
        }, 2000);
        
    }
    // 加载评价-
    , load_cmt: function () {
        var s = '<div class="dcmti"><div class="zoom">';
        s += '<a href="/user/{7}"><img class="left av" src="{0}" /></a>';
        s += '<a href="/user/{7}"><b>{1}{2}</b></a>';
        s += '<div class="right"><i class="score1"><i class="score2" style="width:{3}%;"></i></i></div>';
        s += '</div><div class="con">';
        s += '<div class="f12">{4}</div>';
        s += '<div class="cdesc"><p>{5}</p></div>';
        s += '<div class="cimgs zoom">{8}</div>';
        s += '<div><i class="f12 c6 cmtcc">{6}</i>';
        s += '<i class="right f12 cdzan{9}" data-id="{10}">有用{11}</i></div>';
        s += '</div></div>';

        var data = { start: $('.dcmti').length, limit: 10, activity_id: mt.t.id };

        mt.t.jsonp('comment/getByActivity', data, function (ret) {
            if (data.start == 0) {
                $('.score2').css('width', ret.average_satisfaction * 100 / 5 - 2 + '%');
                $('#ddiv1 td').eq(2).html(ret.average_satisfaction);

                $('#cmtcnt0,#cmtcnt').html(ret.comment_cnt);
                if (ret.comment_cnt > 0) {
                    $('#cmt_score0').html(ret.average_satisfaction).parent().removeClass('none');

                    $('.pjtr').on('click', function () {
                        $('.dtab a').eq(1).click();
                        var dtt = $('.dtab').parent().offset().top;
                        mt.t.top(dtt);
                    });
                } else {
                    $('#ddiv1').html('<div class="nodata"><p>暂时没有用户评价</p><p class="pmore"></p></div>');
                }
            }
            if (ret.comments.length > 0) {
                
                var ss = '';
                for (var i in ret.comments) {
                    var m = ret.comments[i];
                    var s2 = '';
                    for (var j = 0; j < m.images.length; j++) {
                        s2 += '<img src="{0}" onclick="mt.p.imgprev(this,{1})" />'.format(
                            mt.t.reimg(m.images[j], 200, 200), j);
                    }
                    ss += s.format(m.user_img_path.small
                        , m.nick_name, (m.user_is_verified ? '<i class="v">V</i>' : '')
                        , (m.overall_score * 100 / 5 - 2)
                        , m.create_date, m.content, m.act_item_title
                        , m.user_id, s2
                        , (m.i_like_it ? ' cdzan2' : ''), m.comment_id
                        , m.num_upvotes > 0 ? '(' + m.num_upvotes + ')' : '');
                }
                $('.dcmtbox').append(ss);
                mt.p.in_cmt();

                if (ret.comments.length < 10) {
                    $('.pmore').eq(0).html('');
                    document.onscroll = null;
                } else {
                    $('.pmore').eq(0).html('上拉继续加载');
                }
            } else {
                $('.pmore').eq(0).html('');
                document.onscroll = null;
            }
            mt.doing = false;
        });
    }
    , in_cmt: function () {
        $('.cdesc').each(function () {
            if (this.offsetHeight > 115 && !$(this).hasClass('cdesc2')) {
                $(this).addClass('cdesc2').on('click', function () {
                    var t = $(this);
                    if (t.hasClass('cdesc2')) {
                        t.removeClass('cdesc2');
                    } else {
                        t.addClass('cdesc2');
                    }
                }).after('<p class="cdmore"></p>');
            }
        });
        $('.cdmore').off('click').on('click', function () {
            var t = $(this).prev();
            if (t.hasClass('cdesc2')) {
                t.removeClass('cdesc2');
            } else {
                t.addClass('cdesc2');
            }
        });
        $('.cdzan').off('click').on('click', function () {
            var t = $(this);
            if (t.hasClass('cdzan2')) return;
            var uid = mt.t.cookie.get('uid');
            if (!uid) {
                location = '/guest/wxlogin';
                return;
            }
            var data = {
                comment_id: t.attr('data-id')
            };
            mt.t.post('q=comment/upvote&m=get&c=uid', data);
            var cnt = parseInt(t.html().replace(/\D/g, ''), 10) || 0;
            cnt += 1;
            t.html('有用(' + cnt + ')').addClass('cdzan2');
        });
    }
    // 加载资讯-
    , load_qa: function () {

        var s = '<div class="qaitem botl"><div class="qhd">';
        s += '<a href="/user/{0}"><img class="left av" src="{1}" />';
        s += '<i class="left">{2}</i></a>';
        s += '<i class="f12 c6">{3}</i></div>';
        s += '<div class="qcon goto" data-href="/plus/qa/{4}?act_query_id={5}">{6}</div>';
        s += '{7}</div>';

        var s2 = '<div class="abox goto" data-href="/plus/qa/{3}?act_query_id={4}">';
        s2 += '<div class="ahd"><img class="left av" src="{0}" />';
        s2 += '<i class="left">{1}</i><i class="f12 c6">{2}</i>';
        s2 += '</div><div class="acon">{5}</div></div>';

        var data = { product_id: mt.t.id, start: $('.qaitem').length, limit: 10 };

        mt.t.jsonp('product/askList', data, function (ret) {
            if (data.start == 0) {
                $('#qacnt').html(ret.query_count);
            }
            if (ret.query_list.length > 0) {
                var ss = '';
                for (var i = 0; i < ret.query_list.length; i++) {
                    var m = ret.query_list[i];
                    var r = m.replies.length > 0 ? m.replies[0] : null;
                    ss += s.format(m.user_id, m.avatar.small, m.nickname
                        , m.query_date, 'detail', m.act_query_id, m.content
                        , (r ? s2.format(r.avatar, r.wx_name, r.reply_date
                        , 'detail', m.act_query_id, r.content) : '')
                        );
                }
                $('#dqalist').append(ss);
                mt.t.goto();

                if (ret.query_list.length < 10) {
                    $('.pmore').eq(1).html('');
                    document.onscroll = null;
                } else {
                    $('.pmore').eq(1).html('上拉继续加载');
                }
            } else {
                $('.pmore').eq(1).html('');
                document.onscroll = null;
            }
            mt.doing = false;
        });
    }
    // 图片预览功能-
    , imgprev: function (e, i) {
        var s = [];
        if ($.isArray(e)) {
            s = e;
        } else {
            $(e).parent().find('img').each(function () {
                s.push(mt.t.reimg(this.src, 750));
            });
        }
        mt.t.imgprev(s, i);
        var s = '<div class="w" style="height:100%;"></div>';
        $('.shide2').append(s);
        $('.shide2>.w').append($('.imgprev'));
        $('.imgprev>i').css('width', mt.t.w + 'px');
    }
};

setTimeout(mt.curr.init, 500);