/**
 * 
 * @authors  (duke 365650070@qq.com)
 * @date    2016-02-29 11:48:57
 * @version $Id$
 */

GAG.lhFeature.changeData = function(id) {
    this.ID = id;
};

GAG.lhFeature.changeData.prototype.init = function() {
    this.show(this);

    var body = $('body');
    document.title = $.AMUI.store.get('entity_name')||'';
    var iframe = $('<iframe src="i/phone.png" width="0px" height="0px"></iframe>');
    iframe.on('load', function() {
        setTimeout(function() {
            iframe.off('load').remove();
        }, 0);
    }).appendTo(body);
};

GAG.lhFeature.changeData.prototype.show = function(This) {
    var interval = null;
    var getDateStr = function(num) {
        var dateObj = new Date();
        dateObj.setDate(dateObj.getDate() + num);
        var y = dateObj.getFullYear();
        var m = (dateObj.getMonth() + 1) < 10 ? '0' + (dateObj.getMonth() + 1) : (dateObj.getMonth() + 1);
        var d = dateObj.getDate() < 10 ? '0' + dateObj.getDate() : dateObj.getDate();

        return y + '-' + m + '-' + d;
    };
    $('#sale').attr('readonly', false);
    $('#bill').attr('readonly', false);
    $('#spanVal').html(getDateStr(0));
    $('#post-data').removeClass('am-disabled');

    //前端控制上报规则
    // var currentDate = getDateStr(0);

    // if (currentDate == '2016-08-20') {
    //     $('#rule-tips').css('display', 'none');
    // }

    // clearInterval(interval);
    // interval = setInterval(function(argument) {
    //     var date = new Date();
        
    //     var currentTime = (date.getHours()>=10?date.getHours():'0'+date.getHours())+':'+(date.getMinutes()>=10?date.getMinutes():'0'+date.getMinutes())+':'+(date.getSeconds()>=10?date.getSeconds():'0'+date.getSeconds());

    //     if (currentDate == '2016-08-20') {
    //         $('#sale').attr('readonly', false);
    //         $('#bill').attr('readonly', false);
    //         $('#spanVal').html(getDateStr(0));
    //         $('#post-data').removeClass('am-disabled');
    //     } else {
    //         if (currentTime >= '00:00:00' && currentTime < '08:59:59') {
    //             $('#sale').attr('readonly', false);
    //             $('#bill').attr('readonly', false);
    //             $('#spanVal').html(getDateStr(-1));
    //             $('#post-data').removeClass('am-disabled');
    //         } else if (currentTime >= '09:00:00' && currentTime < '21:59:59') {
    //             $('#sale').attr('readonly', true);
    //             $('#bill').attr('readonly', true);
    //             $('#spanVal').html(getDateStr(-1));
    //             $('#post-data').addClass('am-disabled');
    //         } else if (currentTime >= '22:00:00' && currentTime <= '23:59:59') {
    //             $('#sale').attr('readonly', false);
    //             $('#bill').attr('readonly', false);
    //             $('#spanVal').html(getDateStr(0));
    //             $('#post-data').removeClass('am-disabled');
    //         }
    //     }
        
    // }, 1000);

    var nowTemp = new Date();
    var nowDay = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0).valueOf();
    var nowMoth = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), 1, 0, 0, 0, 0).valueOf();
    var nowYear = new Date(nowTemp.getFullYear(), 0, 1, 0, 0, 0, 0).valueOf();

    nowTemp.setDate(1);
    nowTemp.setMonth(nowTemp.getMonth() - 1);
    var cdt = new Date(nowTemp.getTime() - 1000 * 60 * 60 * 24);
    var towMothDay = new Date(cdt.getFullYear(), cdt.getMonth(), cdt.getDate(), 0, 0, 0, 0).valueOf();
    var towMothMoth = new Date(cdt.getFullYear(), cdt.getMonth(), 1, 0, 0, 0, 0).valueOf();
    var towMothYear = new Date(cdt.getFullYear(), 0, 1, 0, 0, 0, 0).valueOf();

    var $myStart2 = $('#my-datepicker input');

    var checkin = $myStart2.datepicker({
        onRender: function(date, viewMode) {
            // 默认 days 视图，与当前日期比较
            var viewDateE = nowDay;
            var viewDateS = towMothDay;

            switch (viewMode) {
                // moths 视图，与当前月份比较
                case 1:
                    viewDateE = nowMoth;
                    viewDateS = towMothMoth;
                    break;
                    // years 视图，与当前年份比较
                case 2:
                    viewDateE = nowYear;
                    viewDateS = towMothYear;
                    break;
            }

            return date.valueOf() > viewDateE || date.valueOf() <= viewDateS ? 'am-disabled' : '';
        }
    }).data('amui.datepicker');
    
    $myStart2.datepicker('setValue', $('#spanVal').html());

    $('.am-datepicker-switch, .am-datepicker-select').addClass('am-disabled');

    $('#spanVal').off('click').on('click', function(event) {
        event.preventDefault();
        $('#my-datepicker input').datepicker('open');
    });

    $('#my-datepicker input').datepicker().on('changeDate.datepicker.amui', function(event) {
        var dataVal = $('#my-datepicker input').val();
        $('#spanVal').html(dataVal);
        $('#sale').focus();
    });

    $('.am-tijiao').removeClass('am-hide').addClass('am-show'); //提交展现

    This.postClick(This);
};

