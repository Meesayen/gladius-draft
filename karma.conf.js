module.exports = function(config) {
  config.set({
    basePath: 'src/',
    frameworks: ['mocha', 'chai', 'browserify'],
    files: [
      'temp/vendor/*.js',
      'temp/core/polyfills.js',
      'temp/mock/server.js',
      'temp/**/*.test.js',
      '../views/**/*.hbs',
      { pattern: 'temp/**/*.js',
        included: false },
      { pattern: 'temp/**/*.es6',
        included: false }
    ],
    preprocessors: {
      'temp/mock/server.js': ['browserify'],
      'temp/**/*.test.js': ['browserify'],
      '../**/*.hbs': 'handlebars'
    },
    browserify: {
      basedir: 'src/'
      // watch: true
    },
    handlebarsPreprocessor: {
      templates: "Handlebars.templates"
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
