var Todo = $.nito( {

	base: [
		'<div class="todo">',
			'<h1 class="title">Todo</h1>',
			'<div class="items"></div>',
		'</div>'
	]

} );

var Item = $.nito( {

	base: [
		'<div class="item"></div>'
	],

	keyProp: 'id',

	update: function ( data ) {

		this.$el.weld( data.title )

	}

} );

//

QUnit.test( 'defined', function ( assert ) {

	assert.equal( typeof $.nito, 'function' );

} );

QUnit.test( 'loop', function ( assert ) {

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

} );

QUnit.test( 'nest', function ( assert ) {

	var todo = Todo.appendTo( '#qunit-fixture' );
	var $items = todo.find( '.items' );

	$items.nest( { id: 1, title: 'A' }, Item );

	assert.equal( $items.children().length, 1 );
	assert.equal( $items.children().eq( 0 ).html(), 'A' );

	$items.nest( null, Item );

	assert.equal( $items.children().length, 0 );

} );

QUnit.test( 'classes', function ( assert ) {

	var $el = $( '<div></div>' );

	$el.classes( {
		foo: true,
		bar: true,
		baz: false
	} );

	assert.equal( $el[ 0 ].className, 'foo bar' );

	$el.classes( {
		foo: false,
		baz: true
	} );

	assert.equal( $el[ 0 ].className, 'bar baz' );

} );

QUnit.test( 'classes edge', function ( assert ) {

	var $el = $( '<div></div>' );

	$el.classes( {
		foo: true,
		bar: true,
		baz: true,
		bla: true,
		bli: true
	} );

	assert.equal( $el[ 0 ].className, 'foo bar baz bla bli' );

	$el.classes( {
		foo: false,
		bar: null,
		baz: 0,
		bla: undefined,
		bli: ''
	} );

	assert.equal( $el[ 0 ].className, '' );

	//

	$el.classes( {
		foo: false,
		bar: false,
		baz: false,
		bla: false,
		bli: false
	} );

	assert.equal( $el[ 0 ].className, '' );

	$el.classes( {
		foo: false,
		bar: null,
		baz: 0,
		bla: undefined,
		bli: ''
	} );

	assert.equal( $el[ 0 ].className, '' );

} );

QUnit.test( 'weld', function ( assert ) {

	var $el = $( '<div><i class="foo"></i><b class="bar"></b></div>' );

	$el.weld( {
		foo: 'hello',
		bar: 'world'
	} );

	assert.equal( $el.find( 'i' ).html(), 'hello' );
	assert.equal( $el.find( 'b' ).html(), 'world' );

	$el.weld( 'hi' );

	assert.equal( $el.html(), 'hi' );

} );

QUnit.test( 'weld edge', function ( assert ) {

	var $el = $( '<div></div>' );

	assert.equal( $el.weld( undefined ).html(), '' );
	assert.equal( $el.weld( null ).html(), '' );
	assert.equal( $el.weld( '' ).html(), '' );
	assert.equal( $el.weld( false ).html(), 'false' );
	assert.equal( $el.weld( true ).html(), 'true' );
	assert.equal( $el.weld( 0 ).html(), '0' );
	assert.equal( $el.weld( 1 ).html(), '1' );

} );

QUnit.test( 'weld img', function ( assert ) {

	var $el = $( '<img>' );

	assert.equal( $el.weld( 'foo.png' ).attr( 'src' ), 'foo.png' );
} );

QUnit.test( 'values text defaults', function ( assert ) {

	var $form = $( '<form><input type="text" name="foo"></form>' );
	var $control = $form.find( 'input' );

	assert.equal( $control.val(), '' );
	assert.equal( $control.prop( 'value' ), '' );

	$form.values( { foo: 'bar' }, true );

	assert.equal( $control.attr( 'value' ), 'bar' );
	assert.equal( $control.val(), 'bar' );

	$control.prop( 'value', 'baz' );

	assert.equal( $control.attr( 'value' ), 'bar' );
	assert.equal( $control.val(), 'baz' );

	$form[ 0 ].reset();

	assert.equal( $control.attr( 'value' ), 'bar' );
	assert.equal( $control.val(), 'bar' );

} );

QUnit.test( 'values text defaults edge', function ( assert ) {

	var $form = $( '<form><input type="text" name="foo"></form>' );
	var $control = $form.find( 'input' );

	assert.equal( $control.val(), '' );

	$form.values( { foo: 0 }, true );
	assert.equal( $control.val(), '0' );

	$form.values( { foo: null }, true );
	assert.equal( $control.val(), '' );

	$form.values( { foo: undefined }, true );
	assert.equal( $control.val(), '' );

} );

