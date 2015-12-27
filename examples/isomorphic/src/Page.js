var $ = require( './dollar' );
var marked = require( 'marked' );

module.exports = $.nito( {

	base: [
		'<div class="page">',
			'<h2>',
				'<span class="title"></span> ',
				'<button class="edit btn btn-default">Edit</button> ',
				'<button class="remove btn btn-default">Remove</button> ',
				'<button class="save btn btn-default">Save</button> ',
			'</h2>',
			'<div class="body"></div>',
			'<form class="form">',
				'<div class="form-group">',
					'<label class="control-label">Title</label>',
					'<input class="form-control" type="text" name="title">',
				'</div>',
				'<div class="form-group">',
					'<label class="control-label">Body</label>',
					'<textarea class="form-control" type="text" name="body"></textarea>',
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
		this.$el.weld( {
			title: this.data.title,
			body: marked( this.data.body )
		} );
		this.find( '.form' ).values( this.data );
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
		this.app.save( this.data, this.find( 'input, textarea' ).values() );
	}

} );
