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

} );
