const projectFolder = 'dist';
const srcFolder = 'src';

const path = {
  build: {
    html: projectFolder + '/',
    css: projectFolder + '/css',
    js: projectFolder + '/js',
    img: projectFolder + '/img',
  },
  src: {
    html: [srcFolder + '/*.html', '!' + srcFolder + '/_*.html'],
    css: srcFolder + '/scss/style.scss',
    js: srcFolder + '/js/main.js',
    img: srcFolder + '/img/**/*.+(png|jpg|gif|ico|svg|webp)',
  },
  watch: {
    html: srcFolder + '/**/*.html',
    css: srcFolder + '/scss/**/*.scss',
    js: srcFolder + '/js/**/*.js',
    img: srcFolder + '/img/**/*.+(png|jpg|gif|ico|svg|webp)',
  },
  clean: './' + projectFolder + '/',
};

const gulp = require('gulp');
const { src, dest } = require('gulp');
const browsersync = require('browser-sync').create();
const fileinclude = require('gulp-file-include');
const del = require('del');
const scss = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const groupmedia = require('gulp-group-css-media-queries');
const cleancss = require('gulp-clean-css');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify-es').default;
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const webphtml = require('gulp-webp-html');
const webpcss = require('gulp-webp-css');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const concat = require('gulp-concat');
const fonter = require('gulp-fonter');

function browserSync() {
  browsersync.init({
    server: {
      baseDir: './' + projectFolder + '/',
    },
    port: 3000,
    notify: true,
  });
}

function html() {
  return src(path.src.html)
    .pipe(
      fileinclude({
        prefix: '@@',
        basepath: '@file',
      }),
    )
    .pipe(webphtml())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream());
}

function css() {
  return src(path.src.css)
    .pipe(
      scss({
        outputStyle: 'expanded',
      }),
    )
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 5 versions'],
        cascade: true,
      }),
    )
    .pipe(groupmedia())
    .pipe(webpcss())
    .pipe(dest(path.build.css))
    .pipe(cleancss())
    .pipe(
      rename({
        extname: '.min.css',
      }),
    )
    .pipe(webpcss())
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream());
}

function js() {
  return browserify({ entries: [path.src.js] })
    .transform(
      babelify.configure({
        presets: ['@babel/env'],
      }),
    )
    .bundle()
    .pipe(source('main.js'))
    .pipe(fileinclude())
    .pipe(dest(path.build.js))
    .pipe(
      uglify({
        toplevel: true,
      }),
    )
    .pipe(
      rename({
        extname: '.min.js',
      }),
    )
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream());
}

function images() {
  return src(path.src.img)
    .pipe(
      webp({
        qualify: 70,
      }),
    )
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    .pipe(
      imagemin({
        progressive: true,
        optimizationLevel: 3,
      }),
    )
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream());
}

function watchFiles() {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.img], images);
}

function clean() {
  return del(path.clean);
}

const build = gulp.series(clean, gulp.parallel(css, html, js, images));
const watch = gulp.parallel(build, watchFiles, browserSync);

exports.images = images;
exports.html = html;
exports.css = css;
exports.js = js;
exports.build = build;
exports.watch = watch;
exports.default = watch;
