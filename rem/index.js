var px2rem = require('px2rem');

var config = {
    dir: '/css'   // 需要转换的css的目录
    , unitPx: 20    // 预设的rem值 即1rem = ? px
}

px2rem.convert(config);