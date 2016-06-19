import gulp from 'gulp';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import cssNano from 'gulp-cssnano';
import eslint from 'gulp-eslint';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';

const app = './app/';

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

const sassFiles = [
  app + 'sass/main.sass',
  app + 'sass/media.sass',
];

const javascriptFiles = [
  app + '/js/main.js'
];

const serviceWorkers = [
  app + '/service-worker/service-worker.js',
  app + '/service-worker/register.js'
];

const lint = [
  app + '/js/main.js',
  app + '/service-worker/service-worker.js',
  app + '/service-worker/register.js'
];

gulp.task('sass', () => {
  return gulp.src(sassFiles)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
    .pipe(cssNano())
    .pipe(gulp.dest('dist/css'));
});

gulp.task('eslint', () => {
  return gulp.src(lint)
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('scripts', ['eslint'], () => {
  return gulp.src(javascriptFiles)
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('workers', ['eslint'], () => {
  return gulp.src(serviceWorkers)
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest('dist/service-worker'));
});
