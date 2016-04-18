'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var image = require('gulp-image');
var cache = require('gulp-cache');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var replace = require('gulp-replace');
var jeditor = require("gulp-json-editor");
var debug = require('gulp-debug');
var del = require('del');
var config = require('./project.json');

var DEST = 'publish/html5-test/';

var VERSION = "0.0.6.1";

var sourceCodeList = [];

gulp.task('default', ['compileJs', 'copyIndex', 'copyConf', 'image'], function () {
});

gulp.task('clean', function () {
    return del(['publish']);
});

gulp.task('compileJs', ['clean'], function () {
    sourceCodeList.push('lib/cocos2d-js-v3.10.js');
    sourceCodeList = sourceCodeList.concat(config.jsList);
    sourceCodeList.push('main.js');

    return gulp.src(sourceCodeList)
        .pipe(debug({title: 'src:'}))
        .pipe(sourcemaps.init())
        .pipe(concat('game.js'))
        .pipe(gulp.dest(DEST))
        .pipe(uglify())
        .pipe(rename('game.min.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(DEST));
});

gulp.task('copyIndex', ['clean'], function () {
    return gulp.src('index.html')
        .pipe(replace('指尖骑士挂机版', '指尖骑士挂机版' + VERSION))
        .pipe(replace('frameworks/cocos2d-html5/CCBoot.js', 'game.min.js'))
        .pipe(replace('<script cocos src="main.js"></script>', ''))
        .pipe(gulp.dest(DEST));
});

gulp.task('copyConf', ['clean'], function () {
    return gulp.src("project.json")
        .pipe(jeditor(function (json) {
            json.version = VERSION;
            json.debugMode = 1;
            json.frameRate = 60;
            json.id = 'gameCanvas';
            json.renderMode = 0;
            json.project_type = "javascript";
            json.jsList = [];
            json.showFPS = true;
            json.noCache = false;
            json.modules = undefined;
            json.engineDir = undefined;
            return json; // must return JSON object.
        }))
        .pipe(gulp.dest(DEST));
});

gulp.task('image', ['clean'], function () {
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
