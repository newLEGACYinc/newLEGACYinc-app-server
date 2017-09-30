module.exports = function( grunt ) {
	grunt.initConfig( {
		jscs: {
			src: [ 'Gruntfile.js', 'test/**/*.js', 'src/**/*.js' ],
			options: {
				config: '.jscsrc',
				fix: false
			}
		},
		jshint: {
			files: [ 'Gruntfile.js', 'test/**/*.js', 'src/**/*.js' ],
			options: {
				'esversion': 6
			}
		},
		pkg: grunt.file.readJSON( 'package.json' )
	} );

	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-jscs' );

	grunt.registerTask( 'travis', [ 'test' ] );
	grunt.registerTask( 'test', [ 'jshint', 'jscs' ] );
};
