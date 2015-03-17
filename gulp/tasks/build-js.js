var gulp = require('gulp');
var webpack = require('../util/webpack');

gulp.task('build-js', function() {
    return webpack({ watch: false });
});
