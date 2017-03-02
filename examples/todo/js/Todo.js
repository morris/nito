var Todo = $.nito( {

  base: [
    '<div class="todo">',
      '<nav class="navbar navbar-default">',
        '<ul class="nav navbar-nav">',
          '<li data-ref="nav"><a href="#/">All</a></li>',
          '<li data-ref="nav"><a href="#/active">Active</a></li>',
          '<li data-ref="nav"><a href="#/completed">Completed</a></li>',
        '</ul>',
        '<p class="navbar-text" data-ref="left"></p>',
        '<p class="navbar-form">',
          '<button class="btn btn-primary sort">Sort</button> ',
          '<button class="btn btn-warning clear" data-ref="clear">Clear completed</button>',
        '</p>',
      '</nav>',
      '<div class="line">',
        '<div class="check">&gt;</div>',
        '<input type="text" class="block add" placeholder="What needs to be done?" autofocus>',
      '</div>',
      '<ul class="items" data-ref="items"></ul>',
    '</div>'
  ],

  mount: function () {

    this.load();

    this.on( 'keydown', 'input.add', function ( e ) {

      var input = e.target;

      switch ( e.which ) {
      case ESCAPE_KEY:
        e.preventDefault();
        input.value = '';
        break;

      case ENTER_KEY:
        this.add( input.value );

        e.preventDefault();
        input.value = '';
        break;

      }

    } );

    this.on( 'click', '.sort', this.sort );
    this.on( 'click', '.clear', this.clear );

    $( window ).on( 'hashchange', this.update.bind( this ) );

  },

  update: function () {

    this.store();
    this.route();

    // $el.nest reconciles with existing DOM
    this.$items.nest( TodoItem, this.items, this );

    var left = this.left().length;
    var items = left === 1 ? 'item' : 'items';

    this.$left.fhtml( '<strong>' + left + '</strong> ' + items + ' left' );
    this.$clear.classes( { hidden: left === this.data.items.length } );

    var action = this.action;

    this.$nav.each( function () {
      $( this ).classes( {
        active: $( this ).find( 'a' ).attr( 'href' ).slice( 2 ) === action
      } );
    } );

  },

  route: function () {

    // routing
    this.action = location.hash.slice( 2 );

    switch ( this.action ) {

    case 'active':
      this.items = this.left();
      break;

    case 'completed':
      this.items = this.completed();
      break;

    default:
      this.items = this.data.items;

    }

  },

  // move these into a "store". if you must...

  add: function ( title ) {

    title = title.trim();
    if ( title.length === 0 ) return;

    this.data.items.push( {
      id: this.data.nextId,
      title: title,
      completed: false
    } );
    ++this.data.nextId;
    this.update();

  },

  check: function ( item, completed ) {
    item.completed = completed;
    this.update();
  },

  destroy: function ( item ) {
    var items = this.data.items;
    items.splice( items.indexOf( item ), 1 );
    this.update();
  },

  title: function ( item, title ) {
    item.title = title;
    this.update();
  },

  sort: function () {

    this.data.items.sort( function ( a, b ) {
      return a.title.localeCompare( b.title );
    } );
    this.update();

  },

  clear: function () {
    this.data.items = this.left();
    this.update();
  },

  left: function () {

    return this.data.items.filter( function ( item ) {
      return !item.completed;
    } );

  },

  completed: function () {

    return this.data.items.filter( function ( item ) {
      return item.completed;
    } );

  },

  // persistence

  load: function () {
    try {
      this.data = JSON.parse( localStorage.todo );
    } catch ( ex ) {}

    // default data
    this.data = this.data || {
      items: [],
      nextId: 1
    };
  },

  store: function () {
    try {
      localStorage.todo = JSON.stringify( this.data );
    } catch ( ex ) {}
  }

} );

var ENTER_KEY = 13;
var ESCAPE_KEY = 27;
