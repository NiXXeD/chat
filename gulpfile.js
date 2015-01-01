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
var karma = require('karma');
var mocha = require('gulp-spawn-mocha');

var paths = {
    target: './build',
    coverage: './coverage',
    client: {
        base: './src/main/client',
        js: ['./node_modules/socket.io/node_modules/socket.io-client/socket.io.js',
            './node_modules/angular/angular.js',
            './node_modules/angular-sanitize/angular-sanitize.js',
            './node_modules/angular-local-storage/dist/angular-local-storage.js',
            './node_modules/marked/lib/marked.js',
            './src/main/client/app.js',
            './src/main/client/**/*.js'],
        css: './src/main/client/style.css',
        index_html: './src/main/client/index.html',
        html: ['./src/main/client/**/*.html', '!./src/main/client/index.html']
    },
    server: {
        js: './src/main/server/**',
        js_test: './src/test/server/**'
    }
};

//clean up old build
gulp.task('clean', function clean(callback) {
    del([paths.target, paths.coverage], callback);
});

//copy over index.html with livereload if in debug
gulp.task('build-index', buildIndex(false));
gulp.task('build-index-livereload', buildIndex(true));
function buildIndex(debug) {
    return function() {
        gulp.src(paths.client.index_html, { base: paths.client.base })
            .pipe(gulpif(debug, injectReload()))
            .pipe(changed(paths.target, {hasChanged: changed.compareSha1Digest}))
            .pipe(gulp.dest(paths.target));
    }
}

//copy over html
gulp.task('build-html', function() {
    gulp.src(paths.client.html, { base: paths.client.base })
        .pipe(clip())
        .pipe(changed(paths.target, {hasChanged: changed.compareSha1Digest}))
        .pipe(gulp.dest(paths.target));
});

//minify and concat all js
gulp.task('build-js', buildJs(false));
gulp.task('build-js-debug', buildJs(true));
function buildJs(debug) {
    return function() {
        gulp.src(paths.client.js)
            .pipe(clip())
            .pipe(gulpif(!debug,sourcemaps.init()))
            .pipe(ngAnnotate())
            .pipe(gulpif(!debug, uglify()))
            .pipe(concat('bundle.js'))
            .pipe(changed(paths.target, {hasChanged: changed.compareSha1Digest}))
            .pipe(gulpif(!debug, sourcemaps.write('.')))
            .pipe(gulp.dest(paths.target));
    }
}

//minify and concat all css
gulp.task('build-css', function() {
    gulp.src(paths.client.css)
        .pipe(clip())
        .pipe(minifyCSS({keepBreaks: true}))
        .pipe(concat('bundle.css'))
        .pipe(changed(paths.target, {hasChanged: changed.compareSha1Digest}))
        .pipe(gulp.dest(paths.target));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
    gulp.watch(paths.client.index_html, ['build-index-livereload']);
    gulp.watch(paths.client.html, ['build-html']);
    gulp.watch(paths.client.js, ['build-js-debug']);
    gulp.watch(paths.client.css, ['build-css']);

    livereload.listen();
    gulp.watch(paths.target + '/**').on('change', livereload.changed);
});

gulp.task('server', function() {
    //start server
    require('./');
});

gulp.task('test-client', function(done) {
    karma.server.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: false,
        autoWatch: true
    });
    done();
});

gulp.task('watch-test-server', function() {
    gulp.watch(paths.server.js, ['test-server']);
    gulp.watch(paths.server.js_test, ['test-server']);
});

gulp.task('test-server', function() {
    gulp.src(paths.server.js_test)
        .pipe(mocha({
            require: './src/test/server/testHelper.js',
            reporter: 'dot',
            istanbul: true
        }))
        .on('error', function() {
            this.emit('end');
        });
});

gulp.task('test', ['test-client', 'watch-test-server', 'test-server']);
gulp.task('default', ['server', 'watch', 'build-index-livereload', 'build-html', 'build-js-debug', 'build-css']);
gulp.task('build', ['build-index', 'build-html', 'build-js', 'build-css']);