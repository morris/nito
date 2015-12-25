var browserify = require( 'browserify' );
var fs = require( 'fs' );
var express = require( 'express' );
var App = require( './App' );

var index = fs.readFileSync( 'views/index.html' ).toString();

var server = express();

server.get( '/', function ( req, res ) {
	res.end( index.replace( '<!-- APP -->', App.deliver() ) );
} );

server.use( express.static( '.' ) );

server.listen( 3000 );
