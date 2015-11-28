( function () {

	var Todo = $.nito( {

		base: [
			'<div class="todo">',
				'<h1 class="title">Todo</h1>',
				'<div class="items"></div>',
			'</div>'
		],

		mount: function ( env ) {
			this.env = env;
			this.testMount = true;
		},

		update: function ( data ) {
			if ( data ) this.data = data;
			this.testUpdate = true;
			this.$el.trigger( 'update' );
		}

	} );

	var TodoItem = $.nito( {

		base: [
			'<div class="item"></div>'
		],

		identify: function ( item ) {
			return item.id;
		},

		update: function ( item ) {
			if ( item ) this.item = item;

			this.$el.weld( this.item.title );
		}

	} );

	//

	QUnit.test( 'loop', testLoop );

	QUnit.test( 'loop w/o identify', function ( assert ) {

		var t = TodoItem.identify;
		testLoop( assert );
		TodoItem.identiy = t;

	} );

	function testLoop( assert ) {

		var todo = Todo.appendTo( '#qunit-fixture' );
		var $items = todo.find( '.items' );

		$items.loop( [
			{ id: 1, title: 'A' },
			{ id: 2, title: 'B' },
			{ id: 3, title: 'C' },
			{ id: 4, title: 'D' },
			{ id: 5, title: 'E' },
			{ id: 6, title: 'F' },
			{ id: 7, title: 'G' }
		], TodoItem );

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
		], TodoItem );

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
		], TodoItem );

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
		], TodoItem );

		assert.equal( $items.children().length, 9 );
		assert.equal( join(), 'ABXCFYDEG' );

		$items.loop( [
			{ id: 9, title: 'Y' },
			{ id: 8, title: 'X' },
			{ id: 3, title: 'C' },
			{ id: 1, title: 'A' }
		], TodoItem );

		assert.equal( $items.children().length, 4 );
		assert.equal( join(), 'YXCA' );

		$items.loop( [], TodoItem );

		assert.equal( $items.children().length, 0 );

		$items.loop( [
			{ id: 1, title: 'A' },
			{ id: 2, title: 'B' },
			{ id: 3, title: 'C' },
			{ id: 4, title: 'D' },
			{ id: 5, title: 'E' },
			{ id: 6, title: 'F' },
			{ id: 7, title: 'G' }
		], TodoItem );

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
		], TodoItem );

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

		var todo = Todo.appendTo( '#qunit-fixture' );
		var $items = todo.find( '.items' );

		$items.nest( { id: 1, title: 'A' }, TodoItem );

		assert.equal( $items.children().length, 1 );
		assert.equal( $items.children().eq( 0 ).html(), 'A' );

		$items.nest( null, TodoItem );

		assert.equal( $items.children().length, 0 );

	} );

} )();
