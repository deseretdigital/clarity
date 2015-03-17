var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('mocha', function () {
  gulp.src('./tests/**/*.js')
    .pipe(mocha({ reporter: 'dot', ui: 'tdd' }));
});