QUnit.test( 'values textarea defaults', function ( assert ) {

	var $form = $( '<form><textarea name="foo"></textarea></form>' );
	var $control = $form.find( 'textarea' );

	assert.equal( $control.val(), '' );
	assert.equal( $control.prop( 'value' ), '' );

	$form.values( { foo: 'bar' }, true );

	assert.equal( $control.html(), 'bar' );
	assert.equal( $control.val(), 'bar' );

	$control.val( 'baz' );

	assert.equal( $control[ 0 ].defaultValue, 'bar' );
	assert.equal( $control.val(), 'baz' );

	$form[ 0 ].reset();

	assert.equal( $control.html(), 'bar' );
	assert.equal( $control.val(), 'bar' );

} );

QUnit.test( 'values textarea defaults edge', function ( assert ) {

	var $form = $( '<form><textarea name="foo"></textarea></form>' );
	var $control = $form.find( 'textarea' );

	assert.equal( $control.val(), '' );
	assert.equal( $control.prop( 'value' ), '' );

	$form.values( { foo: 0 }, true );

	assert.equal( $control.html(), '0' );
	assert.equal( $control.val(), '0' );

	$form.values( { foo: null }, true );

	assert.equal( $control.html(), '' );
	assert.equal( $control.val(), '' );

	$form.values( { foo: undefined }, true );

	assert.equal( $control.html(), '' );
	assert.equal( $control.val(), '' );

} );

QUnit.test( 'values textarea user', function ( assert ) {

	var $form = $( '<form><textarea name="foo"></textarea></form>' );
	var $control = $form.find( 'textarea' );

	assert.equal( $control.val(), '' );
	assert.equal( $control.prop( 'value' ), '' );

	$form.values( { foo: 'bar' } );

	assert.equal( $control[ 0 ].defaultValue, '' );
	assert.equal( $control.val(), 'bar' );

	$control.val( 'baz' );

	assert.equal( $control[ 0 ].defaultValue, '' );
	assert.equal( $control.val(), 'baz' );

	$form[ 0 ].reset();

	assert.equal( $control.html(), '' );
	assert.equal( $control.val(), '' );

} );

QUnit.test( 'values select defaults', function ( assert ) {

	var $form = $( '<form><select name="foo"><option value="bar">bar</option><option value="baz">baz</option></form>' );
	var $control = $form.find( 'select' );
	var $bar = $form.find( 'option' ).eq( 0 );
	var $baz = $form.find( 'option' ).eq( 1 );

	assert.equal( $control.val(), 'bar' );
	assert.equal( $control.prop( 'value' ), 'bar' );

	$form.values( { foo: 'baz' }, true );

	assert.notOk( $control.is( '[value]' ) );
	assert.ok( $baz.is( '[selected]' ) );

	// the following assertion is wrong, the browser may choose to keep 'bar'
	// assert.equal( $control.val(), 'baz' );

	$form[ 0 ].reset();

	assert.ok( $baz.is( '[selected]' ) );
	assert.equal( $control.val(), 'baz' );

} );

QUnit.test( 'values select user', function ( assert ) {

	var $form = $( '<form><select name="foo"><option value="bar">bar</option><option value="baz">baz</option></form>' );
	var $control = $form.find( 'select' );
	var $bar = $form.find( 'option' ).eq( 0 );
	var $baz = $form.find( 'option' ).eq( 1 );

	assert.equal( $control.val(), 'bar' );
	assert.equal( $control.prop( 'value' ), 'bar' );

	$form.values( { foo: 'baz' } );

	assert.ok( $baz[ 0 ].selected );
	assert.equal( $control.val(), 'baz' );

	$form[ 0 ].reset();

	assert.ok( $bar[ 0 ].selected );
	assert.equal( $control.val(), 'bar' );

} );

QUnit.test( 'values select multiple defaults', function ( assert ) {

	var $form = $( '<form><select name="foo[]" multiple><option value="bar">bar</option><option value="baz">baz</option></form>' );
	var $bar = $form.find( 'option' ).eq( 0 );
	var $baz = $form.find( 'option' ).eq( 1 );

	$form.values( { foo: [] }, true );

	assert.notOk( $bar.is( '[selected]' ) );
	assert.notOk( $baz.is( '[selected]' ) );

	$form.values( { foo: [ 'bar' ] }, true );

	assert.ok( $bar.is( '[selected]' ) );
	assert.notOk( $baz.is( '[selected]' ) );

	$form.values( { foo: [ 'baz' ] }, true );

	assert.notOk( $bar.is( '[selected]' ) );
	assert.ok( $baz.is( '[selected]' ) );

	$form.values( { foo: [ 'bar', 'baz' ] }, true );

	assert.ok( $bar.is( '[selected]' ) );
	assert.ok( $baz.is( '[selected]' ) );

} );

QUnit.test( 'values checkbox defaults', function ( assert ) {

	var $form = $( '<form><input type="checkbox" name="foo"></form>' );
	var $control = $form.find( 'input' );

	$form.values( { foo: true }, true );

	assert.ok( $control.is( '[checked]' ) );
	assert.ok( $control.prop( 'checked' ) );

	$form.values( { foo: false }, true );

	assert.notOk( $control.is( '[checked]' ) );
	assert.notOk( $control.prop( 'checked' ) );

	$control.prop( 'checked', true );

	assert.notOk( $control.is( '[checked]' ) );
	assert.ok( $control.prop( 'checked' ) );

} );

