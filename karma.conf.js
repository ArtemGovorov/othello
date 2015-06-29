// Karma configuration
// Generated on Mon Jun 29 2015 16:38:35 GMT-0400 (Eastern Daylight Time)

module.exports = function ( config ) {
    config.set( {

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: [ 'jasmine' ],


        // list of files / patterns to load in the browser
        files: [
            'src/js/**/*.js',
            'tests/**/*.spec.js'
        ],


        // list of files to exclude
        exclude: [
            'src/js/vendor/**/*.js'
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'src/js/**/*.js': [ 'babel' ]
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: [ 'progress' ],

        babelPreprocessor: {
            options: {
                sourceMap: 'inline'
            },
            filename: function ( file ) {
                return file.originalPath.replace( /\.js$/, '.es5.js' );
            },
            sourceFileName: function ( file ) {
                return file.originalPath;
            }
        },


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [ 'Chrome' ],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    } )
}
