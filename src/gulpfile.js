var gulp = require('gulp');
var sass = require('gulp-sass');
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var pkg = require('./package.json');
var browserSync = require('browser-sync').create();

// Set the banner content
var banner = ['/*!\n',
  ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
  ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
  ' * Licensed under <%= pkg.license %> (https://github.com/BlackrockDigital/<%= pkg.name %>/blob/master/LICENSE)\n',
  ' */\n',
  ''
].join('');

// Copy third party libraries from /node_modules into /vendor
gulp.task('vendor', function(done) {

  // Bootstrap
  gulp.src([
      './node_modules/bootstrap/dist/**/*',
      '!./node_modules/bootstrap/dist/css/bootstrap-grid*',
      '!./node_modules/bootstrap/dist/css/bootstrap-reboot*'
    ])
    .pipe(gulp.dest('./vendor/bootstrap'));

  // Font Awesome
  gulp.src([
      './node_modules/font-awesome/**/*',
      '!./node_modules/font-awesome/{less,less/*}',
      '!./node_modules/font-awesome/{scss,scss/*}',
      '!./node_modules/font-awesome/.*',
      '!./node_modules/font-awesome/*.{txt,json,md}'
    ])
    .pipe(gulp.dest('./vendor/font-awesome'));

  // jQuery
  gulp.src([
      './node_modules/jquery/dist/*',
      '!./node_modules/jquery/dist/core.js'
    ])
    .pipe(gulp.dest('./vendor/jquery'));

  // jQuery Easing
  gulp.src([
      './node_modules/jquery.easing/*.js'
    ])
    .pipe(gulp.dest('./vendor/jquery-easing'));

  done();
});

// Compile SCSS
gulp.task('css:compile', function() {
  return gulp.src('./scss/**/*.scss')
    .pipe(sass.sync({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

// Minify CSS
gulp.task('css:minify', gulp.series('css:compile', function() {
  return gulp.src([
      './css/*.css',
      '!./css/*.min.css'
    ])
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream());
}));

// Main CSS task
gulp.task('css', gulp.series('css:compile', 'css:minify'));

// Minify JavaScript
gulp.task('js:minify', function() {
  return gulp.src([
      './js/*.js',
      '!./js/*.min.js'
    ])
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./js'))
    .pipe(browserSync.stream());
});

// Main JS task
gulp.task('js', gulp.series('js:minify'));

// Default task
gulp.task('default', gulp.series('css', 'js', 'vendor', function(done){
  done();
}));

// Configure the browserSync task
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
});

// Dev task
gulp.task('dev', gulp.series('css', 'js', 'browserSync', function() {
  gulp.watch('./css/*.css', ['css']);
  gulp.watch('./scss/*.scss', ['css']);
  gulp.watch('./js/*.js', ['js']);
  gulp.watch('./*.html', browserSync.reload);
}));

// Build for production
gulp.task('build', gulp.series('default', function(done)
{
  //Index
  gulp.src([
    './index.html'
  ])
  .pipe(gulp.dest('../'));

  // Bootstrap
  gulp.src([
    './vendor/bootstrap/css/bootstrap.min.css',
    './vendor/bootstrap/css/bootstrap.min.css.map'
  ])
  .pipe(gulp.dest('../vendor/bootstrap/css/'));

  // Font Awesome
  gulp.src([
    './vendor/font-awesome/css/font-awesome.min.css',
    './vendor/font-awesome/css/font-awesome.css.map'
  ])
  .pipe(gulp.dest('../vendor/font-awesome/css/'));

  // Font Awesome fonts
  gulp.src([
    './vendor/font-awesome/fonts/*.*'
  ])
  .pipe(gulp.dest('../vendor/font-awesome/fonts/'));

  // Custom CSS
  gulp.src([
    './css/custom.min.css',
    './css/theme.min.css'
  ])
  .pipe(gulp.dest('../css/'));

  // Bootstrap core JavaScript
  gulp.src([
    './vendor/jquery/jquery.min.js'
  ])
  .pipe(gulp.dest('../vendor/jquery/'));

  gulp.src([
    './vendor/bootstrap/js/bootstrap.bundle.min.js'
  ])
  .pipe(gulp.dest('../vendor/bootstrap/js/'));

  // Plugin JavaScript
  gulp.src([
    './vendor/jquery-easing/jquery.easing.min.js'
  ])
  .pipe(gulp.dest('../vendor/jquery-easing/'));

  // Contact form JavaScript
  gulp.src([
    './js/jqBootstrapValidation.min.js',
  ])
  .pipe(gulp.dest('../js/'));

  // Custom Javascript
  gulp.src([
    './js/theme.min.js',
  ])
  .pipe(gulp.dest('../js'));

  // Portfolio images
  gulp.src([
    './img/portfolio/*.*',
  ])
  .pipe(gulp.dest('../img/portfolio/'));

  // Site images
  gulp.src([
    './img/*.*',
  ])
  .pipe(gulp.dest('../img/'));

  done();
}));
