/**
 * Created by john on 3/22/15.
 */

'use strict';


var autoprefix = require('gulp-autoprefixer');
var bower = require('main-bower-files');
var concat = require('gulp-concat');
var del = require('del');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var nodemon = require('gulp-nodemon');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');

var source = require('vinyl-source-stream');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var watchify = require('watchify');

var gutil = require('gulp-util');
var uglifyify = require('uglifyify');


var getBundleName = function () {
    var version = require('./package.json').version;
    var name = require('./package.json').name;
    return version + '.' + name + '.' + 'min';
};


var outDir = './public/';

var paths = {
    server: {
        src: ['src/server/**/*.js']
    },

    app: {
        js: {
            src: ['src/client/**/*.js'],
            //out: 'application.js'
            out: getBundleName() + '.js'
        },
        less: {
            src: ['less/**/*.less'],
            out: 'styles.css'
        }
    },

    vendor: {
        js: {
            src: [],
            out: 'vendor.js'
        },
        css: {
            out: 'vendor-styles.css'
        }
    }
};


gulp.task('compile-less', function () {
    return gulp.src(paths.app.less.src)
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(less())
        .pipe(concat(paths.app.less.out))
        .pipe(autoprefix('last 2 versions'))
        .pipe(gulp.dest(outDir));
});


gulp.task('clean', function () {
    return del(outDir + paths.app.js.out);
});


gulp.task('clean-vendor', function () {
    return del(outDir + paths.vendor.js.out);
});


gulp.task('lint', function () {
    return gulp.src(paths.app.js.src)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


gulp.task('lint-server', function () {
    return gulp.src(paths.server.src)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


function bundle() {

}
//
//gulp.task('scripts', ['clean', 'lint'], function () {
//    //return gulp.src(paths.app.js.src)
//    //    .pipe(plumber({
//    //        handleError: function (err) {
//    //            console.log(err);
//    //            this.emit('end');
//    //        }
//    //    }))
//    //    .pipe(sourcemaps.init())
//    //    .pipe(ngAnnotate())
//    //    .pipe(concat(paths.app.js.out))
//    //    .pipe(sourcemaps.write())
//    //    .pipe(gulp.dest(outDir));
//
//
//    bundler.on('update', bundle);
//
//    return bundle();
//});

gulp.task('browserify', ['clean', 'lint'], function () {

    var bundler = browserify({
        entries: ['./src/client/main.js'],
        debug: true
    });

    //var bundler = watchify(browserify({
    //    entries: ['./src/client/main.js'],
    //    debug: true
    //}));
    bundler
        //.transform(notatify)
        //.transform(uglifyify)
        .on('update', function () {
            gutil.log("Rebundling...");
            rebundle();
        });

    function rebundle() {
        return bundler
            .bundle()
            .on('error', gutil.log.bind(gutil, 'Browserify Error'))
            .on('end', gutil.log.bind(gutil, 'Completed'))
            //.pipe(plumber({
            //    handleError: function (err) {
            //        console.log(err);
            //        this.emit('end');
            //    }
            //}))
            .pipe(source(getBundleName() + '.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            // Add transformation tasks to the pipeline here.
            //.pipe(uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./public/js/'));
    }

    return rebundle();

});

gulp.task('vendor-scripts', ['clean-vendor'], function () {
    return gulp.src(bower().concat(paths.vendor.js.src))
        .pipe(uglify())
        .pipe(concat(paths.vendor.js.out))
        .pipe(gulp.dest(outDir + 'js'));
});


gulp.task('nodemon', function () {
    nodemon({
        script: 'serverApp.js'
    })
        .on('change', ['lint-server'])
        .on('restart', function () {
            console.log('restarted!')
        })
});


gulp.task('watch', [], function () {
    gulp.watch(paths.app.less.src, ['compile-less']);
    //gulp.watch(paths.app.js.src, ['scripts']);
    gulp.watch(paths.app.js.src, ['browserify']);
});


gulp.task('default', ['browserify', 'compile-less', 'nodemon']);