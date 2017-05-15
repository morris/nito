var marked = require( 'marked' );

module.exports = Page;

function Page( $el ) {

  console.log( 'mount Page' );

  var $inputs = $el.find( '.input' );

  $el.on( 'click', '.edit', function () {
    editing = true;
    $el.update();
  } );

  $el.on( 'click', '.remove', function () {
    $el.dispatch( 'remove-page', $el.data( 'item' ) );
  } );

  $el.on( 'click', '.save', function () {
    editing = false;
    $el.dispatch( 'save-page', $inputs.serializeData() );
  } );

  $el.on( 'update', function () {
    console.log( 'update Page' );

    var data = $el.data( 'item' );
    $el.classes( {
      editing: editing,
      notEditing: !editing
    } );
    $title.ftext( data.title );
    $body.fhtml( marked( data.body ) );
    $inputs.fill( data );
  } );

}
