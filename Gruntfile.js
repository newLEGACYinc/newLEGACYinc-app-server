module.exports = function( grunt ) {
	grunt.initConfig( {
		coveralls: {
			src: 'coverage/*.info'
		},
		jscs: {
			src: [ 'Gruntfile.js', 'test/**/*.js', 'src/**/*.js' ],
			options: {
				config: '.jscsrc',
				fix: false
			}
		},
		jshint: {
			files: [ 'Gruntfile.js', 'test/**/*.js', 'src/**/*.js' ]
		},
		mochaTest: {
			test: {
				src: [ 'test/**/index.js' ]
			}
		},
		pkg: grunt.file.readJSON( 'package.json' ),
		shell: {
			coverage: {
				command: 'istanbul cover --hook-run-in-context --include-all-sources ./node_modules/mocha/bin/_mocha test/**/index.js -- -R spec'
			}
		}
	} );

	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-coveralls' );
	grunt.loadNpmTasks( 'grunt-mocha-test' );
	grunt.loadNpmTasks( 'grunt-jscs' );
	grunt.loadNpmTasks( 'grunt-shell' );

	grunt.registerTask( 'coverage', 'shell:coverage' );
	grunt.registerTask( 'travis', [ 'test', 'coverage', 'coveralls' ] );
	grunt.registerTask( 'test', [ 'jshint', 'jscs', 'mochaTest' ] );
};
