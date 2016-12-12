var browserify = require( 'browserify' );
var fs = require( 'fs' );
var express = require( 'express' );
var App = require( './App' );

var index = fs.readFileSync( 'views/index.html' ).toString();

var server = express();

server.use( express.static( '.' ) );

server.get( '/*', function ( req, res ) {
  fs.readFile( 'data.json', function ( err, json ) {
    var data = err ? null : JSON.parse( json.toString() );
    var html = App.create( data, req ).deliver().outerHtml();
    res.end( index.replace( '<!-- APP -->', html ) );
  } );
} );

// persistence
server.post( '/', function ( req, res ) {
  var data = fs.createWriteStream( 'data.json' );
  req.pipe( data ).on( 'finish', function () {
    res.set( 'Content-Type', 'application/json' ).end( '{ ok: true }' );
  } );
} );

server.listen( 3000, function () {
  console.log( 'http://localhost:3000' );
} );