GAG.lhFeature.changeData.prototype.postClick = function(This) {

    $('#post-data').off('click').on('click', function(event) {
        event.preventDefault();

        if (/^(-)?\d+(\.\d+)?$/.test($('#sale').val()) && /^(0|[1-9]\d*)$/.test($('#bill').val())) {
            var str = '<p>销售日期：' + $('#spanVal').html() + '</p>' +
            '<p>日销售额<small>(元)</small>：' + $('#sale').val() + '</p>' +
            '<p>日销售单<small>(单)</small>：' + $('#bill').val() + '</p>';

            $('.am-modal-bd').html(str).addClass('am-text-left').removeClass('am-text-center');
            $('#tow-btn').removeClass('am-hide').addClass('am-show');
            $('#one-btn').removeClass('am-show').addClass('am-hide');
            var closeWindow = false;

            $('#my-confirm').modal({
                closeViaDimmer: false,
                closeOnCancel: false,
                closeOnConfirm: false,
                onConfirm: function(options) {
                    $.ajax({
                            url: BASE_API_URL + "/backTrack/backTrackInfoSave.do",
                            type: "POST",
                            dataType: "json",
                            data: {
                                backTrack_login_token: This.ID,
                                backTrackTime: $('#spanVal').html(),
                                moneyTotal: $('#sale').val(),
                                billTotal: $('#bill').val()
                            },
                        })
                        .done(function(back) {
                            if (back.status === 'S') {
                                closeWindow = true;
                                $('#my-confirm .am-modal-bd').html('<p class="am-text-warning">'+$('#spanVal').html()+'</p><p>营业数据上报成功!</p>').addClass('am-text-center').removeClass('am-text-left');
                                $('#one-btn').removeClass('am-hide').addClass('am-show');
                                $('#tow-btn').removeClass('am-show').addClass('am-hide');
                            } else {
                                $('.am-modal-bd').html('<p class="am-text-warning">'+back.msg+'</p>').addClass('am-text-center').removeClass('am-text-left');
                                $('#one-btn').removeClass('am-hide').addClass('am-show');
                                $('#tow-btn').removeClass('am-show').addClass('am-hide');
                            }
                        });
                },
                onCancel: function() {
                    if (closeWindow) {
                        window.location.reload();
                    } else {
                        $('#my-confirm').modal('close');
                    }
                }
            });

        } else {
            if (!/^(-)?\d+(\.\d+)?$/.test($('#sale').val())) {
                $('#my-alert').modal('open');
                $('#my-alert .am-modal-bd').html('<p class="am-text-warning">销售额不能为空且为数值</p>').addClass('am-text-center').removeClass('am-text-left');
            } else {
                $('#my-alert').modal('open');
                $('#my-alert .am-modal-bd').html('<p class="am-text-warning">销售单为大于等于零整数</p>').addClass('am-text-center').removeClass('am-text-left');
            }
        }

    });

};
