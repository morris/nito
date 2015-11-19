var NitoDashboard = $.nito( {

	base: [
		'<div class="dashboard"></div>'
	],

	mount: function ( store ) {
		this.store = store;
	},

	update: function () {
		this.$el.loop( this.store.data, NitoItem );
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

	update: function ( item ) {
		if ( item ) this.item = item;

		this.$name.weld( this.item.name );
		this.$score.weld( this.item.score );
		this.$el.css( 'color', this.item.color );
	}

} );
