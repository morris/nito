QUnit.module( 'fhtml', function () {

  QUnit.test( 'basic', function ( assert ) {

    var $el = $( '<div><i class="foo"></i><b class="bar"></b></div>' );

    $el.find( '.foo' ).fhtml( 'hello' );
    $el.find( '.bar' ).fhtml( '<span>world</span>' );

    assert.equal( $el.find( 'i' ).html(), 'hello' );
    assert.equal( $el.find( 'b' ).html(), '<span>world</span>' );

    $el.fhtml( 'hi <span>lo</span>' );

    assert.equal( $el.html(), 'hi <span>lo</span>' );

  } );

  QUnit.test( 'edge', function ( assert ) {

    var $el = $( '<div></div>' );

    assert.equal( $el.fhtml( undefined ).html(), '' );
    assert.equal( $el.fhtml( null ).html(), '' );
    assert.equal( $el.fhtml( '' ).html(), '' );
    assert.equal( $el.fhtml( false ).html(), 'false' );
    assert.equal( $el.fhtml( true ).html(), 'true' );
    assert.equal( $el.fhtml( 0 ).html(), '0' );
    assert.equal( $el.fhtml( 1 ).html(), '1' );

  } );

} );
