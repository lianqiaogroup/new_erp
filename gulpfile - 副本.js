// 模版配置文件
var config = require('./config_theme');
// 模块插件列表
var gulp = require('gulp');
// LESS 预编译
var less = require('gulp-less'); 
// LESS 地图
var sourcemaps = require('gulp-sourcemaps');
// 目录模块
var path = require('path');
// 压缩css模块
var minifycss = require('gulp-minify-css'); 
// 重命名模块
var rename = require('gulp-rename');
// 监控模块
var watch  = require('gulp-watch');
// 删除文件模块
var clean = require('gulp-clean');
// 替换模块
var replace = require('gulp-replace');
// 命令行参数模块
var minimist = require('minimist');
// Node file system 文件模块
var fs = require('fs');
// 命令行颜色模块
var color = require('colors');
// 阻止报错挂起模块
var notify = require('gulp-notify');
// 阻止报错挂起模块
var plumber = require('gulp-plumber');
// 压缩JS
var uglify = require('gulp-uglify');
// js语法规范
var eslint = require('gulp-eslint');
// 
var concat = require('gulp-concat');


// 生成模版路径
function sourceFile(type){
    var extra = {
        'less': ['/less/index.less', '/less/checkout.less']
        , 'css': '/style/*.css'
        , 'minicss': '/style/*.min.css'
        , 'twig': '/*.twig'
        , 'js': '/js/*.js'
    }
    var themeName = optionsGet('theme');
    if( themeName == "" ) return [];
    if( themeName == "all" ){
        return config.themes.map(function(themeName){
            var _path = config.dest + themeName;
                _path = _path + extra[type]
            return _path;
        });
    }else{
        if( !config.themes.includes(themeName) ) return [];
        if( Array.isArray(extra[type])==true ){
            return extra[type].map(rule => config.dest+themeName+rule );
        }else{
            return [config.dest+themeName+extra[type]];
        }
    }
}

// 全局命令行参数
var options = minimist(process.argv.slice(2));

// 全局命令行参数 - 获取
var optionsGet = function(param){
    var option = options[param] || "true";
        option = option.toString();
        option = option === "true" ? "" : option;
    return option;
}

// less to css
gulp.task('less', function () {
    return gulp.src(sourceFile('less'), { base: 'theme' })
        .pipe(less())
        .pipe(minifycss())
        .pipe(rename(function(path){
            path.dirname = path.dirname.replace(/less/, 'style');
            return path;
        }))
        .pipe(gulp.dest(config.dest));
});

// Convert: css to min.css
gulp.task('minifycss', ['clean'], function () {
    return gulp.src(sourceFile('css'), { base: 'theme' })
        // .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest(config.dest));
});

// Delete: min.css file
gulp.task('clean', function() {
    return gulp.src(sourceFile('minicss'))
        .pipe(clean());
});

// 替换css url
gulp.task('replace-css', function(){
    function replacement(match, offset, string){
        return match.replace(/\.min\.css/, '.css');
    }
    return gulp.src(sourceFile('twig'), { base: 'theme' })
        .pipe(replace(/style\/\w*\.min\.css/, replacement))
        .pipe(gulp.dest(config.dest));
});

// 替换css url
gulp.task('replace-minicss', function(){
    function replacement(match, offset, string){
        return match.replace(/\.css/, '.min.css');
    }
    return gulp.src(sourceFile('twig'), { base: 'theme' })
        .pipe(replace(/style\/\w*\.css/, replacement))
        .pipe(gulp.dest(config.dest));
});

// watch file
gulp.task('watch', function(){
    gulp.watch(sourceFile('less'), ['less']); //当所有less文件发生改变时，调用testLess任务
});

