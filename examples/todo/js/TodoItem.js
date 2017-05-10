function TodoItem() {

  var $el = $( this );
  var $app = $el.closest( '.todo' );
  var store = $app.data( 'store' );
  var $title = $el.find( '.title' );
  var $completed = $el.find( '[name=completed]' );
  var item;
  var editing = false;

  $el.on( 'click', '.check', function ( e ) {
    store.check( item, !item.completed );
  } );

  $el.on( 'dblclick', function ( e ) {
    editing = true;
    update();
    $el.find( '[name=title]' ).val( item.title ).focus();
  } );

  $el.on( 'blur', '[name=title]', function ( e ) {
    editing = false;
    store.title( item, e.target.value.trim() );
  } );

  $el.on( 'keydown', '[name=title]', function ( e ) {

    var input = e.target;

    switch ( e.which ) {
    case ESCAPE_KEY:
      e.preventDefault();
      input.value = item.title;
      $( input ).blur();
      break;
    case ENTER_KEY:
      e.preventDefault();
      $( input ).blur();
      break;
    }

  } );

  $el.on( 'click', '.destroy', function () {
    store.destroy( item );
  } );

  $el.on( 'update', update );

  function update() {

    item = $el.data( 'item' );

    $title.ftext( item.title );
    $el.classes( {
      completed: item.completed,
      editing: editing
    } );
    $completed.fval( item.completed );

  }

}

var $TodoItem = $( '#templates > ul >.item' ).one( 'mount', TodoItem );
