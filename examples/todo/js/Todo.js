function Todo() {

  var $el = $( this );
  var $items = $el.find( '> .items' );
  var $left = $el.find( '.left' );
  var $clear = $el.find( '.clear' );
  var $nav = $el.find( '.nav' );

  var data;
  var items;
  var action;

  $el.data( 'store', {
    add: add,
    check: check,
    title: title,
    sort: sort,
    clear: clear,
    destroy: destroy
  } );

  $el.on( 'keydown', 'input.add', function ( e ) {

    var input = e.target;

    switch ( e.which ) {
    case ESCAPE_KEY:
      e.preventDefault();
      input.value = '';
      break;
    case ENTER_KEY:
      add( input.value );
      e.preventDefault();
      input.value = '';
      break;
    }

  } );

  $el.on( 'click', '.sort', sort );
  $el.on( 'click', '.clear', clear );

  $( window ).on( 'hashchange', update );

  load();
  update();

  function update() {

    store();
    route();

    $el.find( '.item' ).mount( TodoItem );
    $items.nest( items );

    var l = left().length;
    var i = left === 1 ? 'item' : 'items';

    $left.fhtml( '<strong>' + l + '</strong> ' + i + ' left' );
    $clear.classes( { hidden: l === data.items.length } );

    $nav.each( function () {
      $( this ).classes( {
        active: $( this ).find( 'a' ).attr( 'href' ).slice( 2 ) === action
      } );
    } );

  }

  // routing

  function route() {

    action = location.hash.slice( 2 );

    switch ( action ) {
    case 'active':
      items = left();
      break;
    case 'completed':
      items = completed();
      break;
    default:
      items = data.items;
    }

  }

  // store

  function add( title ) {
    title = title.trim();
    if ( title.length === 0 ) return;

    data.items.push( {
      id: data.nextId,
      title: title,
      completed: false
    } );
    ++data.nextId;
    update();
  }

  function check( item, completed ) {
    item.completed = completed;
    update();
  }

  function destroy( item ) {
    var items = data.items;
    items.splice( items.indexOf( item ), 1 );
    update();
  }

  function title( item, title ) {
    item.title = title;
    update();
  }

  function sort() {
    data.items.sort( function ( a, b ) {
      return a.title.localeCompare( b.title );
    } );
    update();
  }

  function clear() {
    data.items = left();
    update();
  }

  function left() {
    return data.items.filter( function ( item ) {
      return !item.completed;
    } );
  }

  function completed() {
    return data.items.filter( function ( item ) {
      return item.completed;
    } );
  }

  // persistence

  function load() {
    try {
      data = JSON.parse( localStorage.todo );
    } catch ( ex ) {}

    // default data
    data = data || {
      items: [],
      nextId: 1
    };
  }

  function store() {
    try {
      localStorage.todo = JSON.stringify( data );
    } catch ( ex ) {}
  }

}

var ENTER_KEY = 13;
var ESCAPE_KEY = 27;
