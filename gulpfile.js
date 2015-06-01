var gulp = require('gulp');
var electron = require('gulp-atom-electron');
var electronDownloader = require('gulp-electron-downloader');
var gutil = require('gulp-util');
var replace = require('gulp-replace');
var merge = require('merge-stream');
var package = require('./package.json');

gulp.task('download-electron', function(cb){
  electronDownloader(cb);
});

gulp.task('generate-packagejson', function() {
  var src = require('stream').Readable({ objectMode: true })
  src._read = function () {
    this.push(new gutil.File({
      cwd: "",
      base: "",
      path: "package.json",
      contents: new Buffer(JSON.stringify({
        name: package.name,
        version: package.napa && package.napa.bibi && package.napa.bibi.replace(/satorumurmur\/bibi#v/, ""),
        main: "main.js"
      }))
    }))
    this.push(null)
  }
  return src.pipe(gulp.dest("app"));
});

gulp.task('copy', function() {
  var text = gulp.src(["main.js", "node_modules/bibi/bib/**/*.{js,html,css,json,md}"])
    .pipe(replace(new RegExp('"\\.\\./\\.\\./bib/i/(res/images/bibi-logo\\.png)"'), '"$1"'))
    .pipe(gulp.dest("app"));
  var blob = gulp.src("node_modules/bibi/bib/**/*.{eot,png,svg,ttf,woff}")
    .pipe(gulp.dest("app"));

  return merge(text, blob);
});

gulp.task('package', ['generate-packagejson', 'copy'], function() {
  return gulp.src("target/app/**")
    .pipe(electron({
      version: '0.27.1',
      platform: 'win32',
      arch: 'x64'
    }))
    .pipe(electron.zfsdest(package.name + '-win32-x64.zip'));
});
