var $ = require( './dollar' );
var Item = require( './Item' );

var App = module.exports = $.nito( {

  base: [
    '<div class="app" id="app">',
      '<h1 class="title">test</h1>',
      '<p><button>Randomize</button></p>',
      '<div class="items">',
      '</div>',
    '</div>'
  ],

  mount: function ( env ) {
    this.find( '.item' ).mount( Item, this );
  },

  update: function ( data ) {
    if ( data ) this.data = data;

    this.$el.weld( { title: this.data.title } );
    this.find( '.items' ).loop( this.data.items, Item, this );
  },

  randomize: function () {

  },

  html: function () {
    return this.$el.data( 'shared', this.data ).html();
  }

} );
