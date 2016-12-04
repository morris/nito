QUnit.module( 'weld', function () {

  QUnit.test( 'basics', function ( assert ) {

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

  QUnit.test( 'edge', function ( assert ) {

    var $el = $( '<div></div>' );

    assert.equal( $el.weld( undefined ).html(), '' );
    assert.equal( $el.weld( null ).html(), '' );
    assert.equal( $el.weld( '' ).html(), '' );
    assert.equal( $el.weld( false ).html(), 'false' );
    assert.equal( $el.weld( true ).html(), 'true' );
    assert.equal( $el.weld( 0 ).html(), '0' );
    assert.equal( $el.weld( 1 ).html(), '1' );

  } );

  QUnit.test( 'img', function ( assert ) {

    var $el = $( '<img>' );

    assert.equal( $el.weld( 'foo.png' ).attr( 'src' ), 'foo.png' );

  } );

  QUnit.test( 'skip inputs', function ( assert ) {

    var $el = $( '<div><i class="foo"></i><input type="text" class="foo"><b class="bar"></b><textarea class="bar"></textarea></div>' );

    $el.weld( {
      foo: 'hello',
      bar: 'world'
    } );

    assert.equal( $el.find( 'i' ).html(), 'hello' );
    assert.equal( $el.find( 'b' ).html(), 'world' );
    assert.equal( $el.find( 'input' ).val(), '' );
    assert.equal( $el.find( 'textarea' ).val(), '' );

    $el.weld( 'hi' );

    assert.equal( $el.html(), 'hi' );

  } );

} );
