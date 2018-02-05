var path = require('path');
var gulp = require('gulp');
var less = require('gulp-less');
var nano = require('gulp-cssnano');
var postcss = require('gulp-postcss');
var rename = require('gulp-rename');
var autoprefixer = require('autoprefixer');
var comments = require('postcss-discard-comments');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('js', function (cb) {
    gulp.src([
            '../src/jquery-weui/js/jquery-extend.js',
            '../src/jquery-weui/js/template7.js',
            '../src/jquery-weui/js/hammer.js',
            '../src/jquery-weui/js/modal.js',
            '../src/jquery-weui/js/toast.js',
            '../src/jquery-weui/js/action.js',
            '../src/jquery-weui/js/pull-to-refresh.js',
            '../src/jquery-weui/js/infinite.js',
            '../src/jquery-weui/js/tab.js',
            '../src/jquery-weui/js/search-bar.js',
            '../src/jquery-weui/js/device.js',
            '../src/jquery-weui/js/picker.js',
            '../src/jquery-weui/js/select.js',
            '../src/jquery-weui/js/calendar.js',
            '../src/jquery-weui/js/datetime-picker.js',
            '../src/jquery-weui/js/city-data.js',
            '../src/jquery-weui/js/city-picker.js',
            '../src/jquery-weui/js/popup.js',
            '../src/jquery-weui/js/notification.js',
            '../src/jquery-weui/js/toptip.js',
            '../src/jquery-weui/js/slider.js'
        ])
        .pipe(concat({
            path: 'jquery-weui.js'
        }))
        .pipe(gulp.dest('../src/assets/js'))

});

gulp.task('style', function() {
    gulp
      .src('../src/jquery-weui/less/jquery-weui.less')
      .pipe(sourcemaps.init())
      .pipe(
        less().on('error', function(e) {
          console.error(e.message);
          this.emit('end');
        })
      )
      .pipe(postcss([autoprefixer(['iOS >= 7', 'Android >= 4.1']), comments()]))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('../dist/assets/css'))
      .pipe(browserSync.reload({ stream: true }))
      .pipe(
        nano({
          zindex: false,
          autoprefixer: false
        })
      )
      .pipe(
        rename(function(path) {
          path.basename += '.min';
        })
      )
      .pipe(gulp.dest('../dist/assets/css'));
  });
  

gulp.task('watch', function() {
    gulp.watch('../src/jquery-weui/js/**/*.js', ['js']);
});

gulp.task("default", ['watch','js']);
