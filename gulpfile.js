var gulp = require('gulp');
var del = require('del');
var clip = require('gulp-clip-empty-files');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var ngAnnotate = require('gulp-ng-annotate');
var changed = require('gulp-changed');
var gulpif = require('gulp-if');
var livereload = require('gulp-livereload');
var injectReload = require('gulp-inject-reload');

var paths = {
    base: './client',
    target: './build',
    js: ['./node_modules/socket.io/node_modules/socket.io-client/socket.io.js',
        './node_modules/angular/angular.js',
        './node_modules/angular-sanitize/angular-sanitize.js',
        './node_modules/angular-local-storage/dist/angular-local-storage.js',
        './node_modules/marked/lib/marked.js',
        './client/app.js',
        './client/**/*.js'],
    css: './client/style.css',
    index_html: './client/index.html',
    html: ['./client/**/*.html', '!client/index.html']
};

//clean up old build
gulp.task('clean', function clean(callback) {
    del(['build'], callback);
});

//copy over index.html with livereload if in debug
gulp.task('build-index', buildIndex(false));
gulp.task('build-index-livereload', buildIndex(true));
function buildIndex(debug) {
    return function() {
        gulp.src(paths.index_html, { base: paths.base })
            .pipe(gulpif(debug, injectReload()))
            .pipe(changed(paths.target, {hasChanged: changed.compareSha1Digest}))
            .pipe(gulp.dest(paths.target));
    }
}

//copy over html
gulp.task('build-html', function() {
    gulp.src(paths.html, { base: paths.base })
        .pipe(clip())
        .pipe(changed(paths.target, {hasChanged: changed.compareSha1Digest}))
        .pipe(gulp.dest(paths.target));
});

//minify and concat all js
gulp.task('build-js', buildJs(false));
gulp.task('build-js-debug', buildJs(true));
function buildJs(debug) {
    return function() {
        gulp.src(paths.js)
            .pipe(clip())
            .pipe(sourcemaps.init())
            .pipe(ngAnnotate())
            .pipe(gulpif(!debug, uglify()))
            .pipe(concat('bundle.js'))
            .pipe(changed(paths.target, {hasChanged: changed.compareSha1Digest}))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(paths.target));
    }
}

//minify and concat all css
gulp.task('build-css', function() {
    gulp.src(paths.css)
        .pipe(clip())
        .pipe(minifyCSS({keepBreaks: true}))
        .pipe(concat('bundle.css'))
        .pipe(changed(paths.target, {hasChanged: changed.compareSha1Digest}))
        .pipe(gulp.dest(paths.target));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
    gulp.watch(paths.index_html, ['build-index-livereload']);
    gulp.watch(paths.html, ['build-html']);
    gulp.watch(paths.js, ['build-js-debug']);
    gulp.watch(paths.css, ['build-css']);

    livereload.listen();
    gulp.watch(paths.target + '/**').on('change', livereload.changed);
});

gulp.task('server', function() {
    //start server
    require('./server/server.js');
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['server', 'watch', 'build-index-livereload', 'build-html', 'build-js-debug', 'build-css']);
gulp.task('build', ['build-index', 'build-html', 'build-js', 'build-css']);