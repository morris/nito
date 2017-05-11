function NitoDashboard() {

  var $el = $( this );
  var store = $el.data( 'store' );

  $el.on( 'update', function () {
    $el.nest( store.data );
  } );

}

function NitoItem() {

  var $el = $( this );
  var $name = $el.find( '.name' );
  var $score = $el.find( '.score' );

  $el.on( 'update', function () {
    var item = $el.data( 'item' );
    $name.ftext( item.name );
    $score.ftext( item.score );
    $el.css( 'color', item.color );
  } );

}
