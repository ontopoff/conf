'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var del = require('del');
var imagemin = require('gulp-imagemin');
var uglify = require('gulp-uglify');
var usemin = require('gulp-usemin');
var rev = require('gulp-rev');
var cleanCss = require('gulp-clean-css');
var flatmap = require('gulp-flatmap');
var htmlmin = require('gulp-htmlmin');

gulp.task('sass', function(done) {
    gulp.src("./css/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("./css"))
        .pipe(browserSync.stream());

    done();
});

gulp.task('serve', function(done) {

    browserSync.init({
        server: "./"
    });

    gulp.watch("./css/*.scss", gulp.series('sass'));
    gulp.watch("./*.html").on('change', () => {
        browserSync.reload();
        done();
    });
    gulp.watch("./js/*.js").on('change', () => {
        browserSync.reload();
        done();
    });
    gulp.watch("./img/*.{jpg,png,gif}").on('change', () => {
        browserSync.reload();
        done();
    });

    done();
});

gulp.task('clean', function (){
    return del(['dist']);
});

gulp.task('imagemin', function (){
    return gulp.src('img/*.{png,jpg,gif}')
        .pipe(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('./dist/img'));
});

gulp.task('copyfonts', function (done){
    gulp.src('./node_modules/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
        .pipe(gulp.dest('./dist/fonts'));
    done();
});

gulp.task('usemin', function (){
    return gulp.src('./*.html')
        .pipe(flatmap(function (stream, file) {
            return stream
                .pipe(usemin({
                    css: [rev()],
                    html: [function (){
                        return htmlmin({
                            collapseWhitespace: true
                        })
                    }],
                    js: [uglify(), rev()],
                    inlinejs: [uglify()],
                    inlinecss: [cleanCss(), 'concat']
                }))
        }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('default', gulp.series('sass', 'serve'));
gulp.task('build', gulp.series('clean', 'imagemin', 'copyfonts', 'usemin'));
