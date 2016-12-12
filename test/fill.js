QUnit.module( 'fill/fillDef', function () {

  QUnit.test( 'basic', function ( assert ) {

    var $form = $(
      '<form>' +
        '<input type="text" name="foo[bar][bar]">' +
        '<input type="checkbox" name="foo[bar][baz]">' +
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

    $form.children().fillDef( {
      foo: {
        bar: {
          bar: 'foo',
          baz: false
        }
      },
      baz: {
        foo: 'baz'
      },
      select: [ 'a' ],
      indexed: [ 'a' ]
    } );

    $form.children().fill( {
      foo: {
        bar: {
          bar: 'test',
          baz: true
        }
      },
      baz: {
        foo: 'test'
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

} );
