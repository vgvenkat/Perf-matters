var gulp = require('gulp')
var ngrok = require('ngrok')
var psi = require('psi')
var sequence = require('run-sequence')
var connect = require('gulp-connect')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var cssnano = require('gulp-cssnano')
var del = require('del')
var pump = require('pump')
var minify = require('html-minifier').minify
var site = '',
  port = 3000
gulp.task('default', function () {
  console.log('just running gulp')
})
gulp.task('connect', function () {
  connect.server({
  	port: port
  	})
})
gulp.task('clean-dist', function () {
  return del(['dist/**'])
})
gulp.task('html-minify', function () {

})
gulp.task('css-min', function () {
  return gulp.src('css/*.css')
        .pipe(cssnano())
        .pipe(concat('main.css'))
        .pipe(gulp.dest('./dist'))
})
gulp.task('js-min', function (cb) {
  pump([
    gulp.src('js/*.js'),
    uglify(),
    concat('main.js'),
    gulp.dest('dist')
  ],
    cb
  )
})
gulp.task('folder-setup', function () {
  return sequence(
		'clean-dist',
		'css-min',
		'js-min'
		)
})
gulp.task('ngrok-url', function (cb) {
  return ngrok.connect(port, function (err, url) {
    site = url
    console.log('serving your tunnel from: ' + site)
    cb()
  })
})
gulp.task('psi-mobile', function () {
  return psi(site, {
        // key: key
    nokey: 'true',
    strategy: 'mobile'
  }).then(function (data) {
    console.log('Speed score: ' + data.ruleGroups.SPEED.score)
    console.log('Usability score: ' + data.ruleGroups.USABILITY.score)
  })
})

gulp.task('psi-desktop', function () {
  return psi(site, {
    nokey: 'true',
        // key: key,
    strategy: 'desktop'
  }).then(function (data) {
    console.log('Speed score: ' + data.ruleGroups.SPEED.score)
  })
})
gulp.task('psi-seq', function (cb) {
  return sequence(
  	'folder-setup',
  	'connect',
    'ngrok-url',
    'psi-desktop',
    'psi-mobile',
    cb
  )
})
gulp.task('psi', ['psi-seq'], function () {
  console.log('Woohoo! Check out your page speed scores!')
  process.exit()
})
