var gulp = require('gulp');
var sass = require('gulp-sass');
var util = require('gulp-util');

gulp.task('build-css', function() {

    return gulp.src('./style/app.scss')
        .pipe(sass({
            errLogToConsole: true,
            onSuccess: function() {
                util.log('Successfully built',util.colors.green('app.css'));
            }
        }))
        .pipe(gulp.dest('./dist'));
});
