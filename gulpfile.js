var gulp = require('gulp')
var ngrok = require('ngrok')
var sequence = require('run-sequence')
var connect = require('gulp-connect')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var cssnano = require('gulp-cssnano')
var cleanCSS = require('gulp-clean-css');
var del = require('del')
var inlineCss = require('gulp-inline-css')
var minify = require('gulp-htmlmin')
var gulpif = require('gulp-if')
var imagemin = require('gulp-imagemin');
var critical = require('critical').stream;
var useref = require('gulp-useref');
var imageResize = require('gulp-image-resize')
var rename = require("gulp-rename");
var inline = require('gulp-inline')
var site = '',
  port = 3000
gulp.task('default', function () {
  console.log('just running gulp')
})
gulp.task('serve', function () {
  connect.server({
  	port: port
  	})
})
gulp.task('serve:dist',['build'], function () {
  connect.server({
  	port: port,
    root:'dist'
  	})
})
gulp.task('clean-dist', function () {
  return del(['dist/**'])
})
gulp.task('build', function(){
   return sequence(
		'clean-dist',
    'html',
    'ngrok-url'
		)
})
gulp.task('critical-stream', function(){
  return gulp.src('dist/**.html')
          .pipe(critical({
            base:'dist/',
            inline:true,
             minify: true,
            extract:true,
            css:['dist/main.css'],
            
          }))
          .pipe(gulp.dest('dist'))
})
gulp.task('critical-views-stream', function(){
  return gulp.src('dist/views/**.html')
          .pipe(critical({
            inline: true,
            base: 'dist/views',
            css: ['dist/views/view.css'],
            minify: true,
            extract:true,
            dest: 'pizza-critical.html',
            width: 320,
            height: 480
          }))
          .pipe(gulp.dest('dist'))
})

gulp.task('html', function(){
   return sequence(
     'html-min',
     'views',
     'imageResize',
     'views-img',
   
    'views-html',
    'html-inlineCss'
     
   )
})
gulp.task('html-inlineCss', function () {
  return gulp.src('dist/**.html')
        .pipe(gulpif('*.html',minify({
          collapseWhitespace: true,
          removeComments: true
        })))
        .pipe(inline({
            base: 'dist/',
            disabledTypes: ['svg', 'img', 'js'], // Only inline css files 
          }))
        .pipe(gulp.dest('dist'))
})


gulp.task('html-min', function () {
  return gulp.src('./**.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', cleanCSS({
          level:2
        })))
        .pipe(gulp.dest('dist'))
})
gulp.task('views-html', function () {
  return gulp.src('dist/views/**.html')
        .pipe(gulpif('*.html',minify({collapseWhitespace: true, removeComments: true})))
        .pipe(gulp.dest('dist/views'))
})
gulp.task('views', function(){
  return gulp.src('./views/**.html')
          .pipe(useref())
          .pipe(gulpif('*.js', uglify()))
          .pipe(gulpif('*.css', cleanCSS({
          level:2
        })))
          
          .pipe(gulp.dest('dist/views'))
})

gulp.task('views-img',function(){
  return gulp.src('./views/images/*.{jpg,png}')
          .pipe(imageResize({
             
              quality: 0.20,
              height: 800
        }))
        .pipe(gulp.dest('dist/views/images'));
})
gulp.task('imageResize', function(){
  return gulp.src('./img/*.{jpg,png}')
        .pipe(imageResize({
          
          format:"jpg",
          quality: 0.20,
          height: 800
        }))
      .pipe(gulp.dest('dist/img'));
})
gulp.task('mobiledev-resize', function(){
  return gulp.src('./img/mobilewebdev.jpg')
          .pipe(imageResize({
              width : 602,
              height : 306,
              crop : true,
              upscale : false
            }))
    .pipe(gulp.dest('./img'))
  
})
gulp.task('pizzeria-resize', function () {
  gulp.src('views/images/pizzeria.jpg')
    .pipe(imageResize({
      width : 100,
      height : 61,
      crop : true,
      upscale : false
    }))
    .pipe(rename(function (path) { path.basename += "-thumbnail"; }))
    .pipe(gulp.dest('./views/images'));
});
gulp.task('pizzeria-resize-big', function () {
  gulp.src('views/images/pizzeria.jpg')
    .pipe(imageResize({
      width : 720,
      height : 540,
      crop : true,
      upscale : false
    }))
    .pipe(rename(function (path) { path.basename += "-big"; }))
    .pipe(gulp.dest('./views/images'));
});
gulp.task('image-min', function(){
  return gulp.src('./img/*.{jpg,png}')
        .pipe(imagemin([
            imagemin.gifsicle(),
            imagemin.jpegtran({ progressive: true }),
            imagemin.optipng(),
            imagemin.svgo()
        ]))
        .pipe(gulp.dest('dist/img'))
})


gulp.task('ngrok-url', function (cb) {
  return ngrok.connect(port, function (err, url) {
    site = url
    console.log('serving your tunnel from: ' + site)
    cb()
  })
})

