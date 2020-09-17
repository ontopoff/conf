'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');

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

gulp.task('default', gulp.series('sass', 'serve'));
