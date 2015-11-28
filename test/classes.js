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

QUnit.test( 'classes/edge', function ( assert ) {

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
