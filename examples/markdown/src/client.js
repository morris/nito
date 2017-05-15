window.$ = require( 'jquery' );
require( '../../../' )( window );

var App = require( './App' );

$( '#main' ).mount( '.app', App ).append( $( '#templates .app' ) );
