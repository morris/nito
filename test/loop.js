QUnit.module( 'loop', function () {

	var Item = $.nito( {

		base: [
			'<div class="item"></div>'
		],

		identify: function ( item ) {
			return item.id;
		},

		update: function () {
			this.$el.weld( this.data.title );
		}

	} );

	//

	QUnit.test( 'with identify', testLoop );

	QUnit.test( 'without identify', function ( assert ) {

		var t = Item.identify;
		testLoop( assert );
		Item.identiy = t;

	} );

	function testLoop( assert ) {

		var $items = $( '<div></div>' );

		$items.loop( [
			{ id: 1, title: 'A' },
			{ id: 2, title: 'B' },
			{ id: 3, title: 'C' },
			{ id: 4, title: 'D' },
			{ id: 5, title: 'E' },
			{ id: 6, title: 'F' },
			{ id: 7, title: 'G' }
		], Item );

		assert.equal( $items.children().length, 7 );
		assert.equal( join(), 'ABCDEFG' );

		$items.loop( [
			{ id: 1, title: 'A' },
			{ id: 2, title: 'B' },
			{ id: 3, title: 'C' },
			{ id: 4, title: 'D' },
			{ id: 5, title: 'E' },
			{ id: 6, title: 'F' },
			{ id: 7, title: 'G' }
		], Item );

		assert.equal( $items.children().length, 7 );
		assert.equal( join(), 'ABCDEFG' );

		$items.loop( [
			{ id: 1, title: 'A' },
			{ id: 3, title: 'C' },
			{ id: 4, title: 'D' },
			{ id: 5, title: 'E' },
			{ id: 6, title: 'F' },
			{ id: 2, title: 'B' },
			{ id: 7, title: 'G' }
		], Item );

		assert.equal( $items.children().length, 7 );
		assert.equal( join(), 'ACDEFBG' );

		$items.loop( [
			{ id: 1, title: 'A' },
			{ id: 2, title: 'B' },
			{ id: 8, title: 'X' },
			{ id: 3, title: 'C' },
			{ id: 6, title: 'F' },
			{ id: 9, title: 'Y' },
			{ id: 4, title: 'D' },
			{ id: 5, title: 'E' },
			{ id: 7, title: 'G' }
		], Item );

		assert.equal( $items.children().length, 9 );
		assert.equal( join(), 'ABXCFYDEG' );

		$items.loop( [
			{ id: 9, title: 'Y' },
			{ id: 8, title: 'X' },
			{ id: 3, title: 'C' },
			{ id: 1, title: 'A' }
		], Item );

		assert.equal( $items.children().length, 4 );
		assert.equal( join(), 'YXCA' );

		$items.loop( [], Item );

		assert.equal( $items.children().length, 0 );

		$items.loop( [
			{ id: 1, title: 'A' },
			{ id: 2, title: 'B' },
			{ id: 3, title: 'C' },
			{ id: 4, title: 'D' },
			{ id: 5, title: 'E' },
			{ id: 6, title: 'F' },
			{ id: 7, title: 'G' }
		], Item );

		assert.equal( $items.children().length, 7 );
		assert.equal( join(), 'ABCDEFG' );

		$items.loop( [
			{ id: 1, title: 'A' },
			{ id: 3, title: 'C' },
			{ id: 4, title: 'D' },
			{ id: 5, title: 'E' },
			{ id: 7, title: 'G' },
			{ id: 6, title: 'F' },
			{ id: 2, title: 'B' },
		], Item );

		assert.equal( $items.children().length, 7 );
		assert.equal( join(), 'ACDEGFB' );

		function join() {

			var s = [];

			$items.children().each( function () {
				s.push( $( this ).html() );
			} )

			return s.join( '' );

		}

	}

	QUnit.test( 'nest', function ( assert ) {

		var $items = $( '<div></div>' );

		$items.nest( { id: 1, title: 'A' }, Item );

		assert.equal( $items.children().length, 1 );
		assert.equal( $items.children().eq( 0 ).html(), 'A' );

		$items.nest( null, Item );

		assert.equal( $items.children().length, 0 );

	} );

} );
