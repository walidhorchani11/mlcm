'use strict';

const gulp                  = require('gulp');
const gulputil              = require('gulp-util');
const runSequence           = require('run-sequence');
const autoprefixer          = require('gulp-autoprefixer');
const cleancss              = require('gulp-clean-css');
const minifyCss             = require('gulp-minify-css');
const concat                = require('gulp-concat');
const sass                  = require('gulp-sass');
const uglify                = require('gulp-uglify');
const uglifyjs              = require('gulp-uglifyjs');
const watch                 = require('gulp-watch');
const webserver             = require('gulp-webserver');
const webpackStream         = require('webpack-stream');
const webpack2              = require('webpack');
const webpackConfig         = require('./webpack.config');
const webpackProdConfig     = require('./webpack-server.config.js');
const named                 = require('vinyl-named');
const del                   = require('del');
const minifiedFiles         = require('./minified-files');
const env                   = process.env.NODE_ENV || 'development';

gulp.task('start', () => {
    return gulputil.log('Local webpack');
});

gulp.task('start-prod', () => {
    return gulputil.log('Production webpack');
});

gulp.task('clean', () => {
    return del([ './web/js/build/*.*', './web/js/build/css/*.css', './web/reveal/build/*.js' ]);
});

gulp.task('UglifyJS-pdf-text-vertical', () => {
    return gulp.src('./web/reveal/vertical-text.js')
        .pipe(uglifyjs('pdf-text-vertical.js'))
        .pipe(gulp.dest('./web/reveal/build'));
});

gulp.task('UglifyJS-pdf-plugins', () => {
    return gulp.src('./web/reveal/tender.js')
        .pipe(uglifyjs('pdf-plugins.js'))
        .pipe(gulp.dest('./web/reveal/build'));
});

gulp.task('UglifyJS-pdf', () => {
    return gulp.src([ './web/reveal/sLConfig.js', './web/reveal/revealConfig.js', './web/reveal/removeWaste.js' ])
        .pipe(uglifyjs('pdf-actions.js'))
        .pipe(gulp.dest('./web/reveal/build'));
});

gulp.task('concat-css', () => {
    return gulp.src(minifiedFiles.minifiedCssFilesList)
        .pipe(concat('main.css'))
        .pipe(gulp.dest('./web/js/build/css/'));
});

gulp.task('autoprefixer', () => {
    gulp.src('./web/js/build/css/main.css')
    .pipe(autoprefixer({
        browsers : [ 'last 2 versions' ],
        cascade  : false
    }))
    .pipe(gulp.dest('./web/js/build/css/'));
});

gulp.task('minify-css', () => {
    return gulp.src('./web/js/build/css/main.css')
        .pipe(cleancss({ compatibility : 'ie8' }))
        .pipe(gulp.dest('./web/js/build/css/'));
});

gulp.task('watch-css', () => {
    return gulp.watch(minifiedFiles.minifiedCssFilesList, [ 'css-task' ]);
});

gulp.task('webpack', () => {
    return gulp.src(minifiedFiles.minifiedJsFilesList)
        .pipe(named())
        .pipe(webpackStream(webpackConfig, webpack2))
        .pipe(gulp.dest('./web/js/build/'));
});

gulp.task('webpack-prod', () => {
    return gulp.src(minifiedFiles.minifiedJsFilesList)
        .pipe(named())
        .pipe(webpackStream(webpackProdConfig, webpack2))
        .pipe(gulp.dest('./web/js/build/'));
});

gulp.task('exit-webpack', () => {
    process.exit(0);
});


gulp.task('css-task', (done) => {
    runSequence(
        'concat-css',
        'autoprefixer',
        'minify-css',
        done
    );
});

gulp.task('default', (done) => {
    runSequence(
        [ 'start', 'clean' ],
        'css-task',
        'UglifyJS-pdf-text-vertical',
        [ 'UglifyJS-pdf-plugins', 'UglifyJS-pdf' ],
        'watch-css',
        'webpack',
        done
    );
});

gulp.task('prod', (done) => {
    runSequence(
        [ 'start-prod', 'clean' ],
        'css-task',
        'UglifyJS-pdf-text-vertical',
        [ 'UglifyJS-pdf-plugins', 'UglifyJS-pdf' ],
        'webpack-prod',
        'exit-webpack',
        done
    );
});
