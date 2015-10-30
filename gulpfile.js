var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var concat = require('gulp-concat');
var del = require('del');
var filter = require('gulp-filter');
var gulp = require('gulp');
var gutil = require('gulp-util');
var gzip = require('gulp-gzip');
var less = require('gulp-less');
var minify = require('gulp-minify-css');
var path = require('path');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var serve = require('gulp-serve');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var watchify = require('watchify');

var paths = {
	scripts: [
		'src/js/**/*.js'
	],
	styles: [
		'src/main.less'
	],
	output: 'dist'
};

var SERVE_PORT = process.env.SERVE_PORT || 8008;

var b = browserify({
	entries: 'src/js/main.js',
	paths: ['./node_modules'],
	debug: true,
	cache: {},
	packageCache: {}
});

b = watchify(b);
b.on('update', function(ids) {
	gutil.log('Updated:', ids.map(function(s) { return s.replace(__dirname + '/', '') }).join(', '));
	scripts();
});
b.on('log', gutil.log);

function scripts() {
	return b.bundle()
		.on('error', gutil.log.bind(gutil, 'Browserify Error'))
		.pipe(source('main.js'))
		.pipe(buffer())
		.pipe(plumber())
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(uglify())
		.pipe(rename('scripts.min.js'))
		.pipe(sourcemaps.write('./')) //{includeContent: false, sourceRoot: '../' + paths.output }
		.pipe(gulp.dest(paths.output));
}

gulp.task('clean-styles', function() {
	return del([
		paths.output + '/styles.min.css',
		paths.output + '/styles.min.css.gz',
		paths.output + '/styles.min.css.map'
	]);
})

gulp.task('clean-scripts', function() {
	return del([
		paths.output + '/scripts.min.js',
		paths.output + '/scripts.min.js.gz',
		paths.output + '/scripts.min.js.map'
	]);
});

gulp.task('clean', ['clean-styles', 'clean-scripts']);

gulp.task('styles', ['clean-styles'], function() {
	var lessFilter = filter('*.less', { restore: true });

	return gulp.src(paths.styles)
		.pipe(plumber())
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(lessFilter)
		.pipe(less({
			paths: [ path.join(__dirname, 'node_modules') ]
		}))
		.pipe(lessFilter.restore)
		.pipe(minify())
		.pipe(concat('styles.min.css'))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(paths.output));
});

gulp.task('scripts', ['clean-scripts'], scripts);

gulp.task('compress-styles', ['styles'], function() {
	return gulp.src(['dist/styles.min.css'])
		.pipe(gzip())
		.pipe(gulp.dest(paths.output));
});

gulp.task('compress-scripts', ['scripts'], function() {
	return gulp.src(['dist/scripts.min.js'])
		.pipe(gzip())
		.pipe(gulp.dest(paths.output));
});

gulp.task('watch', ['build'], function() {
	return gulp.watch(['src/**/*.less'], ['build-styles']);
});

gulp.task('serve', ['build'], serve({ port: SERVE_PORT }));

gulp.task('build-styles', ['styles', 'compress-styles']);
gulp.task('build-scripts', ['scripts', 'compress-scripts']);
gulp.task('build', ['clean', 'build-styles', 'build-scripts']);
gulp.task('default', ['build', 'watch', 'serve']);