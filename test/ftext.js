QUnit.module( 'ftext', function () {

  QUnit.test( 'basic', function ( assert ) {

    var $el = $( '<div><i class="foo"></i><b class="bar"></b></div>' );

    $el.find( '.foo' ).ftext( 'hello' );
    $el.find( '.bar' ).ftext( '<span>world</span>' );

    assert.equal( $el.find( 'i' ).html(), 'hello' );
    assert.equal( $el.find( 'b' ).html(), '&lt;span&gt;world&lt;/span&gt;' );

    $el.ftext( 'hi <span>lo</span>' );

    assert.equal( $el.html(), 'hi &lt;span&gt;lo&lt;/span&gt;' );

  } );

  QUnit.test( 'edge', function ( assert ) {

    var $el = $( '<div></div>' );

    assert.equal( $el.ftext( undefined ).html(), '' );
    assert.equal( $el.ftext( null ).html(), '' );
    assert.equal( $el.ftext( '' ).html(), '' );
    assert.equal( $el.ftext( false ).html(), 'false' );
    assert.equal( $el.ftext( true ).html(), 'true' );
    assert.equal( $el.ftext( 0 ).html(), '0' );
    assert.equal( $el.ftext( 1 ).html(), '1' );

  } );

} );
