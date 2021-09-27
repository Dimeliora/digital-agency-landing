"use strict";

const { src, dest, parallel, series, watch } = require("gulp");
const del = require("del");
const gulpIf = require("gulp-if");
const rename = require("gulp-rename");
const htmlMin = require("gulp-htmlmin");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const groupMediaQueries = require("gulp-group-css-media-queries");
const autoprefixer = require("gulp-autoprefixer");
const csso = require("gulp-csso");
const webpackStream = require("webpack-stream");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const webp = require("gulp-webp");
const svgSprite = require("gulp-svg-sprite");
const browserSync = require("browser-sync").create();

const srcPath = "./src";
const destPath = "./dist";
const isProd = process.env.NODE_ENV === "production";
const webpackMode = isProd ? "production" : "development";

// ======== HTML Handler ========
const html = () =>
	src(`${srcPath}/*.html`)
		.pipe(
			gulpIf(
				isProd,
				htmlMin({
					collapseWhitespace: true,
					removeComments: true,
				})
			)
		)
		.pipe(dest(destPath));

// ======== SCSS Handler ========
const scss = () =>
	src(`${srcPath}/scss/styles.scss`, { allowEmpty: true })
		.pipe(gulpIf(!isProd, sourcemaps.init()))
		.pipe(
			sass({
				outputStyle: "expanded",
			})
		)
		.pipe(groupMediaQueries())
		.pipe(
			autoprefixer({
				cascade: true,
				grid: true,
			})
		)
		.pipe(
			gulpIf(
				isProd,
				csso({
					comments: false,
				})
			)
		)
		.pipe(gulpIf(!isProd, sourcemaps.write(".")))
		.pipe(dest(destPath))
		.pipe(browserSync.stream());

// ======== JS Handler ========
const js = () =>
	src(`${srcPath}/js/index.js`, { allowEmpty: true })
		.pipe(
			webpackStream({
				mode: webpackMode,
				output: {
					filename: "script.js",
				},
				module: {
					rules: [
						{
							test: /\.js$/,
							exclude: /(node_modules)/,
							use: "babel-loader",
						},
					],
				},
			})
		)
		.pipe(dest(destPath))
		.pipe(browserSync.stream());

// ======== Images Handler ========
const images = () =>
	src(`${srcPath}/images/**/*.*`)
		.pipe(rename({ dirname: "" }))
		.pipe(newer(`${destPath}/images`))
		.pipe(
			imagemin([
				imagemin.gifsicle({ interlaced: true }),
				imagemin.mozjpeg({ quality: 75, progressive: true }),
				imagemin.optipng({ optimizationLevel: 5 }),
			])
		)
		.pipe(dest(`${destPath}/images`), {});

// ======== WebP Converter ========
const webpConvert = () =>
	src(`${srcPath}/images/**/*.{png,jpg}`)
		.pipe(rename({ dirname: "" }))
		.pipe(newer(`${destPath}/images`))
		.pipe(
			webp({
				quality: 70,
			})
		)
		.pipe(dest(`${destPath}/images`));

// ======== SVG Icon Maker ========
const svg = () =>
	src(`${srcPath}/icons/**/*.svg`)
		.pipe(
			svgSprite({
				mode: {
					symbol: {
						sprite: "../icon-sprite.svg",
					},
				},
				shape: {
					transform: [
						{
							svgo: {
								plugins: [
									{ removeViewBox: false },
									{ cleanupIDs: false },
									// { removeAttrs: { attrs: "(fill|stroke)" } },
								],
							},
						},
					],
				},
			})
		)
		.pipe(dest(`${destPath}/icons`));

// ======== Fonts Copy Handler ========
const fonts = () => src(`${srcPath}/fonts/*.*`).pipe(dest(`${destPath}/fonts`));

// ======== Dev server ========
const devServer = () => {
	browserSync.init({
		server: {
			baseDir: destPath,
		},
		port: 8080,
		notify: false,
	});
};

// ======== Dist Clear ========
const clear = () => del(destPath);

// ======== Watchers ========
const watchers = () => {
	watch(`${srcPath}/*.html`, html).on("change", browserSync.reload);
	watch(`${srcPath}/scss/**/*.scss`, scss);
	watch(`${srcPath}/js/**/*.js`, js);
	watch(`${srcPath}/images/**/*.*`, parallel(images, webpConvert));
	watch(`${srcPath}/icons/**/*.svg`, svg);
};

// ======== Build Task ========
const build = series(
	clear,
	parallel(html, scss, js, images, webpConvert, svg, fonts)
);

// ======== Build & Serve Task ========
const serve = series(build, parallel(devServer, watchers));

// ======== Exports ========
exports.serve = serve;
exports.build = build;
