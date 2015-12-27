var nito = require( '../../../nito' );
var jQuery = require( 'jquery' );

if ( process.browser ) {
	module.exports = nito( window, jQuery );
} else {
	var win = require( 'dom' + 'ino' ).createWindow();
	module.exports = nito( win, jQuery( win ) );
}
