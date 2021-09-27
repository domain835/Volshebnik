
let project_folder = "dist";
let source_folder = "#src";

let fs = require('fs');

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
const IMAGEMIN = require("gulp-imagemin");
const WEBP = require("gulp-webp");
const WEBP_HTML = require("gulp-webp-html");
const WEBP_CSS = require("gulp-webpcss");
const SVG_SPRITE = require("gulp-svg-sprite");
const TTF_TO_WOFF = require("gulp-ttf2woff");
const TTF_TO_WOFF2 = require("gulp-ttf2woff2");
const FONTER = require("gulp-fonter");


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
    .pipe(WEBP_HTML())
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
    .pipe(WEBP_CSS({}))
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

function images() {
	return src(path.src.img)
    .pipe(
      WEBP({
        quality: 70
      })
    )
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    .pipe(
      IMAGEMIN({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        interleaced: true,
        optimizationLevel: 3 // 0 to 7
      })
    )
    .pipe(dest(path.build.img))
    .pipe(BROWSER_SYNC.stream())
}

function fonts(params) {
  src(path.src.fonts)
    .pipe(TTF_TO_WOFF())
    .pipe(dest(path.build.fonts))
  return src(path.src.fonts)
    .pipe(TTF_TO_WOFF2())
    .pipe(dest(path.build.fonts))
}

GULP.task('otfToTtf', function () {
  return src([source_folder + '/fonts/*.otf'])
    .pipe(FONTER({
      formats: ['ttf']
    }))
    .pipe(dest(source_folder + '/fonts/'));
})

GULP.task('svgSprite', function () {
  return GULP.src([source_folder + '/iconsprite/*.svg'])
  .pipe(SVG_SPRITE({
    mode: {
      stack: {
        sprite: "../icons/icons.svg",
        example: true
      }
    },
  }
  ))
  .pipe(dest(path.build.img))
})

function fontsStyle(params) {
  let file_content = fs.readFileSync(source_folder + '/scss/fonts.scss');
  if (file_content == '') {
    fs.writeFile(source_folder + '/scss/fonts.scss', '', cb);
    return fs.readdir(path.build.fonts, function (err, items) {
      if (items) {
        let c_fontname;
        for (var i = 0; i < items.length; i++) {
          let fontname = items[i].split('.');
          fontname = fontname[0];
          if (c_fontname != fontname) {
            fs.appendFile(source_folder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
          }
          c_fontname = fontname;
        }
      }
    })
  }
}

function cb() { // callback function

}

function watchFiles(params) {
  GULP.watch([path.watch.html], html);
  GULP.watch([path.watch.css], css);
  GULP.watch([path.watch.js], js);
  GULP.watch([path.watch.img], images);
}

function cleanDist(params) {
  return DEL(path.clean);
}

let build = GULP.series(cleanDist, GULP.parallel(js, css, html, images, fonts), fontsStyle);
let watch = GULP.parallel(build, watchFiles, browserSync);


exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;

