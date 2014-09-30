module.exports = function(config) {
  config.set({
    basePath: 'src/',
    frameworks: ['mocha', 'chai', 'browserify'],
    files: [
      'scripts/vendor/*.js',
      'scripts/mock/server.es6',
      'scripts/**/*.test.es6',
      '../views/**/*.hbs',
      { pattern: 'scripts/**/*.js',
        included: false },
      { pattern: 'scripts/**/*.es6',
        included: false }
    ],
    preprocessors: {
      'scripts/mock/server.es6': ['browserify'],
      'scripts/**/*.test.es6': ['browserify'],
      '../**/*.hbs': 'handlebars'
    },
    browserify: {
      // debug: true,
      // watch: true,
      transform: ['esnextify'],
      basedir: 'src/'
    },
    handlebarsPreprocessor: {
      templates: 'Handlebars.templates'
    },
    colors: true,
    reporters: ['mocha'],
    port: 9876,
    logLevel: config.LOG_INFO,
    // browsers: ['Chrome'],
    browsers: ['PhantomJS'],
    singleRun: true,
    autoWatch: true
  });
};
