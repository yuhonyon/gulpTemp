var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var open = require("open");
//var pump = require('pump');
var minifier = require('gulp-uglify/minifier');
var uglifyjs = require('uglify-js');

var yfylint = require("gulp-yfylint");
var src = {
	'sass': 'src/sass/**/*.scss',
	'sassTools': 'src/sass/tools/*.scss',
	'bootstrap': 'src/sass/bootstrap.scss',

	'plugIn': 'src/plugIn/**/*',

	'html': 'src/html/*.html',
	'includeHtml': 'src/html/include/*.html',

	'js': 'src/js/*.js',
	'customJs': 'src/js/*/*.js',
	'json': 'src/js/**/*.json',

	'fonts': 'src/fonts/**/*.+(eot|svg|ttf|woff)',
	'images': 'src/images/**/*.+(jpeg|jpg|png|gif)',
	'dist': 'dist/*'
};

var dest = {
	'css': 'dist/css/',
	'fonts': 'dist/fonts/',
	'images': 'dist/images/',
	'js': 'dist/js/',
	'json': 'dist/js/',
	'plugIn': 'dist/plugIn/',
	'html': 'dist/'
};

var autoprefixer = { browsers: ['last 2 version', 'Firefox >= 20', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'], cascade: true };



gulp.task('clean', function() {
	return gulp.src([src.dist], { read: false })
		.pipe($.clean());
});

gulp.task('dist', ['clean'], function() {
	gulp.start('custom-js', 'sass', 'html', 'js', 'fonts', 'images', "json", "bootstrap", "plugIn");
});




gulp.task('html', function() {
	gulp.src(src.html)
		.pipe($.plumber())
		.pipe($.changed(dest.html))
		.pipe($.fileInclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(gulp.dest(dest.html))
		.pipe($.connect.reload());
});





gulp.task('bootstrap', function() {
	return gulp.src(src.bootstrap)
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.sass({ outputStyle: 'expanded' }).on('error', $.sass.logError))
		.pipe($.autoprefixer(autoprefixer))
		.pipe($.minifyCss())
		.pipe($.rename(function(path) {
			if (!/\.min/.test(path)) {
				path.basename += ".min";
			}
		}))
		.pipe($.sourcemaps.write('./maps'))
		.pipe(gulp.dest(dest.css))
		.pipe($.connect.reload());
});



gulp.task('sass', function() {
	return gulp.src([src.sass, '!' + src.bootstrap])
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.sass({ outputStyle: 'expanded' }).on('error', $.sass.logError))
		.pipe($.autoprefixer(autoprefixer))
		.pipe($.minifyCss())
		.pipe($.rename(function(path) {
			if (!/\.min/.test(path)) {
				path.basename += ".min";
			}
		}))
		.pipe($.sourcemaps.write('./maps'))
		.pipe(gulp.dest(dest.css))
		.pipe($.connect.reload());
});


gulp.task('js', function() {
	return gulp.src(src.js)
		.pipe($.plumber())
		.pipe($.changed(dest.js))
		.pipe($.rename(function(path) {
			if (!/\.min/.test(path)) {
				path.basename += ".min";
			}
		}))
		.pipe(minifier({
			mangle: {
				support_ie8: true
			}
		}, uglifyjs))
		.pipe(gulp.dest(dest.js))
		.pipe($.connect.reload());
});

gulp.task('custom-js', function() {
	var fileName = 'common.min.js';
	return gulp.src('src/js/common/*.js')
		.pipe($.eslint())
		.pipe($.eslint.results(results => yfylint.src(results)))
		.pipe($.concat(fileName))

	.pipe(yfylint.dest())
		.pipe(gulp.dest(dest.js))
		.pipe($.connect.reload());
});

gulp.task('fonts', function() {
	return gulp.src(src.fonts)
		.pipe($.plumber())
		.pipe($.changed(dest.fonts))
		.pipe(gulp.dest(dest.fonts))
		.pipe($.connect.reload());
});

gulp.task('json', function() {
	return gulp.src(src.json)
		.pipe($.plumber())
		.pipe($.changed(dest.json))
		.pipe(gulp.dest(dest.json))
		.pipe($.connect.reload());
});

gulp.task('images', function() {
	return gulp.src(src.images)
		.pipe($.plumber())
		.pipe($.changed(dest.images))
		.pipe($.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
		.pipe(gulp.dest(dest.images))
		.pipe($.connect.reload());
});

gulp.task('watch', function() {
	gulp.watch(src.sass, ['sass']);
	gulp.watch(src.sassTools, ['bootstrap']);
	gulp.watch(src.images, ['images']);
	gulp.watch(src.js, ['js']);

	gulp.watch(src.fonts, ['fonts']);

	gulp.watch(src.json, ['json']);

	gulp.watch(src.customJs, ['custom-js']);


	gulp.watch(src.html, ['html']);
	gulp.watch(src.includeHtml, function() {
		return gulp.src(src.html)
			.pipe($.fileInclude({
				prefix: '@@',
				basepath: '@file'
			}))
			.pipe(gulp.dest(dest.html))
			.pipe($.connect.reload());
	});

	gulp.watch([src.plugIn, '!' + src.plugIn + '.+(jpeg|jpg|png|gif|js|css|scss)'], ['plugIn-file']);
	gulp.watch(src.plugIn + '.scss', ['plugIn-sass']);
	gulp.watch([src.plugIn + '.js', '!' + src.plugIn + '.min.js'], ['plugIn-js']);
	gulp.watch(src.plugIn + '.min.js', ['plugIn-minjs']);
	gulp.watch(src.plugIn + '.css', ['plugIn-css']);
	gulp.watch(src.plugIn + '.+(jpeg|jpg|png|gif)', ['plugIn-images']);
});

gulp.task('plugIn-sass', function() {
	return gulp.src(src.plugIn + '.scss')
		.pipe($.changed(dest.plugIn))
		.pipe($.sourcemaps.init())
		.pipe($.sass({ outputStyle: 'expanded' }).on('error', $.sass.logError))
		.pipe($.autoprefixer(autoprefixer))
		.pipe($.minifyCss())
		.pipe($.rename(function(path) {
			if (!/\.min/.test(path)) {
				path.basename += ".min";
			}
		}))
		.pipe($.sourcemaps.write('./maps'))
		.pipe(gulp.dest(dest.plugIn))
		.pipe($.connect.reload());
});

gulp.task('plugIn-css', function() {
	return gulp.src(src.plugIn + '.css')
		.pipe($.changed(dest.plugIn))
		.pipe($.autoprefixer(autoprefixer))
		.pipe($.minifyCss())
		.pipe($.rename(function(path) {
			if (!/\.min/.test(path)) {
				path.basename += ".min";
			}
		}))
		.pipe(gulp.dest(dest.plugIn))
		.pipe($.connect.reload());
});

gulp.task('plugIn-js', function() {
	return gulp.src([src.plugIn + '.js', '!' + src.plugIn + '.min.js'])
		.pipe($.changed(dest.plugIn))
		.pipe($.rename(function(path) {
			if (!/\.min/.test(path)) {
				path.basename += ".min";
			}
		}))
		.pipe(minifier({
			mangle: {
				support_ie8: true
			}
		}, uglifyjs))
		.pipe(gulp.dest(dest.plugIn))
		.pipe($.connect.reload());
});

gulp.task('plugIn-minjs', function() {
	return gulp.src(src.plugIn + '.min.js', { buffer: false })
		.pipe(gulp.dest(dest.plugIn))
		.pipe($.connect.reload());
});


gulp.task('plugIn-images', function() {
	return gulp.src(src.plugIn + '.+(jpeg|jpg|png|gif)')
		.pipe($.changed(dest.plugIn))
		.pipe($.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
		.pipe(gulp.dest(dest.plugIn))
		.pipe($.connect.reload());
});

gulp.task('plugIn-file', function() {
	return gulp.src([src.plugIn, '!' + src.plugIn + '.+(jpeg|jpg|png|gif|js|css|scss)'], { buffer: false })
		.pipe(gulp.dest(dest.plugIn));
});

gulp.task('plugIn', function() {
	gulp.start('plugIn-js', 'plugIn-minjs', 'plugIn-images', 'plugIn-sass', 'plugIn-css', 'plugIn-file');
});




gulp.task('server', function() {
	var host = "localhost";
	var port = 80;
	$.connect.server({
		name: 'test server',
		host: host,
		root: 'dist',
		port: port,
		livereload: true,
		index: false
	});
	open("http://" + host + ":" + port);
});


gulp.task('dev', function() {
	gulp.start('watch', 'server');
});





gulp.task('default', function() {
	console.log("[1;35m")
	console.log("gulp dist   ------------   编译");
	console.log("gulp server ------------   运行本地测试服务器");
	console.log("gulp dev  ------------   开发模式");
	console.log("gulp watch  ------------   监测编译");
	console.log("gulp        ------------   命令提示");
	console.log("[1;37m");
});
