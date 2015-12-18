var gulp     = require('gulp'),
    watchify = require('watchify'),
    babel    = require('gulp-babel');

gulp.task('babel', function() {
  gulp.src('./es6/*.js')
    .pipe(babel())
    .pipe(gulp.dest('./scripts/'))
});

gulp.task('watch', function() {
  gulp.watch('./es6/*.js', ['babel'])
});

gulp.task('default', ['babel', 'watch']);
