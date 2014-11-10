module.exports = function(config) {
  config.set({
    basePath: 'src/',
    frameworks: ['mocha', 'chai', 'browserify'],
    files: [
      'scripts/vendor/*.js',
      '../public/js/templates.js',
      'scripts/mock/server.es6.js',
      'scripts/**/*.test.es6.js',
      { pattern: 'scripts/**/*.js',
        included: false },
      { pattern: 'scripts/**/*.es6.js',
        included: false }
    ],
    preprocessors: {
      'scripts/mock/server.es6.js': ['browserify'],
      'scripts/**/*.test.es6.js': ['browserify']
    },
    browserify: {
      transform: [
        // Hacking the way karma-bro injects transforms to pass options to
        // the esnextify transform.
        [{fileExt: '.es6.js'}, 'esnextify']
      ],
      basedir: 'src/'
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
