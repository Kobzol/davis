var gulp = require("gulp");
var less = require('gulp-less');
var plumber = require("gulp-plumber");
var rewriteCSS = require('gulp-rewrite-css');
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var htmlreplace = require("gulp-html-replace");
var SystemBuilder = require('systemjs-builder');
var del = require("del");

var buildDir = "dist";

gulp.task('build:less', function () {
  return gulp.src('static/**/*.less')
  .pipe(plumber())
  .pipe(less())
  .pipe(rewriteCSS({destination: buildDir}))
  .pipe(gulp.dest(buildDir));
});
gulp.task('build:system', function(done) {
  var builder = new SystemBuilder('', 'systemjs.config.js');
  builder.buildStatic('app/main', buildDir + '/app.min.js', {
    minify: true
  }).then(function() {
    done();
  });
});
gulp.task('build:vendor', function() {
  gulp.src([
    'node_modules/core-js/client/shim.min.js',
    'node_modules/zone.js/dist/zone.js',
    'node_modules/reflect-metadata/Reflect.js',
    'node_modules/systemjs/dist/system.src.js'
  ])
  .pipe(concat('vendors.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest(buildDir));
});
gulp.task('build:html', function() {
  gulp.src('index.html')
  .pipe(htmlreplace({
    'vendor': 'vendors.min.js',
    'app': 'app.min.js',
    'less': 'style/style.css'
  }))
  .pipe(gulp.dest(buildDir));

  gulp.src('app/**/*.html')
  .pipe(gulp.dest(buildDir + '/app'));
});
gulp.task('build:assets', function() {
  gulp.src('static/img/**/**')
  .pipe(gulp.dest(buildDir + "/static/img"));

  gulp.src("mode-assembly_x86.js")
  .pipe(uglify())
  .pipe(gulp.dest(buildDir));
});

gulp.task('build', ['build:system', 'build:vendor', 'build:html', 'build:less', 'build:assets']);
gulp.task('clean', function() {
  return del([
     buildDir
  ]);
});
gulp.task('watch', ['build:less'], function ()
{
  gulp.watch('static/**/*.less', ["less"]);
});
