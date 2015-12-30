QUnit.module( 'deliver', function () {

	QUnit.test( 'basic', function ( assert ) {

		var A = $.nito( { base: '<div></div>', id: 'a' } );
		var B = $.nito( { id: 'b' } );
		var C = $.nito( {} );
		var a = A.create( null, { type: 'A' } );
		var b = B.mount( a.$el, null, { type: 'B' } );
		var c = C.mount( a.$el, null, { type: 'C' } );
		var html = a.$el.deliver( true );

		var a_ = A.mount( html );
		var b_ = B.mount( a_.$el );
		var c_ = C.mount( a_.$el );
		assert.equal( a_.data.type, 'A' );
		assert.equal( b_.data.type, 'B' );
		assert.equal( c_.data, undefined );

	} );

	QUnit.test( 'looped', function ( assert ) {

		var Div = $.nito( {
			base: '<div></div>',
			id: 'div',
			update: function () {
				this.$el.loop( this.data, P, this );
			}
		} );

		var P = $.nito( {
			base: '<p></p>',
			mount: function () {
				this.on( 'test', function () {
					++test;
				} );
			}
		} );

		var test = 0;

		var div = Div.create( null, [ 1, 2, 3 ] );
		var html = div.$el.deliver( true );

		var div_ = Div.mount( html );
		assert.equal( div_.data.length, 3 );
		assert.equal( div_.find( 'p' ).length, 3 );
		div_.find( 'p' ).trigger( 'test' );
		assert.equal( test, 3 );

	} );

} );
