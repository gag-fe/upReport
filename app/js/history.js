/**
 * 
 * @authors  (duke 365650070@qq.com)
 * @date    2016-06-07 17:40:17
 * @version $Id$
 */

GAG.lhFeature.history = function(id) {
    this.ID = id;
};

GAG.lhFeature.history.prototype.init = function() {
    this.show(this);
};

GAG.lhFeature.history.prototype.show = function(This) {
    var userData = $.AMUI.store.get('_user_data');

    $.ajax({
        url: BASE_API_URL + '/backTrack/history.do',
        type: 'GET',
        dataType: 'json',
        data: {
            backTrack_login_token: userData.token,
            shopEntityId: userData.shopEntityId
        }
    })
    .done(function(back) {

        var str = '';
        if (back.status == 'S' && back.data.length > 0) {
            for (var i = 0; i < back.data.length; i++) {
                str += '<tr><td class="am-m-red">'+This.formatDate(back.data[i].saleTime)+'</td><td class="am-m-red">'+(back.data[i].moneyTotal || Number(back.data[i].moneyTotal) === 0 ? '¥'+formatCurrency(back.data[i].moneyTotal) : '')+'</td><td>'+(back.data[i].billTotal || Number(back.data[i].billTotal) === 0 ? back.data[i].billTotal+'<small>单</small>' : '')+'</td></tr>';
            }
        } else {
            str = back.msg;
        }

        $('tbody').html(str);

    });
    
};

GAG.lhFeature.history.prototype.formatDate = function(str) {
    var dateStr = '';
    if (str) {
        var DateStr = new Date(str);
        var Y = DateStr.getFullYear();
        var M = ((DateStr.getMonth()+1) >= 10 ? (DateStr.getMonth()+1) : '0'+(DateStr.getMonth()+1));
        var D = (DateStr.getDate() >= 10 ? DateStr.getDate() : '0'+DateStr.getDate());

        dateStr = Y + '-' + M + '-' + D;
    }

    return dateStr;
};