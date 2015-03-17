var gulp = require('gulp');

gulp.task('build-static', function(){
    gulp.src(['./static/**/*'])
        .pipe(gulp.dest('./dist'));
});
