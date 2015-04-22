// Karma configuration
// Generated on Wed Jul 30 2014 16:53:01 GMT+0900 (JST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'expect'],


    // list of files / patterns to load in the browser
    files: [
        'spec/fixtures/*.*',
        {
            pattern: 'bower_components/jquery/dist/jquery.min.js'
        },
        {
            pattern: 'src/js/*.js'
        },
        {
            pattern: 'spec/*.js'
        }
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        'spec/fixtures/*.html': ['html2js'],
        'spec/fixtures/*.json': ['json_fixtures']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    customLaunchers: {
        IE11: {
            base: 'IE',
            'x-ua-compatible': 'IE=EmulateIE11'
        },
        IE10: {
            base: 'IE',
            'x-ua-compatible': 'IE=EmulateIE10'
        },
        IE9: {
            base: 'IE',
            'x-ua-compatible': 'IE=EmulateIE9'
        },
        IE8: {
            base: 'IE',
            'x-ua-compatible': 'IE=EmulateIE8'
        }
    },

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: (function(os) {
        var _browsers = [
                'PhantomJS',
                // 'Chrome',
                // 'ChromeCanary',
                // 'Firefox',
                // 'Safari'
            ],
            _ies = [
                'IE8',
                'IE9',
                'IE10',
                'IE11'
            ];
        
        if (os === 'win32') {
            _browsers = _browsers.concat(_ies);
        }

        return _browsers;

    })(require('os').platform()),

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
