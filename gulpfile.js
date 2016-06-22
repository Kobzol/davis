var gulp = require("gulp");
var less = require('gulp-less');
var plumber = require("gulp-plumber");
var rewriteCSS = require('gulp-rewrite-css');

gulp.task('less', function () {
    return gulp.src('static/**/*.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(rewriteCSS({destination: "build/css/style"}))
        .pipe(gulp.dest('./build/css'));
});

gulp.task('watch', ["less"], function ()
{
    gulp.watch('static/**/*.less', ["less"]);
});
