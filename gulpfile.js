const { src, dest, watch, series, parallel, lastRun } = require('gulp');
//const gulp = require('gulp');
const assets = require('postcss-assets');
const autoprefixer = require('autoprefixer');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const clean = require('postcss-clean');
const concat = require('gulp-concat');
const del = require('del');
const pug = require('gulp-pug');
const eslint = require('gulp-eslint');
const flexBugsFixes = require('postcss-flexbugs-fixes');
const htmlhint = require('gulp-htmlhint');
const header = require('gulp-header');
const imagemin = require('gulp-imagemin');
const mozjpeg = require('imagemin-mozjpeg');
const notify = require('gulp-notify');
const order = require('gulp-order');
const plumber = require('gulp-plumber');
const pngquant = require('imagemin-pngquant');
const postcss = require('gulp-postcss');
const prettify = require('gulp-prettify');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
const scsslint = require('gulp-scss-lint');
const sorting = require('postcss-sorting');
const uglify = require('gulp-uglify');
const include = require('gulp-include');
const stripCssComments = require('gulp-strip-css-comments');
const sassGlob = require('gulp-sass-glob');
const gcmq = require('gulp-group-css-media-queries');
const paths = {
  root: './src',
  dest: './dist/',
  html: {
    src: './src/html/**/*.html',
    dest: './dist/',
  },
  pug: {
    src: './src/pug/**/!(_)*.pug',
    dest: './dist/',
  },
  styles: {
    src: './src/sass/**/*.scss',
    dest: './dist/assets/css',
    map: './dist/assets/css/maps',
  },
  javascript: {
    src: './src/javascript/**/*.js',
    jsx: './src/javascript/**/*.jsx',
    dest: './dist/assets/js',
    map: './dist/assets/js/maps',
  },
  scripts: {
    src: './src/js/**/*.js',
    jsx: './src/js/**/*.jsx',
    dest: './dist/assets/js',
    map: './dist/assets/js/maps',
    core: 'src/js/core/**/*.js',
    app: 'src/js/app/**/*.js',
  },
  images: {
    src: './src/images/**/*.{jpg,jpeg,png,svg,gif,ico}',
    dest: './dist/assets/images/',
  },
  json: {
    src: './src/json/**/*.json',
    dest: './dist/assets/json/',
  },
  fonts: {
    src: './src/fonts/**/*.{woff,woff2,ttf,svg,eot}',
    dest: './dist/assets/fonts/',
  },
};
// Post CSS
const autoprefixerOption = {
  grid: true,
};
const sortingOptions = require('./postcss-sorting.json');
const postcssOption = [
  assets({
    baseUrl: '/',
    basePath: 'src/',
    loadPaths: ['images/'],
    cachebuster: true,
  }),
  flexBugsFixes,
  autoprefixer(autoprefixerOption),
  sorting(sortingOptions),
];

// HTML整形
const html = () => {
  return src(paths.html.src, { since: lastRun(html) })
    .pipe(
      prettify({
        indent_char: ' ',
        indent_size: 2,
        unformatted: ['a', 'span', 'br'],
      })
    )
    .pipe(dest(paths.html.dest));
};

// PUG整形
const pugs = () => {
  return src(paths.pug.src, { since: lastRun(html) })
    .pipe(
      plumber({
        errorHandler: notify.onError('Error: <%= error.message %>'),
      })
    )
    .pipe(pug({ pretty: true }))
    .pipe(dest(paths.pug.dest));
};

// Sassコンパイル(非圧縮)
const styles = () => {
  return src(paths.styles.src, { sourcemaps: true })
    .pipe(
      plumber({
        errorHandler: notify.onError('<%= error.message %>'),
      })
    )
    .pipe(
      sass({
        outputStyle: 'expanded',
      })
    )
    .pipe(replace(/@charset "UTF-8";/g, ''))
    .pipe(header('@charset "UTF-8";\n\n'))
    .pipe(postcss(postcssOption))
    .pipe(dest(paths.styles.dest, { sourcemaps: './maps' }));
};
// Sassコンパイル(圧縮)
const sassCompress = () => {
  return (
    src(paths.styles.src)
      .pipe(
        plumber({
          errorHandler: notify.onError('<%= error.message %>'),
        })
      )
      //.pipe(sassGlob())
      .pipe(
        sass({
          outputStyle: 'compact',
        }).on('error', sass.logError)
      ) // nested | expanded | compact | compressed
      .pipe(replace(/@charset "UTF-8";/g, ''))
      .pipe(header('@charset "UTF-8";\n\n'))
      .pipe(postcss(postcssOption, [clean()]))
      //.pipe(gcmq())
      .pipe(
        stripCssComments({
          preserve: false,
          //preserve: /^#/
        })
      )
      .pipe(replace('\n\n', '\n'))
      .pipe(replace(/^\n/gm, ''))
      .pipe(dest(paths.styles.dest))
  );
};

