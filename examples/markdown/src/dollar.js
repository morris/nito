var nito = require( '../../../nito' );
var jQuery = require( 'jquery' );

if ( process.browser ) {
	module.exports = nito( jQuery );
} else {
	module.exports = nito( jQuery( require( 'dom' + 'ino' ).createWindow() ) );
}
