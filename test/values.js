QUnit.module( 'values', function () {

	QUnit.test( 'text/defaults', function ( assert ) {

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

	QUnit.test( 'text/defaults/edge', function ( assert ) {

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

	QUnit.test( 'textarea/user', function ( assert ) {

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

	QUnit.test( 'textarea/defaults', function ( assert ) {

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

	QUnit.test( 'textarea/defaults/edge', function ( assert ) {

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

	QUnit.test( 'select/user', function ( assert ) {

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

	QUnit.test( 'select/defaults', function ( assert ) {

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

	QUnit.test( 'select/multiple/defaults', function ( assert ) {

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

	QUnit.test( 'checkbox/user', function ( assert ) {

		var $form = $( '<form><input type="checkbox" name="foo"></form>' );
		var $control = $form.find( 'input' );

		$form.values( { foo: true } );

		assert.notOk( $control.is( '[checked]' ) );
		assert.ok( $control.prop( 'checked' ) );

		$form.values( { foo: false } );

		assert.notOk( $control.is( '[checked]' ) );
		assert.notOk( $control.prop( 'checked' ) );

		$form.values( { foo: true } );
		$form.values( {} );

		assert.notOk( $control.is( '[checked]' ) );
		assert.notOk( $control.prop( 'checked' ) );

		$form.values( { foo: true } );
		$form.reset();

		assert.notOk( $control.is( '[checked]' ) );
		assert.notOk( $control.prop( 'checked' ) );

		$control.prop( 'checked', true );

		assert.notOk( $control.is( '[checked]' ) );
		assert.ok( $control.prop( 'checked' ) );

	} );

	QUnit.test( 'checkbox/defaults', function ( assert ) {

		var $form = $( '<form><input type="checkbox" name="foo"></form>' );
		var $control = $form.find( 'input' );

		$form.values( { foo: true }, true );

		assert.ok( $control.is( '[checked]' ) );
		assert.ok( $control.prop( 'checked' ) );

		$form.values( { foo: false }, true );

		assert.notOk( $control.is( '[checked]' ) );
		assert.notOk( $control.prop( 'checked' ) );

		$form.values( { foo: true }, true );
		$form.values( {}, true );

		assert.notOk( $control.is( '[checked]' ) );
		assert.notOk( $control.prop( 'checked' ) );

		$control.prop( 'checked', true );

		assert.notOk( $control.is( '[checked]' ) );
		assert.ok( $control.prop( 'checked' ) );

	} );

	QUnit.test( 'checkbox/multiple/defaults', function ( assert ) {

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

	QUnit.test( 'radio/defaults', function ( assert ) {

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

	QUnit.test( 'nested', function ( assert ) {

		var $form = $(
			'<form>' +
				'<input type="text" name="foo[bar][bar]">' +
				'<input type="checkbox" name="foo[bar][baz]" value="1">' +
				'<textarea name="baz[foo]"></textarea>' +
				'<select name="select[]" multiple><option value="a"></option><option value="b"></option></select>' +
				'<input type="text" name="indexed[0]">' +
				'<input type="text" name="indexed[1]">' +
			'</form>'
		);
		var $foo = $form.children().eq( 0 );
		var $bar = $form.children().eq( 1 );
		var $baz = $form.children().eq( 2 );
		var $select = $form.children().eq( 3 );
		var $i0 = $form.children().eq( 4 );
		var $i1 = $form.children().eq( 5 );

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
			select: [ 'a' ],
			indexed: [ 'a' ]
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
			select: [ 'a', 'b' ],
			indexed: [ 'a', 'b' ]
		} );

		assert.equal( $foo.val(), 'test' );
		assert.equal( $bar.prop( 'checked' ), true );
		assert.equal( $baz.val(), 'test' );
		assert.equal( $select.val().length, 2 );
		assert.equal( $select.val()[ 0 ], 'a' );
		assert.equal( $select.val()[ 1 ], 'b' );
		assert.equal( $select.children()[0].selected, true );
		assert.equal( $select.children()[1].selected, true );
		assert.equal( $i0.val(), 'a' );
		assert.equal( $i1.val(), 'b' );

		assert.equal( $foo.reset().val(), 'foo' );
		assert.equal( $bar.reset().prop( 'checked' ), false );
		assert.equal( $baz.reset().val(), 'baz' );
		assert.equal( $select.reset().val(), 'a' );

	} );

	( window.Zepto ? QUnit.skip : QUnit.test )( 'get', function ( assert ) {

		var $form = $(
			'<form>' +
				'<input type="text" name="text" value="1">' +
				'<input type="text" name="nested[text]" value="1">' +
				'<input type="text" name="nested[object][text]" value="1">' +
				'<input type="text" name="indexed[0]" value="2">' +
				'<input type="text" name="indexed[1]" value="3">' +
				'<input type="checkbox" name="check" value="4" checked>' +
				'<input type="checkbox" name="checkArray[]" value="5" checked>' +
				'<input type="checkbox" name="checkArray[]" value="6" checked>' +
				'<input type="checkbox" name="checkArray[]" value="7">' +
				'<select name="select[]" multiple><option value="a" selected></option><option value="b" selected></option></select>' +
				'<input type="radio" name="radio" value="5">' +
				'<input type="radio" name="radio" value="6" checked>' +
				'<input type="radio" name="radio" value="7">' +
			'</form>'
		);

		assert.deepEqual( $form.values(), {
			text: '1',
			nested: {
				text: '1',
				object: {
					text: '1'
				}
			},
			indexed: [ '2', '3' ],
			check: '4',
			checkArray: [ '5', '6' ],
			select: [ 'a', 'b' ],
			radio: '6'
		} );

	} );

	QUnit.test( 'soft set on input', function ( assert ) {

		var $form = $( '<form><input type="text" name="foo" value="bar"></form>' ).appendTo( 'body' );
		var $bar = $form.find( 'input' );

		$bar[ 0 ].setSelectionRange( 0, 3 );
		assert.equal( $bar[ 0 ].selectionStart, 0 );
		assert.equal( $bar[ 0 ].selectionEnd, 3 );
		$form.values( { foo: 'bar' } );
		assert.equal( $bar[ 0 ].selectionStart, 0 );
		assert.equal( $bar[ 0 ].selectionEnd, 3 );

		$form.remove();

	} );

} );
