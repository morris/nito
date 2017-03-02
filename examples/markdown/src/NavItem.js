var $ = require( './dollar' );

module.exports = $.nito( {

  base: [
    '<li class="nav-item">',
      '<a class="title" data-ref="title"></a>',
    '</li>'
  ],

  update: function () {
    this.$title.ftext( this.data.title ).attr( 'href', '/' + this.data.id );
    this.$el.classes( {
      active: this.data.active
    } );
  }

} );
