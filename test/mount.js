QUnit.module( 'mount', function () {

	var settings = {

		mount: function ( env ) {
			this.env = env;
		},

		update: function () {
			this.$el.trigger( 'update', this.data );
		}

	};

	var A = $.nito( settings );
	var B = $.nito( settings );

	//

	QUnit.test( 'mount', function ( assert ) {

		var $el = $( '<div></div>' );
		var a = A.mount( $el, 'a', 'a*' );
		var a_ = $el.mount( A, 'a_', 'a_*' )[ 0 ].nitoComps[ A.id ];
		var b = B.mount( $el, 'b', 'b*' );
		var b_ = $el.mount( B, 'b_', 'b_*' )[ 0 ].nitoComps[ B.id ];

		assert.equal( a, a_ );
		assert.equal( b, b_ );
		assert.notEqual( a, b );
		assert.notEqual( A.id, B.id );
		assert.equal( a.env, 'a' );
		assert.equal( a.data, 'a*' );
		assert.equal( b.env, 'b' );
		assert.equal( b.data, 'b*' );
		assert.equal( a.el.nitoComps[ A.id ], a );
		assert.equal( b.el.nitoComps[ B.id ], b );

	} );

	QUnit.test( 'update', function ( assert ) {

		var $el = $( '<div></div>' );
		$el.mount( A, 'a', 'x' );
		$el.mount( B, 'b', 'x' );

		var updates = [];
		$el.on( 'update', function ( e, data ) {
			updates.push( data );
		} );
		$el.update();
		$el.update( A );
		$el.update( A, 'a' );
		$el.update( A, 'test' );
		$el.update( A, null );
		$el.update( B );
		$el.update( B, 'b' );
		$el.update( A );

		assert.deepEqual( updates, [ 'x', 'x', 'x', 'a', 'test', 'test', 'x', 'b', 'test' ] );

	} );

} );
