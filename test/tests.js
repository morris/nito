QUnit.test( 'defined', function ( assert ) {

	assert.equal( typeof $.nito, 'function' );

} );

var Todo = $.nito( {

	base: [
		'<div class="todo">',
			'<h1 class="title">Todo</h1>',
			'<div class="items"></div>',
		'</div>'
	],

	setup: function () {

	},

	update: function () {

	}

} );

var Item = $.nito( {

	base: [
		'<div class="item">',
			'<h1 class="title">Hello World!</h1>',
			'<div class="items"></div>',
		'</div>'
	],

	setup: function () {

	},

	update: function () {

	}

} );

var stats = {
	create: 0,
	remove: 0,
	moved: 0
};

Item._create = Item.create;
Item.create = function () {

	++stats.create;
	return Item._create.apply( Item, arguments );

};

Item._remove = Item.remove;
Item.remove = function () {

	++stats.remove;
	return Item._remove.apply( Item, arguments );

};

$( '#qunit-fixture' ).on( 'moved', '.item', function () {

	++stats.moved;

} );

QUnit.test( 'loop', function ( assert ) {

	var todo = Todo.appendTo( '#qunit-fixture' );
	var $items = todo.find( '.items' );
	$items.loop( [
		{ id: 1, label: 'A' },
		{ id: 2, label: 'B' },
		{ id: 3, label: 'C' }
	], Item );

	assert.equal( $items.children().length, 3 );
	assert.equal( stats.create, 3 );
	assert.equal( stats.remove, 0 );
	assert.equal( stats.moved, 3 );

	$items.loop( [
		{ id: 1, label: 'A' },
		{ id: 2, label: 'B' },
		{ id: 3, label: 'C' }
	], Item );

	assert.equal( stats.create, 3 );
	assert.equal( stats.remove, 0 );
	assert.equal( stats.moved, 3 );

	$items.loop( [
		{ id: 2, label: 'B' },
		{ id: 1, label: 'A' },
		{ id: 3, label: 'C' }
	], Item );

	assert.equal( stats.create, 3 );
	assert.equal( stats.remove, 0 );
	assert.equal( stats.moved, 4 );

	$items.loop( [
		{ id: 2, label: 'B' },
		{ id: 4, label: 'D' },
		{ id: 3, label: 'C' }
	], Item );

	assert.equal( stats.create, 4 );
	assert.equal( stats.remove, 1 );
	assert.equal( stats.moved, 5 );

} );
