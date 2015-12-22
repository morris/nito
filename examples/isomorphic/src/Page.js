var $ = require( './dollar' );
var marked = require( 'marked' );

module.exports = $.nito( {

  base: [
    '<div class="page">',
      '<h2 class="title"></h2>',
      '<div class="body"></div>',
    '</div>'
  ],

  mount: function ( app ) {
    this.app = app;

    this.on( 'click', '.remove', this.remove );
  },

  update: function ( data ) {
    if ( data ) this.data = data;

    this.$el.weld( {
      title: this.data.title,
      body: marked( this.data.body )
    } );
  },

  remove: function () {
    this.app.remove( this.data );
  }

} );
