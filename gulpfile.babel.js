'use strict';

/**
 * Import all dependences
 */
import gulp from 'gulp';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import cssNano from 'gulp-cssnano';
import eslint from 'gulp-eslint';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import htmlmin from 'gulp-htmlmin';
import imagemin from 'gulp-imagemin';
import browserSync from 'browser-sync';
import runSequence from 'run-sequence';
import clean from 'gulp-clean';

/**
 * Developer folder
 * @type {String}
 */
const app = './app/';

/**
 * reload the browse
 */
const reload = browserSync.reload;

/**
 * List all the browser what will be supported
 * @type {Array}
 */
const AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

/**
 * All Compiled sass files
 * @type {Array}
 */
const sassFiles = [
  app + 'sass/main.sass',
];

/**
 * All Compoled javascript files
 * @type {Array}
 */
const javascriptFiles = [
  app + '/js/main.js'
];

/**
 * Service Workers files
 * @type {Array}
 */
const serviceWorkers = [
  app + '/service-worker/service-worker.js',
  app + '/service-worker/register.js'
];

/**
 * All files what will be analyzed by eslint
 * @type {Array}
 */
const lint = [
  app + '/js/main.js',
  app + '/service-worker/service-worker.js',
  app + '/service-worker/register.js'
];

/**
 * All Html files
 * @type {Array}
 */
const htmlFiles = [
  app + '**/*.html'
];

/**
 * All Image Files
 * @type {Array}
 */
const imagesFiles = [
  'app/images/**/*'
];

/**
 * Compile sass into css minify
 */
gulp.task('sass', () => {
  return gulp.src(sassFiles)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
    .pipe(cssNano())
    .pipe(gulp.dest('dist/css'));
});

/**
 * Analylize javascript code
 */
gulp.task('eslint', () => {
  return gulp.src(lint)
    .pipe(eslint())
    .pipe(eslint.format());
});

/**
 * Compile and minify all javascript code
 */
gulp.task('scripts', ['eslint'], () => {
  return gulp.src(javascriptFiles)
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

/**
 * Compile and minify all worker
 */
gulp.task('workers', ['eslint'], () => {
  return gulp.src(serviceWorkers)
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest('dist/service-worker'));
});

/**
 * Copy Html For the dist folder
 * @param  {[type]} 'html' [description]
 * @param  {[type]} (      [description]
 * @return {[type]}        [description]
 */
gulp.task('html', () => {
  return gulp.src(htmlFiles)
    .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
    .pipe(gulp.dest('dist'));
});

/**
 * Copy manifest for dist folder
 */
gulp.task('manifest', () => {
  return gulp.src(app + 'manifest.json')
    .pipe(gulp.dest('dist'));
});

/**
 * Copy all images for the dist folder
 */
gulp.task('images', () => {
  return gulp.src(imagesFiles)
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'));
});

/**
 * Serve an browsersync server and watch all files
 * @param  {[type]} 'serve'     [description]
 * @param  {[type]} ['default'] [description]
 * @param  {[type]} (           [description]
 * @return {[type]}             [description]
 */
gulp.task('serve', ['default'], () => {
  browserSync({
    notify: false,
    logPrefix: 'WSK',
    baseDir: './dist',
    server: ['dist'],
    port: 3000
  });

  gulp.watch(['app/**/*.html'], ['html', reload]);
  gulp.watch(['app/sass/**/*.{sass, scss}'], ['sass', reload]);
  gulp.watch(['app/js/**/*.js'], ['scripts', reload]);
  gulp.watch(['app/service-worker/**/*.js'], ['workers', reload]);
  gulp.watch(['app/images/**/*'], ['images', reload]);
});

/**
 * Default task used to generate the dist folder with all production code
 */
gulp.task('default', () => {
  return runSequence('clean', ['manifest','html', 'sass', 'scripts', 'workers', 'images']);
});

/**
 * Clean the last compile code
 */
gulp.task('clean', () => {
  return gulp.src('dist')
    .pipe(clean());
});
