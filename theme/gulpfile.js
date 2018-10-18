


// 引入 gulp及组件
var gulp = require('gulp'),  //gulp基础库
    minifycss = require('gulp-minify-css'),   //css压缩
    concat = require('gulp-concat'),   //合并文件
    uglify = require('gulp-uglify'),   //js压缩
    rename = require('gulp-rename'),   //文件重命名
    // jshint = require('gulp-jshint'),   //js检查
    notify = require('gulp-notify'),   //提示
    // 获取 gulp-imagemin 模块
    imagemin = require('gulp-imagemin'),
    watchPath = require('gulp-watch-path'),
    gutil = require('gulp-util'),
    less = require('gulp-less'),
    rev = require('gulp-rev'),
    clean = require('gulp-clean'),
     pump    = require('pump'),
    revCollector = require('gulp-rev-collector'),
    useref = require('gulp-useref'),
    autoprefixer = require('gulp-autoprefixer');

    gulp.task('clean',function(){
    return gulp.src('dist',{read:false}).pipe(clean());
});


gulp.task('less', function () {
    gulp.src('style92_1/less/index.less')
        .pipe(less())
        .pipe(autoprefixer({
            browsers: 'last 2 versions'
        }))
        .pipe(minifycss()) //兼容IE7及以下需设置compatibility属性 .pipe(cssmin({compatibility: 'ie7'}))
        .pipe(rev())
        .pipe(gulp.dest('style92_1/dist/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('style92_1/dist/css'));
});

//Html替换css、js文件版本  
gulp.task('revHtmlCss', function () {  
    return gulp.src(['./style92_1/dist/**/*.json', 'style92_1/index.twig'])  
    // return gulp.src([opt.staticDestFolder + '/**/rev-manifest.json', opt.htmlSrcFolder + '/**/*.twig'])  
        .pipe(revCollector({
             replaceReved:true
        }))                         //替换html中对应的记录  
        .pipe(gulp.dest('./style92_1'));                     //输出到该文件夹中  
});  

//JS处理
gulp.task('script', function () {
    gulp.src('style92_1/js/index.js')
        .pipe(uglify())
        .pipe(concat('index.js'))
        .pipe(rev())
        .pipe(gulp.dest('style92_1/dist/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('style92_1/dist/js'))
})

//输出css、js到develop
gulp.task('output',function(){
    gulp.watch(['./**/js/*.js'],function(e){
        var pa = e.path.split("\\");
        var num = pa.indexOf('theme') +1;
        var theme = pa[num];
        gulp.src(theme+'/js/*.js')
            .pipe(concat('index.js'))
            .pipe(rev())
            .pipe(gulp.dest('../frontend/develop/'+theme))
            .pipe(rev.manifest())
            .pipe(gulp.dest(theme+'/dist/js'))
    });
    gulp.watch(['./**/less/*.less'], function (e) {
        var pa = e.path.split("\\");
        var num = pa.indexOf('theme') + 1;
        var theme = pa[num];
        gulp.src(theme + '/less/*.less')
            .pipe(less())
            .pipe(autoprefixer({
                browsers: 'last 2 versions'
            }))
            .pipe(concat('index.css'))
            .pipe(rev())
            .pipe(gulp.dest('../frontend/develop/' + theme))
            .pipe(rev.manifest())
            .pipe(gulp.dest(theme + '/dist/style'));
    })
});

// 在命令行使用 gulp auto 启动此任务
gulp.task('auto', function () {
    // gulp.watch('css/*.css', ['css']);
    // gulp.watch('image/*.*', ['images']);
    gulp.watch('less/*.less', ['less','revHtmlCss']);
    gulp.watch('js/*.js', ['script','revHtmlCss']);

});

gulp.task('default', ['script','less','auto','revHtmlCss'])