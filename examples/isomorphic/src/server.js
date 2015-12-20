var fs = require( 'fs' );
var express = require( 'express' );
var App = require( './App' );

var index = fs.readFileSync( 'views/index.html' ).toString();

var init = {
  title: 'foo',
  items: [
    { title: 'Lorem', description: 'Ipsum' },
    { title: 'Dolor', description: 'Sit' },
    { title: 'Amet', description: 'Lol' }
  ]
};

// express
var server = express();

server.get( '/', function ( req, res ) {
  res.end( index.replace( '<!--APP-->', App.deliver( null, init ) ) );
} );

server.use( express.static( '.' ) );

server.listen( 3000 );
