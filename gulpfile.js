
var gulp = require('gulp');
var minifyCss = require("gulp-minify-css");
var less = require("gulp-less");
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var rename = require("gulp-rename");
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var reload = require('gulp-livereload');

gulp.task('build', function () {
    return gulp.src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(uglify())
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task("less", function () {
    gulp.src(["src/less/*.less"])
        .pipe(less())
        .pipe(minifyCss({keepBreaks:false}))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest("dist/css"))
        .pipe(reload());
});

gulp.task("reload", function () {

    gulp.src("./index.html" )
        .pipe(reload());
    gulp.src("./tests/SpecRunner.html" )
        .pipe(reload());
});

gulp.task("watch", function () {
    reload.listen();
    gulp.watch('src/js/**/*.js', ["build", "reload"]);
    gulp.watch('src/less/*.less', ["less", "reload"]);
    gulp.watch('tests/spec/*.js', ["reload"]);
    gulp.watch("./index.html", ["reload"]);
    gulp.watch("tests/SpecRunner.html", ["reload"]);
});

gulp.task("default", function() {
    gulp.start(["build", "less", "watch"]);
});