// JS整形
const javascript = () => {
  return (
    src(paths.javascript.src, { sourcemaps: true })
      .pipe(include())
      .on('error', console.log)
      .pipe(
        babel({
          presets: ['@babel/env'],
        })
      )
      .pipe(plumber())
      //.pipe(uglify())
      /*.pipe(
      rename({
        suffix: '.min'
      })
    )*/
      .pipe(dest(paths.javascript.dest, { sourcemaps: './maps' }))
  );
};

// JSコンパイル
const scripts = () => {
  return src(paths.scripts.src, { sourcemaps: true })
    .pipe(order([paths.scripts.core, paths.scripts.app], { base: './' }))
    .pipe(include())
    .on('error', console.log)
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(plumber())
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(
      rename({
        suffix: '.min',
      })
    )
    .pipe(dest(paths.scripts.dest, { sourcemaps: './maps' }));
};

// 画像最適化
const imageminOption = [
  pngquant({
    quality: [0.7, 0.85],
  }),
  mozjpeg({
    quality: 85,
  }),
  imagemin.gifsicle({
    interlaced: false,
  }),
  imagemin.jpegtran(),
  imagemin.optipng(),
  imagemin.svgo({ removeViewBox: true }, { cleanupIDs: false }),
];
const images = () => {
  return src(paths.images.src, {
    since: lastRun(images),
  })
    .pipe(imagemin(imageminOption))
    .pipe(dest(paths.images.dest));
};

// JSONファイルコピー
const json = () => {
  console.log('JSON コピー');
  return src(paths.json.src, {
    since: lastRun(json),
  }).pipe(dest(paths.json.dest));
};

// フォントファイルコピー
const fonts = () => {
  console.log('FONTS コピー');
  return src(paths.fonts.src, {
    since: lastRun(fonts),
  }).pipe(dest(paths.fonts.dest));
};

// マップファイル削除
const cleanMapFiles = () => {
  return del([paths.styles.map, paths.javascript.map, paths.scripts.map]);
};

// Distributionディレクトリ削除
const cleanDistFiles = () => {
  return del(['dist/**/*']);
};

// HTML Lint
const htmlLint = () => {
  return src(paths.html.src).pipe(htmlhint()).pipe(htmlhint.reporter());
};
// SASS Lint
const sassLint = () => {
  return src(paths.styles.src).pipe(
    scsslint({
      config: 'scss-lint.yml',
    })
  );
};
// ESLint
const esLint = () => {
  return src([
    paths.javascript.src,
    paths.javascript.jsx,
    paths.scripts.src,
    paths.scripts.jsx,
    '!./src/js/core/**/*.js',
  ])
    .pipe(
      eslint({
        useEslintrc: true,
        fix: true,
      })
    )
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
};

// ブラウザ更新＆ウォッチタスク
const browserSyncOption = {
  port: 4000,
  server: {
    baseDir: './dist/',
    index: 'index.html',
  },
  reloadOnRestart: true,
};
const browsersync = (done) => {
  browserSync.init(browserSyncOption);
  done();
};
const watchFiles = (done) => {
  const browserReload = () => {
    browserSync.reload();
    done();
  };
  watch(paths.styles.src).on('change', series(styles, browserReload));
  watch(paths.javascript.src).on(
    'change',
    series(javascript, esLint, browserReload)
  );
  watch(paths.javascript.jsx).on(
    'change',
    series(javascript, esLint, browserReload)
  );
  watch(paths.scripts.src).on('change', series(scripts, esLint, browserReload));
  watch(paths.scripts.jsx).on('change', series(scripts, esLint, browserReload));
  watch(paths.pug.src).on('change', series(pugs, browserReload));
  watch(paths.html.src).on('change', series(html, browserReload));
};

exports.default = series(
  parallel(
    cleanDistFiles,
    images,
    styles,
    javascript,
    scripts,
    pugs,
    html,
    json,
    fonts
  ),
  series(browsersync, watchFiles)
);
exports.clean = cleanMapFiles;
exports.imagemin = images;
exports.sasscompress = sassCompress;
exports.del = cleanDistFiles;
exports.build = series(
  parallel(
    cleanDistFiles,
    scripts,
    images,
    sassCompress,
    pugs,
    html,
    json,
    fonts
  ),
  cleanMapFiles
);
exports.eslint = esLint;
exports.htmllint = htmlLint;
exports.sasslint = sassLint;
exports.test = series(sassLint, esLint, htmlLint);
