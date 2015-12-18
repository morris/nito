var fs = require( 'fs' );
var express = require( 'express' );
var $ = require( './dollar' );
var App = require( './App' );

var app = App.create( null, {
  title: 'foo',
  items: [
    { title: 'Lorem', description: 'Ipsum' },
    { title: 'Dolor', description: 'Sit' },
    { title: 'Amet', description: 'Lol' },
  ]
} );

var index = fs.readFileSync( 'views/index.html' ).toString();
var server = express();

server.get( '/', function ( req, res ) {
  res.end( index.replace( '<!--APP-->', app.$el.html() ) );
} );

server.use( express.static( '.' ) );

server.listen( 3000 );
