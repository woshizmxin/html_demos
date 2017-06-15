var gulp = require('gulp'),
    revappend = require('gulp-rev-append'),
    assetRev = require('gulp-asset-rev'),
    runSequence = require('run-sequence'),
    replace = require('gulp-replace'),
    htmlmin = require('gulp-htmlmin'),
    clean = require('gulp-clean'),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    revCollector = require('gulp-rev-collector'),
    rev = require('gulp-rev');

//定义css、js源文件路径
var cssSrc = 'src/public/*.css',
    jsSrc = 'src/js/*.js';

//开发构建
gulp.task('default',['clean'], function (done) {
    runSequence(    //需要说明的是，用gulp.run也可以实现以上所有任务的执行，只是gulp.run是最大限度的并行执行这些任务，而在添加版本号时需要串行执行（顺序执行）这些任务，故使用了runSequence.
        [ 'mincss', 'minjs', 'img', 'fonts'],
        ['revCss'],
        ['revJs'],
        ['revHtml'],
        done);
});


//CSS生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revCss', function () {
    return gulp.src(cssSrc)
        .pipe(rev())
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/css'));
});


//js生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revJs', function () {
    return gulp.src(jsSrc)
        .pipe(rev())
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/js'));
});


//Html替换css、js文件版本
gulp.task('revHtml', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    return gulp.src(['rev/**/*.json', 'src/**/*.html'])
        .pipe(revCollector())
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dest'));
});


////////////////////////////////////////////////////////

gulp.task('clean', function () {
    return gulp.src('dest/', {read: false})
        .pipe(clean());
});


//压缩js文件
gulp.task('minjs', function () {
    gulp.src('src/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dest/js'));
});


//压缩css文件
gulp.task('mincss', function () {
    gulp.src('src/public/*.css')
        .pipe(cssmin())
        .pipe(gulp.dest('dest/css'));
});

//转移img文件
gulp.task('img', function () {
    gulp.src('src/images/*')
        .pipe(gulp.dest('dest/images'));
});

//转移fonts文件
gulp.task('fonts', function () {
    gulp.src('src/fonts/*')
        .pipe(gulp.dest('dest/fonts'));
});




