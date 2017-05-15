var fs = require( 'fs' );
var path = require( 'path' );
var express = require( 'express' );
var domino = require( 'domino' );
var jQuery = require( 'jquery' );
var nito  = require( '../../../' );
var App = require( './App' );

var index = fs.readFileSync( 'views/index.html' );

var app = express();

console.log( require.resolve( 'bootstrap' ) );

app.use( '/', express.static( '.' ) );
app.use( '/', express.static(
  path.dirname( path.dirname( require.resolve( 'bootstrap' ) ) )
) );

app.get( '/*', function ( req, res, next ) {

  var window = domino.createWindow( index, req.url );
  var $ = nito( window, jQuery( window ) );

  fs.readFile( 'data.json', function ( err, json ) {
    if ( err ) return next( err );

    $( '#main' )
      .data( 'wakeup', JSON.parse( json ) )
      .mount( '.app', App )
      .append( $( '#templates .app' ) );

    console.log( $.mountScopes );

    $( '.app' ).dispatch( 'create-page' );

    $.nextFrame( function () {
      var data = JSON.parse( json );
      res.end( window.document.innerHTML );
    } );
  } );
} );

// persistence
app.post( '/', function ( req, res, next ) {
  var data = fs.createWriteStream( 'data.json' );
  req.pipe( data ).on( 'finish', function () {
    res.set( 'Content-Type', 'application/json' ).end( '{ ok: true }' );
  } ).on( 'error', next );
} );

var server = app.listen( process.env.PORT || 3000 ).on( 'listening', function () {
  console.log( 'See http://localhost:' + server.address().port );
} );
