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
      '<strong class="name"></strong><br>',
      'S<span class="score"></span>',
    '</item>'
  ],

  identify: function ( item ) {
    return item.id;
  },

  mount: function () {
    this.$name = this.find( '.name' );
    this.$score = this.find( '.score' );
  },

  update: function () {
    var item = this.data;
    this.$name.ftext( item.name );
    this.$score.ftext( item.score );
    this.$el.css( 'color', item.color );
  }

} );
