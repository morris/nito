function NitoDashboard( $el ) {

  var store = $el.data( 'store' );

  $el.on( 'update', function () {
    $el.nest( store.get() );
  } );

}

function NitoItem( $el ) {

  var $name = $el.find( '.name' );
  var $score = $el.find( '.score' );

  $el.on( 'update', function () {
    var item = $el.data( 'item' );
    $name.ftext( item.name );
    $score.ftext( item.score );
    $el.css( 'color', item.color );
  } );

}
