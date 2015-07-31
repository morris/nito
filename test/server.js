var domino = require( 'domino' );
var window = domino.createWindow( '<h1>Hello world</h1>' );

var $ = require( 'jquery' )( window );
require( '../' )( window, $ );

var Comp = $.nito( {} );

console.log( Comp );
