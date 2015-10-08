var babel = require( "babel" );

module.exports = function ( wallaby ) {
    return {
        files: [
           { pattern: "dist/js/vendor/jQuery.js", instrumant: false },
            "src/js/*.js"
        ],

        tests: [
          "tests/spec/*.spec.js"
        ],
        compilers: {
            '**/*.js': wallaby.compilers.babel( {
                babel: babel,
                // other babel options
                stage: 0    // https://babeljs.io/docs/usage/experimental/
            } )
        }
    };
};