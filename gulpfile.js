
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var reload = require('gulp-livereload');

gulp.task('build', function () {
    return gulp.src('src/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});

gulp.task("reload", function () {

    gulp.src("./index.html" )
        .pipe(reload());
});

gulp.task("watch", function () {
    reload.listen();
    gulp.watch('src/**/*.js', ["build", "reload"]);
    gulp.watch("./index.html", ["reload"]);
});

gulp.task("default", function() {
    gulp.start(["build", "watch"]);
});