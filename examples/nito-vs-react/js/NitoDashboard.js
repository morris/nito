var NitoDashboard = $.nito( {

	base: [
		'<div class="dashboard"></div>'
	],

	setup: function ( store ) {

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

	keyProp: 'id',

	setup: function () {

		this.$name = this.find( '.name' );
		this.$score = this.find( '.score' );

	},

	update: function ( data ) {

		this.$name.weld( data.name );
		this.$score.weld( data.score );
		this.$el.css( 'color', data.color );

	}

} );
