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
const gulp = require('gulp');
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
const paths = {
  root: './src',
  dest: './dist/',
  html: {
    src: './src/html/**/*.html',
    dest: './dist/'
  },
  pug: {
    src: './src/pug/**/!(_)*.pug',
    dest: './dist/'
  },
  styles: {
    src: './src/sass/**/*.scss',
    dest: './dist/assets/css',
    map: './dist/assets/css/maps'
  },
  javascript: {
    src: './src/javascript/**/*.js',
    jsx: './src/javascript/**/*.jsx',
    dest: './dist/assets/js',
    map: './dist/assets/js/maps'
  },
  scripts: {
    src: './src/js/**/*.js',
    jsx: './src/js/**/*.jsx',
    dest: './dist/assets/js',
    map: './dist/assets/js/maps',
    core: 'src/js/core/**/*.js',
    app: 'src/js/app/**/*.js'
  },
  images: {
    src: './src/images/**/*.{jpg,jpeg,png,svg,gif,ico}',
    dest: './dist/assets/images/'
  },
  fonts: {
    src: './src/fonts/**/*.{woff,woff2,ttf,svg,eot}',
    dest: './dist/assets/fonts/'
  }
};
// Post CSS
const autoprefixerOption = {
  grid: true
};
const sortingOptions = require('./postcss-sorting.json');
const postcssOption = [
  assets({
    baseUrl: '/',
    basePath: 'src/',
    loadPaths: ['images/'],
    cachebuster: true
  }),
  flexBugsFixes,
  autoprefixer(autoprefixerOption),
  sorting(sortingOptions)
];

// HTML整形
const html = () => {
  return gulp
    .src(paths.html.src, { since: gulp.lastRun(html) })
    .pipe(
      prettify({
        indent_char: ' ',
        indent_size: 2,
        unformatted: ['a', 'span', 'br']
      }),
    )
    .pipe(gulp.dest(paths.html.dest));
}

// PUG整形
const pugs = () => {
  return gulp
    .src(paths.pug.src, { since: gulp.lastRun(html) })
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest(paths.pug.dest));
}

// Sassコンパイル(非圧縮)
const styles = () => {
  return gulp
    .src(paths.styles.src, { sourcemaps: true })
    .pipe(
      plumber({
        errorHandler: notify.onError('<%= error.message %>'),
      })
    )
    .pipe(
      sass({
        outputStyle: 'expanded'
      }),
    )
    .pipe(replace(/@charset "UTF-8";/g, ''))
    .pipe(header('@charset "UTF-8";\n\n'))
    .pipe(postcss(postcssOption))
    .pipe(gulp.dest(paths.styles.dest, { sourcemaps: './maps' }));
}
// Sassコンパイル(圧縮)
const sassCompress = () => {
  return gulp
    .src(paths.styles.src)
    .pipe(
      plumber({
        errorHandler: notify.onError('<%= error.message %>')
      })
    )
    .pipe(
      sass({
        outputStyle: 'compressed'
      })
    )
    .pipe(replace(/@charset "UTF-8";/g, ''))
    .pipe(header('@charset "UTF-8";\n\n'))
    .pipe(postcss(postcssOption, [clean()]))
    .pipe(gulp.dest(paths.styles.dest));
}

// JS整形
const javascript = () => {
  return gulp
    .src(paths.javascript.src, { sourcemaps: true })
    .pipe(
      babel({
        presets: ['@babel/env']
      })
    )
    .pipe(plumber())
    //.pipe(uglify())
    /*.pipe(
      rename({
        suffix: '.min'
      })
    )*/
    .pipe(gulp.dest(paths.javascript.dest, { sourcemaps: './maps' }));
}

// JSコンパイル
const scripts = () => {
  return gulp
    .src(paths.scripts.src, { sourcemaps: true })
    .pipe(order([paths.scripts.core, paths.scripts.app], { base: './' }))
    .pipe(
      babel({
        presets: ['@babel/env']
      })
    )
    .pipe(plumber())
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(
      rename({
        suffix: '.min'
      })
    )
    .pipe(gulp.dest(paths.scripts.dest, { sourcemaps: './maps' }));
}

// 画像最適化
const imageminOption = [
  pngquant({
    quality: [0.7, 0.85]
  }),
  mozjpeg({
    quality: 85
  }),
  imagemin.gifsicle(),
  imagemin.jpegtran(),
  imagemin.optipng(),
  imagemin.svgo({
    removeViewBox: false
  })
];
const images = () => {
  return gulp
    .src(paths.images.src, {
      since: gulp.lastRun(images)
    })
    .pipe(imagemin(imageminOption))
    .pipe(gulp.dest(paths.images.dest));
}

// フォントファイルコピー
const fonts = () => {
  console.log('コピー');
  return gulp
    .src(paths.fonts.src, {
      since: gulp.lastRun(fonts)
    })
    .pipe(gulp.dest(paths.fonts.dest));
}

// マップファイル削除
const cleanMapFiles = () => {
  return del([paths.styles.map, paths.javascript.map, paths.scripts.map]);
}

// Distributionディレクトリ削除
const cleanDistFiles = () => {
  return del([
    'dist/**/*'
  ]);
}

// HTML Lint
const htmlLint = () => {
  return gulp
    .src(paths.html.src)
    .pipe(htmlhint())
    .pipe(htmlhint.reporter());
}
// SASS Lint
const sassLint = () => {
  return gulp.src(paths.styles.src).pipe(
    scsslint({
      config: 'scss-lint.yml'
    })
  );
}
// ESLint
const esLint = () => {
  return gulp
    .src([paths.javascript.src, paths.javascript.jsx, paths.scripts.src, paths.scripts.jsx, '!./src/js/core/**/*.js'])
    .pipe(
      eslint({
        useEslintrc: true,
        fix: true
      })
    )
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

// ブラウザ更新＆ウォッチタスク
const browserSyncOption = {
  port: 4000,
  server: {
    baseDir: './dist/',
    index: 'index.html'
  },
  reloadOnRestart: true
};
const browsersync = (done) => {
  browserSync.init(browserSyncOption);
  done();
}
const watchFiles = (done) => {
  const browserReload = () => {
    browserSync.reload();
    done();
  };
  gulp.watch(paths.styles.src).on('change', gulp.series(styles, browserReload));
  gulp.watch(paths.javascript.src).on('change', gulp.series(javascript, esLint, browserReload));
  gulp.watch(paths.javascript.jsx).on('change', gulp.series(javascript, esLint, browserReload));
  gulp.watch(paths.scripts.src).on('change', gulp.series(scripts, esLint, browserReload));
  gulp.watch(paths.scripts.jsx).on('change', gulp.series(scripts, esLint, browserReload));
  gulp.watch(paths.pug.src).on('change', gulp.series(pugs, browserReload));
  gulp.watch(paths.html.src).on('change', gulp.series(html, browserReload));
}

gulp.task('default', gulp.series(gulp.parallel(cleanDistFiles, images, styles, javascript, scripts, pugs, html, fonts), gulp.series(browsersync, watchFiles)));

gulp.task('clean', cleanMapFiles);
gulp.task('imagemin', images);
gulp.task('sass-compress', sassCompress);
gulp.task('del', cleanDistFiles);
gulp.task('build', gulp.series(gulp.parallel('del', scripts, 'imagemin', 'sass-compress', pugs, html, fonts), 'clean'));
gulp.task('eslint', esLint);
gulp.task('html-lint', htmlLint);
gulp.task('sass-lint', sassLint);
gulp.task('test', gulp.series(sassLint, esLint, htmlLint));
