var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    chalk = require('chalk'),
    eslint = require('gulp-eslint'),
//    sass = require('gulp-ruby-sass'),
//    autoprefixer = require('gulp-autoprefixer'),
//    cssnano = require('gulp-cssnano'),
//    jshint = require('gulp-jshint'),
//    uglify = require('gulp-uglify'),
//    imagemin = require('gulp-imagemin'),
//    rename = require('gulp-rename'),
//    concat = require('gulp-concat'),
//    notify = require('gulp-notify'),
//    cache = require('gulp-cache'),
//    livereload = require('gulp-livereload'),
//    del = require('del'),
//    runSequence =  require( 'run-sequence' ),
//  browserSync from 'browser-sync';
// import swPrecache from 'sw-precache';
//    gulpLoadPlugins = require( 'gulp-load-plugins' ),
// import {output as pagespeed} from 'psi';
    pkg = require('./package.json');

gulp.task('default',['lint','test'],function() {
  console.log(chalk.green("Build successful"));
});

// Lint JavaScript
gulp.task('lint', function() {
  return gulp.src([
    './App.js',
    './index.js',
    './backend/**/*.js',
    './frontend/**/*.js',
    './util/**/*.js'
  ])
  // eslint() attaches the lint output to the "eslint" property
  // of the file object so it can be used by other modules.
  .pipe(eslint())
  // eslint.format() outputs the lint results to the console.
  // Alternatively use eslint.formatEach() (see Docs).
  .pipe(eslint.format())
  // To have the process exit with an error code (1) on
  // lint error, return the stream and pipe to failAfterError last.
  .pipe(eslint.failAfterError());
});

// Run JavaScript tests
gulp.task('test', function() {
  throw new Error("Gulp test not implemented");
});
