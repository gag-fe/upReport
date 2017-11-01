/**
 * 
 * @authors  (xx)
 * @date    2016-02-29 19:10:58
 * @version $Id$
 */
GAG.lhFeature.login = function(id) {
    this.ID = id;
    this.type = 1;
};

GAG.lhFeature.login.prototype.init = function() {

    if (this.type == '0') {
        this.out();
    } else {
        this.in(this);
        this.userName(this);
    }

    var body = $('body');
    document.title = '营业数据上报';
    var iframe = $('<iframe src="i/phone.png" width="0px" height="0px"></iframe>');
    iframe.on('load', function() {
        setTimeout(function() {
            iframe.off('load').remove();
        }, 0);
    }).appendTo(body);

};

GAG.lhFeature.login.prototype.out = function(argument) {
    var This = this;
    $.ajax({
        url: BASE_API_URL + '/login/cancellogin.do',
        type: 'GET',
        dataType: 'JSON',
        data: {
            token: $.AMUI.store.get('_user_data').token
        }
    })
    .done(function(back) {
        if (back.status === 'S') {
            $.AMUI.store.set('_user_data', null);
        } else {
            $.AMUI.store.set('_user_data', null);
        }
        window.location.href = window.location.origin + '/#/target/login/id/'+This.ID;
    });
};

GAG.lhFeature.login.prototype.in = function(This) {
    var interval = null;

    $('#login_in').off('click').on('click', function(event) {
        event.preventDefault();
        if ($('.user-name input').attr('value-data') && $('#password').val()) {
            $.ajax({
                url: BASE_API_URL + "/backTrack/backTrackLogin.do",
                type: "POST",
                dataType: "json",
                data: {
                    shopEntityId: $('.user-name input').attr('value-data'),
                    password: $('#password').val()
                },
            }).done(function(back) {

                if (back.status === 'S') {

                    var store = $.AMUI.store;
                    var now = new Date();
                    var currentDate = now.getFullYear() + '-' + now.getMonth() + '-' + now.getDate();
                    var userData = $.AMUI.store.get('_user_data')||{};
                    userData.token = back.data.token;
                    userData.creatDate = currentDate;
                    userData.shopEntityId = $('.user-name input').attr('value-data');

                    store.set('_user_data', userData);
                    store.set('entity_name', $('.user-name input').val());

                    window.location.href = window.location.origin + '/#/target/change-data/id/'+back.data.token;

                } else {

                    $('#error1').removeClass('text-success').addClass('text-danger').html(back.msg);
                    setTimeout(function() {
                        $('#error1').html('');
                        $('#password').val('');
                    }, 10000);

                }
            });
        } else {

            if (!$('.user-name input').attr('value-data')) {
                $('#error1').removeClass('text-success').addClass('text-danger').html('请输入正确账号');
                setTimeout(function() {
                    $('#error1').html('');
                }, 10000);
            } else {
                $('#error1').removeClass('text-success').addClass('text-danger').html('请输入正确密码');
                setTimeout(function() {
                    $('#error1').html('');
                }, 10000);
            }

        }
    });
};

GAG.lhFeature.login.prototype.userName = function(This) {
    var interval = null;
    var currentVal = '';
    var showLock = true;

    $('.user-name input').off('focus').on('focus', function(event) {
        event.preventDefault();
        showLock = true;
        interval = setInterval(function(argument) {
            var inputVal = $('.user-name input').val();

            if (inputVal !== '' && inputVal !== currentVal && showLock) {

                currentVal = inputVal;

                if (!$('.user-name').hasClass('am-active')) {
                    $('.user-name').addClass('am-active');
                }

                $.ajax({
                    url: BASE_API_URL + '/backTrack/shopEntityNameMatching.do',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        shopEntityName: inputVal,
                        shopId: This.ID
                    },
                })
                .done(function(back) {
                    if (back.status == 'S') {
                        var str = '';
                        for (var i = 0; i < back.data.length; i++) {
                            str += '<li class="" data-index="0" data-group="0" data-value="'+back.data[i].code+'"> <span class="am-selected-text">'+back.data[i].name+'</span></li>';
                        }
                        
                        $('.user-name ul').html(str);
                        searchDataClick();
                    }
                });
                // searchDataClick();
            }

            if (inputVal === '') {
                $('.user-name').removeClass('am-active');
                $('.user-name ul').html('');
            }

        }, 1000);
    });

    $('.user-name input').off('blur').on('blur', function(event) {
        event.preventDefault();
        setTimeout(function(argument) {
            if ($('.user-name').hasClass('am-active')) {
                $('.user-name').removeClass('am-active');
            }
            if ($('.user-name input').val() !== '') {
                currentVal = $('.user-name input').val();
            }
        }, 100);
    });

    var searchDataClick = function(argument) {
        $('.user-name li').off('click').on('click', function(event) {
            event.preventDefault();
            showLock = false;
            clearInterval(interval);
            $('#password').focus();
            $('.user-name input').val($(this).children('span').html()).attr({
                "value-data": $(this).attr('data-value')
            });
            $('.user-name').removeClass('am-active');
            $('.user-name ul').html('');
        });
    };

};





