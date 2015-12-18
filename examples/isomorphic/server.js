var http = require( 'http' );
var fs = require( 'fs' );

var App = require( './App' );

App.create();

http.createServer( function ( req, res ) {
  res.end( App.create().$el.html() );
} ).listen( 3000 );

//var $ = require( './dollar' );
//console.log( $( '<div></div>' ) );
