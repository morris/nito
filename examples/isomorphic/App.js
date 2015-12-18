var $ = require( './dollar' );
var Item = require( './Item' );

var App = module.exports = $.nito( {

  base: [
    '<div class="app">',
      '<h1 class="title">test</h1>',
      '<p><button>Randomize</button></p>',
      '<div class="items">',
      '</div>',
    '</div>'
  ],

  mount: function ( env ) {
    this.data = {
      title: 'Test',
      items: [
        {
          title: 'Item1',
          description: 'Lorem ipsum'
        },
        {
          title: 'Item2',
          description: 'Dolor sit'
        },
        {
          title: 'Item3',
          description: 'Amet'
        }
      ]
    }
  },

  update: function ( data ) {
    if ( data ) this.data = data;

    this.$el.weld( { title: this.data.title } );
    this.find( '.items' ).loop( this.data.items, Item, this );
  },

  randomize: function () {

  }

} );
