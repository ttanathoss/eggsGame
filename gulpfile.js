var del = require('del'),
    gulp = require('gulp'),
    less = require('gulp-less'),
    gutil = require('gulp-util'),
    path = require('path'),
    ftp = require('vinyl-ftp');

gulp.task('clean', function() {
  return del(['*.css']);
});

gulp.task('less', function () {
  return gulp.src('./eggs.less')
         .pipe(less({
           paths: [ path.join(__dirname, 'less', 'includes') ]
         }))
         .pipe(gulp.dest('.'));
});

gulp.task('upload', ['less'], function () {
  var conn = ftp.create({
    host:     '',
    user:     '',
    password: '',
    parallel: 5,
    log:      gutil.log
  });
  var globs = [
    '*.css',
    'js/**',
    'img/**',
    'images/**',
    '*.html',
    '*.php'
  ];
  return gulp.src(globs, { base: '.', buffer: false })
         .pipe(conn.newer('/domains/ttss.stronazen.pl/public_html/jsGame')) // only upload newer files
         .pipe(conn.dest('/domains/ttss.stronazen.pl/public_html/jsGame'));
});

gulp.task('watch', function () {
  gulp.watch('./*.less', ['clean' ,'less', 'upload']);
  gulp.watch('./*.html', ['upload']);
  gulp.watch('./*.php', ['upload']);
  gulp.watch('./js/*.*', ['upload']);
  gulp.watch('./img/*.*', ['upload']);
});
