var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var gulpif = require('gulp-if');
var minifyCSS = require('gulp-minify-css');
var csscomb = require('gulp-csscomb');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var prettify = require('gulp-jsbeautifier');
var clean = require('gulp-clean');
var rigger = require('gulp-rigger');
var browserSync = require('browser-sync');
var bsReload = browserSync.reload;
var useref = require('gulp-useref');
var wiredep = require('wiredep').stream;
var psi = require('psi');
var sftp = require('gulp-sftp');


// ======== APP ==========================================================================================================

// =========== html:app ================
gulp.task('html:app', function(){
	return gulp.src('app/template-modules/*.html')
	.pipe(rigger())
	.pipe(prettify())
	.pipe(gulp.dest('app/'))
	.pipe(bsReload({stream:true}));
});
// =========== END:html:app ================

// =========== scss:app ================
gulp.task('scss:app', function() {
	return gulp.src('app/scss/*.scss')
	.pipe(sourcemaps.init())
	.pipe(sass().on('error', sass.logError))
	.pipe(autoprefixer({
		browsers: ['last 5 versions', '>0%', 'ie 7'],
		cascade: false
	}))
	.pipe(csscomb())
	.pipe(prettify())
	.pipe(sourcemaps.write(
		'../scss/sourcemaps'
	))
	.pipe(gulp.dest('app/css'));
});
// =========== END:scss:app ================

// =========== js:app ================
gulp.task('js:app', function(){
	return gulp.src('app/js/js-modules/*.js')
	.pipe(rigger())
	.pipe(gulp.dest('app/js'))
	.pipe(bsReload({stream:true}));
});
// =========== END:js:app ================

// ===========:bower:app ================
gulp.task('bower', function () {
    gulp.src('app/template-modules/template-assets/**/*.html')
      .pipe(wiredep({
        'ignorePath': '../',
        directory : "app/bower_components",
        packages:
          {
            js: [ 'bower_components/' ],
            css: [ 'bower_components/' ]
          }
      }))
      .pipe(gulp.dest('app/template-modules/template-assets/'))
      .pipe(bsReload({stream:true}));
  });
// ===========:END:bower:app ================

// ======== END:APP ==========================================================================================================



// ======== DIST ==========================================================================================================

// =========== clean:dist ================
gulp.task('clean:dist', function(){
	return gulp.src('dist/')
	.pipe(clean());
});
// =========== END:clean:dist ================

// =========== html:dist ================
gulp.task('html:dist', function(){
	return gulp.src('app/*.html')
	.pipe(prettify())
	.pipe(useref())
	.pipe(gulp.dest('dist/'));
});
// =========== END:html:dist ================

// =========== css:dist ================
gulp.task('css:dist', function(){
	return gulp.src('app/*.css')
	.pipe(prettify())
	.pipe(gulp.dest('dist/css'));
});

gulp.task('cssMinify:dist', function(){
	return gulp.src('dist/css/**/*.css')
	.pipe(minifyCSS())
	.pipe(gulp.dest('dist/css'));
});
// =========== END:css:dist ================

// =========== js:dist ================
gulp.task('js:dist', function(){
	return gulp.src('app/*.js')
	.pipe(prettify())
	.pipe(gulp.dest('dist/js'));
});

gulp.task('jsUglify:dist', function(){
	return gulp.src('dist/js/**/*.js')
	.pipe(uglify({
		mangle: false
	}))
	.pipe(gulp.dest('dist/js'));
});
// =========== END:js:dist ================

// =========== img:dist ================
gulp.task('img:dist', function(){
	gulp.src('app/img/**/*')
	.pipe(gulp.dest('dist/img/'));
});
// =========== END:img:dist ================

// =========== fonts:dist ================
gulp.task('fonts:dist', function(){
	gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts/'));
});
// =========== END:fonts:dist ================

// =========== DIST ============================================================================
gulp.task('dist', function(){
	gulp.start('clean:dist');
	gulp.start('html:dist');
	gulp.start('css:dist');
	gulp.start('js:dist');
	gulp.start('img:dist');
	gulp.start('fonts:dist');
});
// =========== END:DIST ============================================================================

// ======== browserSync ===================
gulp.task('browserSync', function() {
	browserSync({
		server: {
			baseDir: './app'
		},
		port: 3000,
		open: true,
		browser: 'default',
		startPath: '/',
		notify: false,
	});
});
// ======== END:browserSync ===================


// ======== sftp ===================
gulp.task('sftp', function () {
   return gulp.src('dist/')
   .pipe(sftp({
      host: 'mashina.ftp.ukraine.com.ua',
      user: 'mashina_artururian',
      pass: '3ck61o4j',
      port: 21,
      remotePath: '/apple/gulp-test/'
   }));
});
// ======== END:sftp ===================


// ======== psi ===============================
// get the PageSpeed Insights report
psi('theverge.com').then(data => {
  console.log(data.ruleGroups.SPEED.score);
  console.log(data.pageStats);
});

// output a formatted report to the terminal
psi.output('theverge.com').then(() => {
  console.log('done');
});

// Supply options to PSI and get back speed and usability scores
psi('theverge.com', {nokey: 'true', strategy: 'mobile'}).then(data => {
  console.log('Speed score: ' + data.ruleGroups.SPEED.score);
  console.log('Usability score: ' + data.ruleGroups.USABILITY.score);
});
// ======== END:psi ===============================

// ======== watch ===================
gulp.task('watch', function() {
	gulp.watch('app/scss/**/*.scss', ['scss:app']);
	gulp.watch(['app/template-modules/**/*.html'],['html:app']);
	gulp.watch('app/js/**/*.js', ['js:app']);
	gulp.watch(['bower.json'],['bower']);
});
// ======== END:watch ===================

// ======== default ===================
gulp.task(
	'default', 
	['html:app', 'scss:app', 'clean:dist', 'watch'], 
	function(){
		gulp.start('browserSync');
	}
);
// ======== default ===================






