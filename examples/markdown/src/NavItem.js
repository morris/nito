var $ = require( './dollar' );

module.exports = $.nito( {

  base: [
    '<li class="nav-item">',
      '<a class="title"></a>',
    '</li>'
  ],

  update: function ( data ) {
    if ( data ) this.data = data;
    this.find( '.title' ).ftext( this.data.title );
    this.$el.classes( {
      active: this.data.active
    } );
    this.find( 'a' ).attr( 'href', '/' + this.data.id );
  }

} );
