/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/

var gulp = require('gulp');
var gp_clean = require('gulp-clean');
var gp_concat = require('gulp-concat');
var gp_sourcemaps = require('gulp-sourcemaps');
var gp_typescript = require('gulp-typescript');
var gp_uglify = require('gulp-uglify');

// Define paths
var srcPaths = {
    app: ['Scripts/app/main.ts', 'Scripts/app/**/*.ts'],
    js: ['Scripts/js/**/*.js']
};

var destPaths = {
    app: 'wwwroot/app/',
    js: 'wwwroot/js/'
};

// Task to compile, minify and create sourcemaps for all TypeScript files and place 
// them in wwwroot/app together with their js.map files.
gulp.task('app', ['app_clean'], function() {
    return gulp.src(srcPaths.app)
        .pipe(gp_sourcemaps.init())
        .pipe(gp_typescript(require('./tsconfig.json').compilerOptions))
        .pipe(gp_uglify({ mangle: false }))
        .pipe(gp_sourcemaps.write('/'))
        .pipe(gulp.dest(destPaths.app));
});

// Task to delete wwwroot/app contents
gulp.task('app_clean', function() {
    return gulp.src(destPaths.app + "*", { read: false })
        .pipe(gp_clean({ force: true }));
});

// Task to copy all JS files from external libraries to wwwroot/js.
gulp.task('js', function() {
    return gulp.src(srcPaths.js)
        //.pipe(gp_uglify({ mangle: false })) // disable uglify
        //.pipe(gp_concat('all-js.min.js')) // disable concat
        .pipe(gulp.dest(destPaths.js));
});

// Task to delete wwwroot/js contents.
gulp.task('js_clean', function() {
    return gulp.src(destPaths.js + "*", { read: false })
        .pipe(gp_clean({ force: true }));
});

// Task to watch specified files and define what to do upon file changes.
gulp.task('watch', function() {
    gulp.watch([srcPaths.app, srcPaths.js], ['app', 'js']);
});

// Task for global cleanup
gulp.task('cleanup', ['app_clean', 'js_clean']);

// Default task that launches all other tasks.
gulp.task('default', ['app', 'js', 'watch']);