var path = require('path');
var fs = require('fs');
var gulp = require('gulp');
var less = require('gulp-less');
var header = require('gulp-header');
var nano = require('gulp-cssnano');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var comments = require('postcss-discard-comments');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var pkg = require('./package.json');
var clean = require('gulp-clean');
var fileinclude  = require('gulp-file-include');
var px2rem = require('postcss-px2rem');
var yargs = require('yargs').options({
  w: {
    alias: 'watch',
    type: 'boolean'
  },
  s: {
    alias: 'server',
    type: 'boolean'
  },
  p: {
    alias: 'port',
    type: 'number'
  }
}).argv;

var option = { base: 'src' };
var dist = __dirname + '/dist';

gulp.task("clean", function(){
  return gulp.src(dist)
      .pipe(clean());
})

gulp.task('build:weui', function() {
  var banner = [
    '/*!',
    ' * WeUI v<%= pkg.version %> (<%= pkg.homepage %>)',
    ' * Copyright <%= new Date().getFullYear() %> Tencent, Inc.',
    ' * Licensed under the <%= pkg.license %> license',
    ' */',
    ''
  ].join('\n');
  gulp
    .src('src/weui/weui.less', option)
    .pipe(sourcemaps.init())
    .pipe(
      less().on('error', function(e) {
        console.error(e.message);
        this.emit('end');
      })
    )
    .pipe(postcss([autoprefixer(['iOS >= 7', 'Android >= 4.1']), comments()]))
    .pipe(header(banner, { pkg: pkg }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dist+'/assets'))
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
    .pipe(gulp.dest(dist+'/assets'));
});

gulp.task('build:pages:style', function() {
  var processors = [px2rem({remUnit: 75*2})];
  gulp
    .src('src/assets/css/**.less', option)
    .pipe(
      less().on('error', function(e) {
        console.error(e.message);
        this.emit('end');
      })
    )
    .pipe(postcss(processors))
    .pipe(postcss([autoprefixer(['iOS >= 7', 'Android >= 4.1'])]))
    .pipe(
      nano({
        zindex: false,
        autoprefixer: false
      })
    )
    .pipe(gulp.dest(dist));
});

gulp.task('build:pages:assets', function() {
  gulp
    .src('src/assets/**/*.?(png|jpg|gif|js|css)', option)
    .pipe(gulp.dest(dist))
});


gulp.task('build:pages:html', function() {
  gulp
    .src('src/pages/*.html', option)
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(dist))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('build:pages', [
  'build:pages:assets',
  'build:pages:style',
  'build:pages:html'
]);

gulp.task('release', ['build:weui', 'build:pages']);

gulp.task('watch', ['release'], function() {
  gulp.watch('src/weui/**/*', ['build:weui']);
  gulp.watch('src/assets/css/**/*.less', ['build:pages:style']);
  gulp.watch('src/assets/**/*.?(png|jpg|gif|js|css)', ['build:pages:assets']);
  gulp.watch('src/**/*.html', ['build:pages:html']);
});


gulp.task('server', function() {
  yargs.p = yargs.p || 8080;
  browserSync.init({
    server: {
      baseDir: './dist'
    },
    ui: {
      port: yargs.p + 1,
      weinre: {
        port: yargs.p + 2
      }
    },
    port: yargs.p,
    startPath: '/pages'
  });
});

// 参数说明
//  -w: 实时监听
//  -s: 启动服务器
//  -p: 服务器启动端口，默认8080
gulp.task('default', ['release'], function() {
  if (yargs.s) {
    gulp.start('server');
  }

  if (yargs.w) {
    gulp.start('watch');
  }
});
