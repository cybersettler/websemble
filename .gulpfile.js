var gulp = require('gulp'),
//    sass = require('gulp-ruby-sass'),
//    autoprefixer = require('gulp-autoprefixer'),
//    cssnano = require('gulp-cssnano'),
//    jshint = require('gulp-jshint'),
//    uglify = require('gulp-uglify'),
//    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    runSequence =  require( 'run-sequence' ),
//  browserSync from 'browser-sync';
// import swPrecache from 'sw-precache';
    gulpLoadPlugins = require( 'gulp-load-plugins' ),
// import {output as pagespeed} from 'psi';
    pkg = require('./package.json');