// 检查js规范
gulp.task('checkJsCode', function(){
    return gulp.src(sourceFile('js'))
        .pipe(eslint({
            rules: {
                "quotes": [1, "single"],
                "id-length": 2,
                "indent": [1, 4],
                "vars-on-top": 1,
                "default-case": 2,
                "no-mixed-spaces-and-tabs": [1, false],
                "space-before-function-paren": [0, "always"],
                "comma-style": [2, "first"],
                "consistent-return": 2,
            }
            , global: [
                "$"
            ]
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});


// ====================================================
// 统计任务
// ====================================================

gulp.task('tongji', function(){
    gulp.src('public/javascript/tongji.js').pipe(uglify({mangle:true, compress:true})).pipe(rename('tongji.min.js')).pipe(gulp.dest('public/javascript'));
});

// ====================================================
// new theme 创建一个新模版
// 语法：gulp theme --style1
// ====================================================

gulp.task('theme', function() {
    var themeName = optionsGet('new');
    if( themeName && themeName != "" ){
        var exits = false;
        try{
            var status = fs.statSync(path.join(__dirname,'theme/'+themeName));
            exits = status.isDirectory();
        }
        catch(ex){
            exits = false;
        }
        if( !exits ){
            gulp.src('./theme/demo/**/*.*', { base: 'theme/demo/' })
                .pipe(gulp.dest(config.dest + themeName));
            // 
            gulp.src('./config_theme.js')
                .pipe(replace('//forinsert', ", '"+themeName+"'\n //forinsert"))
                .pipe(gulp.dest('./'));
            // 
            config = require('./config_theme');
            // 
            console.log("==================================".green);
            console.log((themeName+" has been created!").green);
            console.log("==================================".green);
        }else{
            console.log("==================================".red);
            console.log(("WARNING: " + themeName + " is exits!").red);
            console.log("==================================".red);
        }
    }
});

// ====================================================
// theme 模版开发任务
// ====================================================

gulp.task('dev', function(){
    var theme = options.t || options.theme || "";
    if( theme=="" ){
        console.log('输入参数名'.red);
        console.log('gulp dev --t xxx'.red);
        console.log('gulp dev --theme xxx'.red);
        return false;
    }
    gulp.run(['less']);
    gulp.watch(sourceFile('less'), ['less']);
});



// ====================================================
// Home 聚合站开发任务
// ====================================================


gulp.task('homedev', function(){
    var home = options.home || "";
    if( home=="" ){
        console.log('输入参数名'.red);
        console.log('gulp dev --t xxx'.red);
        console.log('gulp dev --home xxx'.red);
        return false;
    }
    gulp.run(['home-less']);
    gulp.watch(homeSourceFile(), ['home-less']);
});

function homeSourceFile(){
    var themeName = optionsGet('home');
    return [`./home/${themeName}/less/**/*.less`];
}

gulp.task('home-less', function(){
    var themeName = optionsGet('home');
    if( themeName=='' ) return false;
    gulp.src([`./home/${themeName}/less/*.less`])
        .pipe(less())
        .pipe(minifycss())
        .pipe(gulp.dest(`./home/${themeName}/style/`));
});


// ====================================================
// 公共 checkout page's less 任务
// ====================================================

gulp.task('checkout-dev', ['checkout-less'], function(){
    gulp.watch(['public/less/page-checkout.less'], ['checkout-less']);
});
gulp.task('checkout-less', function(){
    gulp.src('public/less/page-checkout.less')
        .pipe(less())
        .pipe(minifycss())
        .pipe(gulp.dest('public/style/'));
});

    

// ====================================================
// Diy Home 自定义首页
// ====================================================

gulp.task('diy', function(){
    gulp.run(['diyless', 'diywatch']);
});

// less to css
gulp.task('diyless', function () {
    return gulp.src('home/diy/assets/less/style.less')
        .pipe(less())
        .pipe(gulp.dest('home/diy/assets/style/'));
});

// watch
gulp.task('diywatch', function () {
    gulp.watch('home/diy/assets/less/**/*.less', ['diyless']);
});



// ====================================================
// bundle 打包所有js
// ====================================================

let bundleV1 = [
    'public/javascript/validform.js',
    'public/javascript/Widget.js',
];

let bundleV2 = [
    'public/javascript.v2/zepto.min.js'
    , 'public/javascript/validform.js'
    , 'public/javascript.v2/widget.v2.js'
    , 'public/javascript.v2/commentsScroll.js'
    , 'public/javascript.v2/gallery.js'
    , 'public/javascript.v2/lazyload.js'
    , 'public/javascript.v2/require.js'
];

let bundleV3 = [
    'public/javascript.v3/zepto.min.js'
    , 'public/javascript/validform.js'
    , 'public/javascript.v3/widget.v3.js'
    , 'public/javascript.v3/commentsScroll.js'
    , 'public/javascript.v3/gallery.js'
    , 'public/javascript.v3/lazyload.js'
    , 'public/javascript.v3/require.js'
];


gulp.task('bundle', function() {
    // 
    gulp.watch(bundleV1, function(e){
        gulp.src(bundleV1)
            .pipe(concat('bundle.v1.js'))
            .pipe(uglify())
            .pipe(gulp.dest('public/cache_script'));
        console.log('finish======================');
    });
    // 
    gulp.watch(bundleV2, function(e){
        gulp.src(bundleV2)
            .pipe(concat('bundle.v2.js'))
            .pipe(uglify())
            .pipe(gulp.dest('public/cache_script'));
        console.log('finish======================');
    });
    // 
    gulp.watch(bundleV3, function(e){
        gulp.src(bundleV3)
            .pipe(concat('bundle.v3.js'))
            .pipe(uglify())
            .pipe(gulp.dest('public/cache_script'));
        console.log('finish======================');
    });
});


// ========================================================================================
// ========================================================================================


let webpack = require('gulp-webpack');
let webpackConfig = require('./frontend/webpack.config.js');

// main fn
gulp.task('vueit', [], function(){
    gulp.watch(['./frontend/source/views/*.js', './frontend/source/components/*.vue'], function(e){
        gulp.src(['./frontend/source/views/sms.js'])
            .pipe(webpack(webpackConfig))
            .pipe(gulp.dest('./frontend/dist/'));
    });
    return false;
});








// =============================
// 推送到七牛CDN
// =============================
// gulp.task('bundlecdn', ['change2CDN'], function(){

//     var localFile = "./public/cache_script/bundle.js";
//     var formUploader = new qiniu.form_up.FormUploader(qniuConfig);
//     var putExtra = new qiniu.form_up.PutExtra();
//     var key = 'static/javascript/bundle.js';

//     // 文件上传
//     formUploader.putFile(uploadToken, key, localFile, putExtra, function(respErr,
//       respBody, respInfo) {
//       if (respErr) {
//         throw respErr;
//       }
//       if (respInfo.statusCode == 200) {
//         console.log(respBody);
//       } else {
//         console.log(respInfo.statusCode);
//         console.log(respBody);
//       }
//     });
// });


// var qiniu = require("qiniu");

// var accessKey = 'fcJJ_cIBdKudnO1P3BsXjnEpWDysyqc7jFfgMW2Q';
// var secretKey = 'esorL4VbeHRrKPGtXz-sWZRBEU4sBCkDPHxd8lnI';
// var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
// var qiniuOptions = {
//     scope: 'buguniao-shop-cn'+":"+"static/javascript/bundle.js"
// };
// var putPolicy = new qiniu.rs.PutPolicy(qiniuOptions);
// var uploadToken = putPolicy.uploadToken(mac);

// var qniuConfig = new qiniu.conf.Config();
//     qniuConfig.zone = qiniu.zone.Zone_z2;
//     qniuConfig.useCdnDomain = true;



