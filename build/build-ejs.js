var gulp = require('gulp');
var ejs = require("gulp-ejs");

gulp.task('ejs', function() {
    return gulp.src(["../src/demos/*.html", "!../src/demos/_*.html"])
        .pipe(ejs({}))
        .pipe(gulp.dest("../dist/demos/"));
});

gulp.task('copy', function() {

    gulp.src(['../src/demos/images/*.*'])
        .pipe(gulp.dest('../dist/demos/images/'));

    gulp.src(['../src/demos/css/*.css'])
        .pipe(gulp.dest('../dist/demos/css/'));
});

gulp.task('watch', function() {
    gulp.watch('../src/demos/*.html', ['ejs']);
});

gulp.task("default", ['watch','ejs','copy']);