QUnit.test( 'values checkbox multiple defaults', function ( assert ) {

	var $form = $( '<form><input type="checkbox" name="foo[]" value="bar"><input type="checkbox" name="foo[]" value="baz"></form>' );
	var $bar = $form.find( 'input' ).eq( 0 );
	var $baz = $form.find( 'input' ).eq( 1 );

	$form.values( { foo: [] }, true );

	assert.notOk( $bar.is( '[checked]' ) );
	assert.notOk( $baz.is( '[checked]' ) );

	$form.values( { foo: [ 'bar' ] }, true );

	assert.ok( $bar.is( '[checked]' ) );
	assert.notOk( $baz.is( '[checked]' ) );

	$form.values( { foo: [ 'baz' ] }, true );

	assert.notOk( $bar.is( '[checked]' ) );
	assert.ok( $baz.is( '[checked]' ) );

	$form.values( { foo: [ 'bar', 'baz' ] }, true );

	assert.ok( $bar.is( '[checked]' ) );
	assert.ok( $baz.is( '[checked]' ) );

} );

QUnit.test( 'values radio defaults', function ( assert ) {

	var $form = $( '<form><input type="radio" name="foo" value="bar"><input type="radio" name="foo" value="baz"></form>' );
	var $bar = $form.find( 'input' ).eq( 0 );
	var $baz = $form.find( 'input' ).eq( 1 );

	assert.equal( $bar.attr( 'value' ), 'bar' );
	assert.equal( $baz.attr( 'value' ), 'baz' );

	$form.values( { foo: 'baz' }, true );

	assert.notOk( $bar.is( '[checked]' ) );
	assert.ok( $baz.is( '[checked]' ) );

	$form.values( { foo: 'bar' }, true );

	assert.ok( $bar.is( '[checked]' ) );
	assert.notOk( $baz.is( '[checked]' ) );

} );

QUnit.test( 'reset/integration', function ( assert ) {

	var $form = $(
		'<form>' +
			'<input type="text" name="foo">' +
			'<input type="checkbox" name="bar" value="1">' +
			'<textarea name="baz"></textarea>' +
			'<select name="select"><option value="a"></option><option value="b"></option></select>' +
		'</form>'
	);
	var $foo = $form.children().eq( 0 );
	var $bar = $form.children().eq( 1 );
	var $baz = $form.children().eq( 2 );
	var $select = $form.children().eq( 3 );

	$form.values( {
		foo: 'foo',
		bar: false,
		baz: 'baz',
		select: 'a'
	}, true );

	$form.values( {
		foo: 'test',
		bar: true,
		baz: 'test',
		select: 'b'
	} );

	assert.equal( $foo.val(), 'test' );
	assert.equal( $bar.prop( 'checked' ), true );
	assert.equal( $baz.val(), 'test' );
	assert.equal( $select.val(), 'b' );

	assert.equal( $foo.reset().val(), 'foo' );
	assert.equal( $bar.reset().prop( 'checked' ), false );
	assert.equal( $baz.reset().val(), 'baz' );
	assert.equal( $select.reset().val(), 'a' );

} );

QUnit.test( 'values nested', function ( assert ) {

	var $form = $(
		'<form>' +
			'<input type="text" name="foo[bar][bar]">' +
			'<input type="checkbox" name="foo[bar][baz]" value="1">' +
			'<textarea name="baz[foo]"></textarea>' +
			'<select name="select[]" multiple><option value="a"></option><option value="b"></option></select>' +
		'</form>'
	);
	var $foo = $form.children().eq( 0 );
	var $bar = $form.children().eq( 1 );
	var $baz = $form.children().eq( 2 );
	var $select = $form.children().eq( 3 );

	$form.values( {
		foo: {
			bar: {
				bar: 'foo',
				baz: false
			}
		},
		baz: {
			foo: 'baz',
		},
		select: [ 'a' ]
	}, true );

	$form.values( {
		foo: {
			bar: {
				bar: 'test',
				baz: true
			}
		},
		baz: {
			foo: 'test',
		},
		select: [ 'a', 'b' ]
	} );

	assert.equal( $foo.val(), 'test' );
	assert.equal( $bar.prop( 'checked' ), true );
	assert.equal( $baz.val(), 'test' );
	assert.equal( $select.val().length, 2 );
	assert.equal( $select.val()[ 0 ], 'a' );
	assert.equal( $select.val()[ 1 ], 'b' );
	assert.equal( $select.children()[0].selected, true );
	assert.equal( $select.children()[1].selected, true );

	assert.equal( $foo.reset().val(), 'foo' );
	assert.equal( $bar.reset().prop( 'checked' ), false );
	assert.equal( $baz.reset().val(), 'baz' );
	assert.equal( $select.reset().val(), 'a' );

} );
