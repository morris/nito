var $ = require( './dollar' );
var marked = require( 'marked' );

module.exports = $.nito( {

  base: [
    '<div class="page">',
      '<h2>',
        '<span data-ref="title"></span> ',
        '<button class="edit btn btn-default">Edit</button> ',
        '<button class="remove btn btn-default">Remove</button> ',
        '<button class="save btn btn-default">Save</button> ',
      '</h2>',
      '<div data-ref="body"></div>',
      '<form class="form">',
        '<div class="form-group">',
          '<label class="control-label">Title</label>',
          '<input class="form-control" type="text" name="title" data-ref="input">',
        '</div>',
        '<div class="form-group">',
          '<label class="control-label">Body</label>',
          '<textarea class="form-control" rows="20" type="text" name="body" data-ref="input"></textarea>',
        '</div>',
      '</form>',
    '</div>'
  ],

  identify: function ( page ) {
    return page.id;
  },

  mount: function ( app ) {
    this.app = app;
    this.on( 'click', '.edit', this.edit );
    this.on( 'click', '.remove', this.remove );
    this.on( 'click', '.save', this.save );
  },

  update: function () {
    this.$el.classes( {
      editing: this.editing,
      notEditing: !this.editing
    } );
    this.$title.ftext( this.data.title );
    this.$body.fhtml( marked( this.data.body ) );
    this.$input.fill( this.data );
  },

  edit: function () {
    this.editing = true;
    this.update();
  },

  remove: function () {
    this.app.remove( this.data );
  },

  save: function () {
    this.editing = false;
    this.app.save( this.data, this.find( 'input, textarea' ).serializeData() );
  }

} );
