var gulp = require('gulp');
var webpack = require('../util/webpack');

gulp.task('watch', ['watch-js', 'watch-css'], function() {
    return webpack({ watch: true });
});
