var TodoItem = $.nito( {

  base: [
    '<li class="line item">',
      '<div class="check">',
        '<input type="checkbox" name="completed" data-ref="completed">',
      '</div>',
      '<div class="title" data-ref="title"></div>',
      '<input type="text" class="block" name="title"> ',
      '<div class="controls">',
        '<button class="btn btn-danger destroy">&times;</button>',
      '</div>',
    '</li>'
  ],

  identify: function ( item ) {
    return item.id;
  },

  mount: function ( app ) {

    this.app = app;
    this.editing = false;

    this.on( 'click', '.check', function ( e ) {
      this.app.check( this.data, !this.data.completed );
    } );

    this.on( 'dblclick', function ( e ) {
      this.editing = true;
      this.update();
      this.find( '[name=title]' ).val( this.data.title ).focus();
    } );

    this.on( 'blur', '[name=title]', function ( e ) {
      this.editing = false;
      this.app.title( this.data, e.target.value.trim() );
    } );

    this.on( 'keydown', '[name=title]', function ( e ) {

      var input = e.target;

      switch ( e.which ) {
      case ESCAPE_KEY:
        e.preventDefault();
        input.value = this.data.title;
        $( input ).blur();
        break;

      case ENTER_KEY:
        e.preventDefault();
        $( input ).blur();
        break;

      }

    } );

    this.on( 'click', '.destroy', function () {
      this.app.destroy( this.data );
    } );

  },

  update: function () {

    var item = this.data;
    this.$title.ftext( item.title );
    this.$el.classes( {
      completed: item.completed,
      editing: this.editing
    } );
    this.$completed.fval( item.completed );

  }

} );
