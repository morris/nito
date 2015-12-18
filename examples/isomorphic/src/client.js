var $ = require( './dollar' );
var App = require( './App' );

App.mount( '#app', null, $( '#app' ).data( 'shared' ) );
