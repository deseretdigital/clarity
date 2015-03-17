var gulp = require('gulp');
var webpack = require('../util/webpack');

gulp.task('build', ['build-js', 'build-css', 'build-static']);
