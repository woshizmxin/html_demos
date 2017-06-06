var gulp = require('gulp'),
    rev = require('gulp-rev-append');
replace = require('gulp-replace');
htmlmin = require('gulp-htmlmin');
clean = require('gulp-clean');
cssmin = require('gulp-cssmin');
rename = require('gulp-rename');
uglify = require('gulp-uglify');


gulp.task('default', ['clean'], function () {
    gulp.start('minHashHtml','mincss','minjs','img','fonts');
});


gulp.task('clean', function () {
    return gulp.src('dest/', {read: false})
        .pipe(clean());
});


//压缩js文件
gulp.task('minjs',function(){
    gulp.src('src/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dest/js'));
});


//压缩css文件
gulp.task('mincss',function(){
    gulp.src('src/public/*.css')
        .pipe(cssmin())
        .pipe(gulp.dest('dest/css'));
});

//转移img文件
gulp.task('img',function(){
    gulp.src('src/images/*')
        .pipe(gulp.dest('dest/images'));
});

//转移fonts文件
gulp.task('fonts',function(){
    gulp.src('src/fonts/*')
        .pipe(gulp.dest('dest/fonts'));
});


// 压缩html及其中的js,css代码; 添加hash后缀;
gulp.task('minHashHtml', function () {
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
    return gulp.src('src/**/*.html')
        .pipe(replace("_Public_", "public"))
        .pipe(rev())
        .pipe(replace("public", "_Public_"))
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dest/'));
});


