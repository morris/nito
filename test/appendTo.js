QUnit.module( 'appendTo', function () {

  var A = $.nito( {

    base: '<p class="appendTo"></p>',

    mount: function ( env ) {
      this.env = env;
    }

  } );

  //

  QUnit.test( 'element', function ( assert ) {

    var $el = $( '<div></div>' );
    var a = A.appendTo( $el, 'a', 'a*' );

    assert.ok( a.$el.is( 'p.appendTo' ) );
    assert.ok( a.$el.parent().is( $el ) );
    assert.equal( a.env, 'a' );
    assert.equal( a.data, 'a*' );

  } );

  QUnit.test( 'selector', function ( assert ) {

    var a = A.appendTo( 'body', 'a', 'a*' );

    assert.ok( a.$el.is( 'p.appendTo' ) );
    assert.ok( a.$el.parent().is( 'body' ) );

    a.$el.remove();

  } );

} );
