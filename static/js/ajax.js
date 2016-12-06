/**
 * Created by zhoumao on 2016/12/6.
 */
function ajaxdata(url,type,data){
    var jsonDetail;
    $.ajax({
        url: url,
        type: type,
        data: data,
        //调小超时时间会引起异常
        timeout: 5000,
//        请求成功后触发
        success: function (json) {
            console.log( json );
            jsonDetail = jQuery.parseJSON(json)
        },

        async: false
    })

    return jsonDetail;
}