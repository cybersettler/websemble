var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    chalk = require('chalk'),
    eslint = require('gulp-eslint'),
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
