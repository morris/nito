var gulp = require( 'gulp' );
var jshint = require( 'gulp-jshint' );
var uglify = require( 'gulp-uglify' );
var rename = require( 'gulp-rename' );

gulp.task( 'default', [ 'build' ] );

gulp.task( 'watch', [ 'build' ], function () {

  gulp.watch( 'nito.js', [ 'build' ] );

} );

gulp.task( 'build', [ 'lint' ], function () {

  return gulp.src( 'nito.js' )
    .pipe( uglify( { preserveComments: 'some' } ) )
    .pipe( rename( 'nito.min.js' ) )
    .pipe( gulp.dest( '.' ) );

} );

gulp.task( 'lint', function () {

  return gulp.src( 'nito.js' )
    .pipe( jshint() )
    .pipe( jshint.reporter( 'default' ) );

} );
