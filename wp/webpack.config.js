var webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    devtool: 'eval-source-map',//配置生成Source Maps，选择合适的选项
    entry: {
        main: __dirname + '/app/main.js',
        jquery: ['jquery']
    },
    output: {
        filename: '[name].[chunkHash:5].js',
        path: __dirname + "/public"
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: ExtractTextPlugin.extract({fallback: "style-loader", use: "css-loader"})},
            {test: /\.(png|jpg|jpeg|gif)$/, loader: 'url-loader?limit=8192'},
            {test: /\.svg/, loader: 'svg-url-loader'}
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ['jquery', 'manifest']
        }),
        new HtmlWebpackPlugin({
            title: 'demo',
            template: 'public/index.templete.html', // 模板路径
            filename: "index.html"
        }), new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new ExtractTextPlugin("[name]-[hash:5].css")
    ]

}