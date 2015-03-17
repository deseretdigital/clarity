var gulp = require('gulp');
var webpack = require('../util/webpack');

gulp.task('watch-js', ['build-js'], function() {
    return webpack({ watch: true });
});
