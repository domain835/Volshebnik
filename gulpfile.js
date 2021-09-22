
let project_folder = "dist";
let source_folder = "#src";

let path = {
    build: {
      html: project_folder + "/",
      css: project_folder + "/css/",
      js: project_folder + "/js/",
      img: project_folder + "/img/",
      fonts: project_folder + "/fonts/"
    },
    src: {
      html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
      css: source_folder + "/scss/style.scss",
      js: source_folder + "/js/script.js",
      img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
      fonts: source_folder + "/fonts/*"
    },
    watch: {
      html: source_folder + "/**/*.html",
      css: source_folder + "/scss/**/*.scss",
      js: source_folder + "/js/**/*.js",
      img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
    },
    clean: "./" + project_folder + "/"
}

const {src, dest} = require('gulp');

const GULP = require('gulp');
const BROWSER_SYNC = require("browser-sync").create();
const FILE_INCLUDE = require("gulp-file-include");
const DEL = require("del");
const SCSS = require("gulp-sass");
const AUTOPREFIXER = require("gulp-autoprefixer");
const GROUP_MEDIA = require("gulp-group-css-media-queries");
const CLEAN_CSS = require("gulp-clean-css");
const RENAME = require("gulp-rename");
const UGLIFY = require("gulp-uglify-es").default;


function browserSync(params) {
  BROWSER_SYNC.init({
    server: {
      baseDir: "./" + project_folder + "/"
    },
    notify: false
  })
}

function html() {
	return src(path.src.html)
    .pipe(FILE_INCLUDE())
    .pipe(dest(path.build.html))
    .pipe(BROWSER_SYNC.stream())
}

function css() {
  return src(path.src.css)
    .pipe(
      SCSS({
        outputStyle: "expanded"
      })
    )
    .pipe(
      GROUP_MEDIA()
    )
    .pipe(
      AUTOPREFIXER({
        overrideBrowserlist: ["last 5 versions"],
        cascade: true
      })
    )
    .pipe(dest(path.build.css))
    .pipe(CLEAN_CSS())
    .pipe(
      RENAME({
        extname: ".min.css"
      })
    )
    .pipe(dest(path.build.css))
    .pipe(BROWSER_SYNC.stream())
}

function js() {
	return src(path.src.js)
    .pipe(FILE_INCLUDE())
    .pipe(dest(path.build.js))
    .pipe(
      UGLIFY()
    )
    .pipe(
      RENAME({
        extname: ".min.js"
      })
    )
    .pipe(dest(path.build.js))
    .pipe(BROWSER_SYNC.stream())
}

function watchFiles(params) {
  GULP.watch([path.watch.html], html);
  GULP.watch([path.watch.css], css);
  GULP.watch([path.watch.js], js);
}

function cleanDist(params) {
  return DEL(path.clean);
}

let build = GULP.series(cleanDist, GULP.parallel(js, css, html));
let watch = GULP.parallel(build, watchFiles, browserSync);

exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;

// exports.browserSync = browserSync;
// exports.cleanDist = cleanDist;

// exports.build = series(cleanDist, html, images, build);
// exports.default = parallel(styles, scripts, browserSync, watch);

// function images() {
//   return src('#src/images/**/*')
//     .pipe(imagemin([
//       imagemin.gifsicle({interlaced: true}),
//       imagemin.mozjpeg({quality: 75, progressive: true}),
//       imagemin.optipng({optimizationLevel: 5}),
//       imagemin.svgo({
//           plugins: [
//               {removeViewBox: true},
//               {cleanupIDs: false}
//           ]
//       })
//   ]))
//     .pipe(dest('dist/images'))
// }

// function scripts() {
//   return src([
//     'node_modules/jquery/dist/jquery.js',
//     '#src/js/slick.min.js',
//     'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.js',
//     '#src/js/script.js'
//   ])
//     .pipe(concat('script.min.js'))
//     .pipe(uglify())
//     .pipe(dest('#src/js'))
//     .pipe(BROWSERSYNC.stream())
// }

// function styles() {
//   return src([
//     'node_modules/normalize.css/normalize.css',
//     '#src/css/slick.css',
//     '#src/scss/style.scss'
//   ])
//     .pipe(scss({outputStyle: 'compressed'}))
//     .pipe(concat('style.min.css'))
//     .pipe(autoprefixer({
//       overrideBrowserslist: ['last 10 version'],
//       grid: true
//     }))
//     .pipe(dest('#src/css'))
//     .pipe(BROWSERSYNC.stream())
// }

// function build() {
//   return src([
//     '#src/css/style.min.css',
//     '#src/fonts/**/*',
//     '#src/js/script.min.js',
//     '#src/*.html'
//   ], {base: '#src'})
//     .pipe(dest('dist'))
// }

// function watching() {
//   watch(['#src/scss/**/*.scss'], styles);
//   watch(['#src/js/**/*.js', '!#src/js/script.min.js'], scripts);
//   watch(['#src/*.html']).on('change', BROWSERSYNC.reload);
// }



