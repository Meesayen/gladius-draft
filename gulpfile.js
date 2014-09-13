var
  gulp   = require('gulp'),
  clean   = require('gulp-rimraf'),
  cache = require('gulp-cached'),
  jshint = require('gulp-jshint'),
  esnext = require('gulp-esnext'),
  nextModule = require('gulp-es6-module-transpiler'),
  rename   = require('gulp-rename'),
  less   = require('gulp-less'),
  karma  = require('gulp-karma'),
  uglify = require('gulp-uglify'),
  replace = require('gulp-replace'),
  livereload = require('gulp-livereload'),
  autoprefix = require('gulp-autoprefixer'),
  browserify = require('gulp-browserify'),
  handlebars = require('gulp-handlebars'),
  defineModule = require('gulp-define-module'),
  declare = require('gulp-declare'),
  concat = require('gulp-concat'),
  git = require('gulp-git'),
  bump = require('gulp-bump'),
  tag_version = require('gulp-tag-version'),
  server = require('./app'),
  serverport = 5000,
  lrport = null,
  cleanTmp,
  inc;


/* Helpers ----------------------------------------------------------------- */
cleanTmp = function() {
  gulp.src('src/temp', {read: false})
  .pipe(clean());
};


/*
  CSS TASKS
            */

/* LESS compilation -------------------------------------------------------- */
gulp.task('less', function() {
  return gulp.src(['src/less/**/*.less'])
  .pipe(less({
    compress: true
  }))
  .pipe(autoprefix('last 2 version', 'ie 8', 'ie 9'))
  .pipe(gulp.dest('public/css'));
});


/*
  TEMPLATES TASKS
                  */

/* Handlebars helpers bundling --------------------------------------------- */
gulp.task('publish-helpers', function() {
  return gulp.src(['handlebars.helpers.js'])
  .pipe(uglify())
  .pipe(gulp.dest('public/js/'));
});


/* Handlebars templates precompilation ------------------------------------- */
gulp.task('tpl-precompile', function() {
  return gulp.src(['views/partials/**/*.hbs'])
  .pipe(handlebars())
  .pipe(defineModule('plain'))
  .pipe(declare({
    namespace: 'Handlebars.templates'
  }))
  .pipe(concat('templates.js'))
  .pipe(gulp.dest('public/js/'));
});

/* Handlebars template livereloading --------------------------------------- */
gulp.task('tpl-reload', ['tpl-precompile'], function() {
  return gulp.src([
    'views/**/*.hbs',
    'views/**/*.json'
  ])
  .pipe(livereload(lrport));
});



/*
  SCRIPTS TASKS
                */

/* JS linting -------------------------------------------------------------- */
gulp.task('lint', function() {
  return gulp.src([
    '*.helpers.js',
    'src/scripts/**/*.js',
    'src/scripts/**/*.es6',
    '!src/**/*.es6.js',
    '!src/scripts/vendor/**/*',
    '!src/scripts/mock/lib/**/*'
  ])
  .pipe(jshint({
    lookup: true
  }))
  .pipe(jshint.reporter('jshint-stylish'));
});

/* ES6 Syntax transpilation ------------------------------------------------ */
gulp.task('esnext', ['copy'], function () {
  return gulp.src([
    'src/scripts/*.es6',
    'src/scripts/!(vendor)/*.es6',
  ])
  // .pipe(cache('esnexting'))
  .pipe(esnext())
  .pipe(nextModule({
    type: 'cjs'
  }))

  // Needed to support IE8. Get rid of it ASAP.
  .pipe(replace(/\.catch/g, "['catch']"))
  .pipe(replace(/\.throw/g, "['throw']"))
  .pipe(replace(/\.return/g, "['return']"))

  .pipe(gulp.dest('src/temp'));
});


