var $ = require( './dollar' );

module.exports = $.nito( {

  base: [
    '<div class="nav-item">',
      '<span class="title"></span>',
    '</div>'
  ],

  mount: function ( app ) {
    this.app = app;

    this.on( 'click', function () {
      this.app.show( this.data );
    } );
  },

  update: function ( data ) {
    if ( data ) this.data = data;
    this.$el.weld( this.data );
  }

} );
