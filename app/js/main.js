//var $ = require('jquery');

// 使用 Amaze UI 源码中的模块
// var addToHome = require('amazeui/js/ui.add2home');

// 使用 NPM 中的模块
require('./config.js');
require('./login.js');
require('./change-data.js');
require('./history.js');
var director = require('director');
// var iscroll = require('iscroll');
require('amazeui/js/util.fastclick');

$(function() {
    'use strict';
    $.AMUI.FastClick.attach(document.body);
    window.formatCurrency = function(num) {
        num = num.toString().replace(/\$|\,/g, '');
        if (isNaN(num))
            num = "0";
        var sign = (num == (num = Math.abs(num)));
        num = Math.floor(num * 100 + 0.50000000001);
        var cents = num % 100;
        num = Math.floor(num / 100).toString();
        if (cents < 10)
            cents = "0" + cents;
        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
            num = num.substring(0, num.length - (4 * i + 3)) + ',' +
            num.substring(num.length - (4 * i + 3));
        return (((sign) ? '' : '-') + num + '.' + cents);
    };

    var hengshuping = function(event) {
        if (window.orientation == 180 || window.orientation === 0) {
            $('#screen-check').removeClass('am-show').addClass('am-hide');
        }
        if (window.orientation == 90 || window.orientation == -90) {
            $('#screen-check').removeClass('am-hide').addClass('am-show');
        }
    };

    window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", hengshuping, false);
    hengshuping();

    function loadTarget(target, id) {
        $('main').html('').load((target ? ('template/' + target + '.html') : 'template/login.html'), function(responseTxt, statusTxt, xhr) {
            if (statusTxt == "success") {
                switch (target) {
                    case 'login':
                        var login = null;
                        login = new GAG.lhFeature.login(id);
                        login.init();
                        break;
                    case 'change-data':
                        var changeData = null;
                        changeData = new GAG.lhFeature.changeData(id);
                        changeData.init();
                        break;
                    case 'history':
                        var historys = null;
                        historys = new GAG.lhFeature.history(id);
                        historys.init();
                        break;
                }
            }
            $('body').removeClass('am-offcanvas-page');
        });
    }

    function loadIndex(id) {
        var store = $.AMUI.store;
        var userData = store.get('_user_data');

        $.ajax({
                beforeSend: function() {
                    $.AMUI.progress.set(0.6);
                },
                complete: function() {
                    $.AMUI.progress.done(true);
                },
                url: BASE_API_URL + '/mobileReportData/userForOrgList.do',
                type: 'GET',
                dataType: 'JSON',
                data: {
                    wxuuid: id
                },
            })
            .done(function(back) {
                if (back.status === 'S' && back.data.length > 0) {

                    store.set('_user_data', {
                        openId: id,
                        active: back.data[0],
                        menuList: back.data
                    });

                    window.location.href = window.location.origin + '/#/target/' + back.data[0].type.toLowerCase() + '/id/' + back.data[0].id;
                } else {
                    alert(back.msg);
                }
            });
    }

    var routes = {
        '/target/:target/id/:id': loadTarget,
        '/wxuuid/:id': loadIndex
    };

    var router = director.Router(routes);

    router.init();
});
