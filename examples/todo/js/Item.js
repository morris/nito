var Item = $.nito( {

	base: [
		'<li class="line item">',
			'<div class="check"><input type="checkbox" name="completed"></div>',
			'<div class="title"></div>',
			'<input type="text" class="block" name="title"> ',
			'<div class="controls">',
				'<button class="btn btn-danger destroy">&times;</button>',
			'</div>',
		'</li>'
	],

	keyProp: 'id',

	setup: function ( item, app ) {

		this.item = item;
		this.app = app;
		this.editing = false;

		this.on( 'click', '.check', function ( e ) {

			this.app.check( this.item, !this.item.completed );

		} );

		this.on( 'dblclick', function ( e ) {

			this.editing = true;
			this.update();
			this.find( '[name=title]' ).val( this.item.title ).focus();

		} );

		this.on( 'blur', '[name=title]', function ( e ) {

			this.editing = false;
			this.app.title( this.item, e.target.value.trim() );

		} );

		this.on( 'keydown', '[name=title]', function ( e ) {

			var input = e.target;

			switch ( e.which ) {
			case ESCAPE_KEY:

				e.preventDefault();
				input.value = this.item.title;
				$( input ).blur();
				break;

			case ENTER_KEY:

				e.preventDefault();
				$( input ).blur();
				break;

			}

		} );

		this.on( 'click', '.destroy', function () {

			this.app.destroy( this.item );

		} );

	},

	update: function () {

		// weld and classes are nice, non-destructive use of $
		this.$el.weld( this.item );

		this.$el.classes( {
			completed: this.item.completed,
			editing: this.editing
		} );

		this.$el.values( { completed: this.item.completed } );

	}

} );
