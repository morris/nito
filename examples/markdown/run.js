var fs = require( 'fs' );
var browserify = require( 'browserify' );

var b = browserify( './src/client.js', { debug: true } );
b.bundle().pipe( fs.createWriteStream( 'js/bundle.js' ) )
  .on( 'finish', function () {
    console.log( 'browserified' );
  } );

require( './src/server' );
