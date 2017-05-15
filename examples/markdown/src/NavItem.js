module.exports = NavItem;

function NavItem( $el ) {

  var $title = $el.find( '.title' );

  $el.on( 'update', function () {
    var data = $el.data( 'item' );
    $title.ftext( data.title ).attr( 'href', '/' + data.id );
    $el.classes( {
      active: data.active
    } );
  } );

}
