const gulp = require('gulp');
const mocha = require('gulp-mocha');
const chalk = require('chalk');
const eslint = require('gulp-eslint');
const conventionalChangelog = require('gulp-conventional-changelog');
const conventionalGithubReleaser = require('conventional-github-releaser');
const bump = require('gulp-bump');
const gutil = require('gulp-util');
const git = require('gulp-git');
const fs = require('fs');
const parseArgs = require('minimist');

// Lint JavaScript
gulp.task('lint', function(done) {
  return gulp.src([
    './ElectronApp.js',
    './index.js',
    './backend/**/*.js',
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
    .pipe(eslint.failAfterError())
    .on('end', () => done());
});

// Run JavaScript tests
gulp.task('test', function(done) {
  return gulp.src(['test/**/*Test.js'], {read: false})
    .pipe(mocha())
    .on('end', () => done());
});

gulp.task('default', gulp.series('lint', 'test'), function(done) {
  console.log(chalk.green("Build successful"));
  done();
});

gulp.task('changelog', function(done) {
  return gulp.src('CHANGELOG.md', {
    buffer: false
  })
    .pipe(conventionalChangelog({
      preset: 'angular', // Or to any other commit message convention you use.
      releaseCount: 0
    }))
    .pipe(gulp.dest('./'))
    .on('end', () => done());
});

gulp.task('github-release', function(done) {
  const local = JSON.parse(fs.readFileSync('./local.json', 'utf8'));
  conventionalGithubReleaser({
    type: "oauth",
    token: local.oauth.token // change this to your own GitHub token or use an environment variable
  }, {
    preset: 'angular' // Or to any other commit message convention you use.
  }, done);
});

gulp.task('bump-version', function(done) {
// We hardcode the version change type to 'patch' but it may be a good idea to
// use minimist (https://www.npmjs.com/package/minimist) to determine with a
// command argument whether you are doing a 'major', 'minor' or a 'patch' change.
  var argv = parseArgs(process.argv.slice(2));
  var versionType = argv.version || "patch";
  return gulp.src(['./package.json'])
    .pipe(bump({type: versionType}).on('error', gutil.log))
    .pipe(gulp.dest('./'))
    .on('end', () => done());
});

gulp.task('commit-changes', function(done) {
  return gulp.src('.')
    .pipe(git.add())
    .pipe(git.commit('[Prerelease] Bumped version number'))
    .on('end', () => done());
});

gulp.task('push-changes', function(cb) {
  git.push('origin', 'master', cb);
});

gulp.task('create-new-tag', function(cb) {
  var version = getPackageJsonVersion();
  git.tag(version, 'Created Tag for version: ' + version, function(error) {
    if (error) {
      return cb(error);
    }
    git.push('origin', 'master', {args: '--tags'}, cb);
  });

  function getPackageJsonVersion() {
    // We parse the json file instead of using require because require caches
    // multiple calls so the version number won't be updated
    return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
  }
});

gulp.task('release', gulp.series(
  'bump-version',
  'changelog',
  'commit-changes',
  'push-changes',
  'create-new-tag',
  'github-release'), (done) => {
    console.log('RELEASE FINISHED SUCCESSFULLY');
    done();
});
