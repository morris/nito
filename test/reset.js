QUnit.module( 'reset', function () {

  QUnit.test( 'basic', function ( assert ) {

    var $form = $(
      '<form>' +
        '<input type="text" name="foo">' +
        '<input type="checkbox" name="bar">' +
        '<textarea name="baz"></textarea>' +
        '<select name="select"><option value="a"></option><option value="b"></option></select>' +
        '<input type="button" name="what">',
      '</form>'
    );
    var $foo = $form.children().eq( 0 );
    var $bar = $form.children().eq( 1 );
    var $baz = $form.children().eq( 2 );
    var $select = $form.children().eq( 3 );

    $form.children().fillDef( {
      foo: 'foo',
      bar: false,
      baz: 'baz',
      select: 'a'
    } );

    $form.children().fill( {
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

} );
