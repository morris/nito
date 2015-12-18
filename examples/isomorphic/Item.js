var $ = require( './dollar' );

module.exports = $.nito( {

  base: [
    '<div class="item">',
      '<h2 class="title"></h2>',
      '<p class="description"></p>',
    '</div>'
  ],

  mount: function ( env ) {

  },

  update: function ( data ) {
    if ( data ) this.data = data;

    this.$el.weld( data );
  }

} );
