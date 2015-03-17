var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');

gulp.task('watch-css', ['build-css'], function() {
    return gulp.watch('./style/**/*.scss', ['build-css']);
});
