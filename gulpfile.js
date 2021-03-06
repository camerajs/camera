'use strict';

var gulp = require('gulp');
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify"); //Browserify plugin for compiling Typescript
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var minify = require('gulp-minify');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');

gulp.task('build', ['sass'], function () {
    browserify({
        basedir: '.',
        standalone: 'camera',
        debug: true,
        entries: ['src/camera.ts'],
        cache: {},
        packageCache: {},
    })
        .plugin("tsify", {noImplicitAny: true})
        .transform('babelify', {
            presets: ['es2015'],
            extensions: ['.ts']
        })
        .bundle()
        .pipe(source('camera.js'))
        .pipe(buffer())

        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest("dist"));


    gulp.src('dist/camera.js')
        .pipe(minify({
            ext: {
                src: '.js',
                min: '.min.js'
            },
            exclude: ['tasks'],
            ignoreFiles: ['.combo.js', '-min.js']
        }))
        .pipe(gulp.dest('dist'));
});


gulp.task('sass', function () {
    return gulp.src('src/sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist'));
});