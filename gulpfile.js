'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var image = require('gulp-image');
/*var imagemin = require('gulp-imagemin');
 var pngquant = require('imagemin-pngquant');*/
var cache = require('gulp-cache');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var replace = require('gulp-replace');
var jeditor = require("gulp-json-editor");
var debug = require('gulp-debug');

var DEST = 'publish/html5/';

gulp.task('default', ['compileJs', 'copyIndex', 'copyConf', 'image'], function () {
});

gulp.task('compileJs', function () {
    return gulp.src([
            'lib/cocos2d-js-v3.10.js',
            "src/resource.js",
            "src/model/Data.js",
            "src/model/Enemy.js",
            "src/model/Stage.js",
            "src/model/Effect.js",
            "src/model/Skill.js",
            "src/model/Equip.js",
            "src/model/Hero.js",
            "src/model/Player.js",
            "src/model/Event.js",
            "src/model/SkillEffectMappings.js",
            "src/LoaderScene.js",
            "src/battle/CCSUnit.js",
            "src/battle/BattleField.js",
            "src/battle/BuffTips.js",
            "src/battle/Loot.js",
            "src/battle/ActiveSkill.js",
            "src/battle/DamageNumber.js",
            "src/battle/BattleUnit.js",
            "src/battle/HeroUnit.js",
            "src/battle/EnemyUnit.js",
            "src/battle/TopPanel.js",
            "src/battle/BattlePanel.js",
            "src/battle/TabContainer.js",
            "src/battle/MainScene.js",
            "src/battle/BattleMenu.js",
            "src/battle/HeroDesc.js",
            "src/battle/Popup1.js",
            "src/Chance.js",
            "src/GamePopup.js",
            "src/battle/ChestUnit.js",
            "src/battle/FairyUnit.js",
            "src/battle/PackUnit.js",
            "src/battle/StatisticsUnit.js",
            "src/battle/OfflineRewardUnit.js",
            "src/apps.js",
            'main.js'])
        .pipe(debug({title: 'src:'}))
        .pipe(concat('game.js'))
        //.pipe(buffer())
        //.pipe(sourcemaps.init({loadMaps: true}))
        .pipe(gulp.dest(DEST))
        .pipe(uglify())
        .pipe(rename('game.min.js'))
        .pipe(gulp.dest(DEST));
});

gulp.task('copyIndex', function () {
    return gulp.src('index.html')
        .pipe(replace('lib/cocos2d-js-v3.10.js', 'game.min.js'))
        .pipe(replace('<script cocos src="main.js"></script>', ''))
        .pipe(gulp.dest(DEST));
});

gulp.task('copyConf', function () {
    return gulp.src("project.json")
        .pipe(jeditor(function (json) {
            json.version = "0.0.3";
            json.debugMode = 1;
            json.frameRate = 60;
            json.id = 'gameCanvas';
            json.renderMode = 0;
            json.project_type = "javascript";
            json.jsList = [];
            json.showFPS = true;
            json.noCache = false;
            return json; // must return JSON object.
        }))
        .pipe(gulp.dest(DEST));
});

/*
 gulp.task('image', function () {
 return gulp.src('res/!**!/!*.png')
 .pipe(debug({title: 'img:'}))
 .pipe(cache(imagemin({
 optimizationLevel: 7,
 use: [pngquant({quality: '60-80', speed: 1})]
 })))
 .pipe(debug({title: 'img:'}))
 .pipe(gulp.dest(DEST + 'res'));
 });
 */


gulp.task('image', function () {
    return gulp.src('res/**')
        .pipe(image({
            pngquant: true,
            optipng: true,
            zopflipng: false,
            advpng: false,
            jpegRecompress: false,
            jpegoptim: true,
            mozjpeg: true,
            gifsicle: true,
            svgo: true
        }))
        .pipe(gulp.dest(DEST + 'res'));
});
