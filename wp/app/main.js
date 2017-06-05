/**
 * Created by zhoumao on 2017/6/3.
 */
//main.js
require('style-loader!css-loader!./style.css')

var $ = require('jquery');
var str = require('./hello.js');

function main() {
    $('body').html(str);
}
main();