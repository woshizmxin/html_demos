var webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: 'eval-source-map',//配置生成Source Maps，选择合适的选项
    entry: {
        main: __dirname + '/app/main.js',
        vendor: ['jquery']
    },
    output: {
        filename: '[name].[chunkHash:5].js',
        path: __dirname + "/public"
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest']
        }),
        new HtmlWebpackPlugin({
            title: 'demo',
            template: 'public/index.html' // 模板路径
        }), new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })

    ]

}