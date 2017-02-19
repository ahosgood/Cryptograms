const gulp = require( 'gulp' ),
	babel = require( 'gulp-babel' ),
	sass = require( 'gulp-sass' );

gulp.task( 'js', () =>
	gulp.src( './src/js/app.js' )
		.pipe( babel( {
			presets: ['es2015']
		} ) )
		.pipe( gulp.dest( 'resources' ) )
);

gulp.task( 'js:watch', function() {
	gulp.watch( './src/js/**/*.js', ['js'] );
} );

gulp.task( 'css', function() {
	return gulp.src( './src/scss/**/*.scss' )
		.pipe( sass( { outputStyle: 'compressed' } ).on( 'error', sass.logError ) )
		.pipe( gulp.dest( './resources' ) );
} );

gulp.task( 'css:watch', function() {
	gulp.watch( './src/css/**/*.scss', ['css'] );
} );

gulp.task( 'dev', ['default', 'css:watch', 'js:watch'] );

gulp.task( 'default', ['js', 'css'] );