/* JS modules bundling ----------------------------------------------------- */
gulp.task('bundle-js', ['esnext'], function() {
  return gulp.src([
    'src/temp/pages/**/*.js',
    '!src/temp/pages/**/*.test.js'
  ])
  .pipe(browserify({
    insertGlobals: false,
    debug: !gulp.env.production
  }))
  .pipe(uglify())
  .pipe(gulp.dest('public/js'));
});
gulp.task('bundle-js:dev', ['bundle-mock-server'], function() {
  return gulp.src([
    'src/temp/pages/**/*.js',
    '!src/temp/pages/**/*.test.js'
  ])
  .pipe(browserify({
    insertGlobals: false,
    debug: !gulp.env.production
  }))
  .pipe(gulp.dest('public/js'));
});
gulp.task('bundle-mock-server', ['lint', 'esnext'], function() {
  return gulp.src(['src/temp/mock/server.js'])
  .pipe(browserify({
    insertGlobals: false,
    debug: true
  }))
  .pipe(rename(function (path) {
    path.basename = 'mock-server';
  }))
  .pipe(gulp.dest('public/js'));
});

/* JS unit tests runner ---------------------------------------------------- */
gulp.task('karma', function() {
  return gulp.src([
    'temp/vendor/handlebars.runtime.js',
    'temp/**/*.test.js'
  ])
  .pipe(karma({
    configFile: 'karma.conf.js',
    action: 'run'
  }))
  .on('error', function(/*err*/) {
    // throw err;
  });
});
gulp.task('karma:dev', function() {
  return gulp.src([
    'temp/vendor/handlebars.runtime.js',
    'temp/**/*.test.js'
  ])
  .pipe(karma({
    configFile: 'karma.conf.js',
    action: 'watch'
  }))
  .on('error', function(/*err*/) {
    // throw err;
  });
});


/*
  UTILS
        */

/* Lightweight frontend development server --------------------------------  */
gulp.task('serve', function() {
  server.listen(serverport);
});

gulp.task('copy', function() {
  return gulp.src(['src/scripts/**/*'])
  .pipe(gulp.dest('src/temp'));
});

gulp.task('bundle-js:dev:clean', [
  'bundle-js:dev'
], cleanTmp);

gulp.task('reload', function() {
  gulp.src('public/**/*')
  .pipe(cache('reloading'))
  .pipe(livereload(lrport));
});


/* Watchers ---------------------------------------------------------------- */
gulp.task('watch', ['serve'], function () {
  gulp.watch('handlebars.helpers.js', ['publish-helpers']);
  gulp.watch('src/scripts/**/*.es6', ['bundle-js:dev:clean']);
  gulp.watch('src/scripts/*.js', ['bundle-js:dev:clean']);
  gulp.watch('src/scripts/!(mock)/*.js', ['bundle-js:dev:clean']);
  gulp.watch('src/scripts/mock/*.js', ['lint', 'bundle-js:dev:clean']);
  gulp.watch('src/less/**/*.less', ['less']);
  gulp.watch('views/**/*.hbs', ['tpl-reload']);
  gulp.watch('views/**/*.json', ['tpl-reload']);
  gulp.watch('public/**/*', ['reload']);
});


/* Version bumping --------------------------------------------------------- */
inc = function(importance) {
  return gulp.src(['./package.json'])
  .pipe(bump({type: importance}))
  .pipe(gulp.dest('./'))
  .pipe(git.commit('bumps package version'))
  .pipe(tag_version()) ;
};

gulp.task('patch', function() { return inc('patch'); });
gulp.task('feature', function() { return inc('minor'); });
gulp.task('release', function() { return inc('major'); });


// do not change these tasks unless you really know what you are doing
// they are called by maven during the build process
gulp.task('default', ['development']);

gulp.task('development', [
  'karma:dev',
  'less',
  'bundle-js:dev:clean',
  'publish-helpers',
  'tpl-precompile',
  'watch'
]);

gulp.task('test', [
  'lint',
  'karma'
], cleanTmp);

gulp.task('production', [
  'less',
  'bundle-js',
  'tpl-precompile',
  'publish-helpers'
]);
