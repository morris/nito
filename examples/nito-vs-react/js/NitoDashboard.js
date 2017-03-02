var NitoDashboard = $.nito( {

  base: [
    '<div class="dashboard"></div>'
  ],

  mount: function ( store ) {
    this.store = store;
  },

  update: function () {
    this.$el.nest( NitoItem, this.store.data, this );
  }

} );

var NitoItem = $.nito( {

  base: [
    '<div class="item">',
      '<strong data-ref="name"></strong><br>',
      'S<span data-ref="score"></span>',
    '</item>'
  ],

  update: function () {
    var item = this.data;
    this.$name.ftext( item.name );
    this.$score.ftext( item.score );
    this.$el.css( 'color', item.color );
  }

} );
