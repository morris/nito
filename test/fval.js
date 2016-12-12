QUnit.module( 'fval', function () {

  QUnit.test( 'input/text', function ( assert ) {
    assert.ok( true );
  } );

  QUnit.test( 'textarea', function ( assert ) {

    var $form = $( '<form><textarea name="foo"></textarea></form>' );
    var $control = $form.find( 'textarea' );

    assert.equal( $control.val(), '' );
    assert.equal( $control.prop( 'value' ), '' );

    $control.fval( 'bar' );

    assert.equal( $control[ 0 ].defaultValue, '' );
    assert.equal( $control.val(), 'bar' );

    $control.fval( 'baz' );

    assert.equal( $control[ 0 ].defaultValue, '' );
    assert.equal( $control.val(), 'baz' );

    $form[ 0 ].reset();

    assert.equal( $control.html(), '' );
    assert.equal( $control.val(), '' );

  } );

  QUnit.test( 'select', function ( assert ) {

    var $form = $( '<form><select name="foo"><option value="bar">bar</option><option value="baz">baz</option></form>' );
    var $control = $form.find( 'select' );
    var $bar = $form.find( 'option' ).eq( 0 );
    var $baz = $form.find( 'option' ).eq( 1 );

    assert.equal( $control.val(), 'bar' );
    assert.equal( $control.prop( 'value' ), 'bar' );

    $control.fval( 'baz' );

    assert.ok( $baz[ 0 ].selected );
    assert.equal( $control.val(), 'baz' );

    $form[ 0 ].reset();

    assert.ok( $bar[ 0 ].selected );
    assert.equal( $control.val(), 'bar' );

  } );

  QUnit.test( 'select/option default value', function ( assert ) {

    var $form = $( '<form><select name="foo"><option>bar</option><option>baz</option></form>' );
    var $control = $form.find( 'select' );
    var $bar = $form.find( 'option' ).eq( 0 );
    var $baz = $form.find( 'option' ).eq( 1 );

    assert.equal( $control.val(), 'bar' );
    assert.equal( $control.prop( 'value' ), 'bar' );

    $control.fval( 'baz' );

    assert.ok( $baz[ 0 ].selected );
    assert.equal( $control.val(), 'baz' );

    $form[ 0 ].reset();

    assert.ok( $bar[ 0 ].selected );
    assert.equal( $control.val(), 'bar' );

  } );

  QUnit.test( 'checkbox', function ( assert ) {

    var $form = $( '<form><input type="checkbox" name="foo"></form>' );
    var $control = $form.find( 'input' );

    $control.fval( 'on' );
    $control.val( 'on' );

    assert.notOk( $control.is( '[checked]' ) );
    assert.ok( $control.prop( 'checked' ) );

    $control.fval( false );

    assert.notOk( $control.is( '[checked]' ) );
    assert.notOk( $control.prop( 'checked' ) );

    $control.fval( true );

    assert.notOk( $control.is( '[checked]' ) );
    assert.ok( $control.prop( 'checked' ) );

    $control.fval( true );
    $form.reset();

    assert.notOk( $control.is( '[checked]' ) );
    assert.notOk( $control.prop( 'checked' ) );

    $control.prop( 'checked', true );

    assert.notOk( $control.is( '[checked]' ) );
    assert.ok( $control.prop( 'checked' ) );

  } );

  QUnit.test( 'soft set on input', function ( assert ) {

    var $form = $( '<form><input type="text" name="foo" value="bar"></form>' ).appendTo( 'body' );
    var $control = $form.find( 'input' );

    $control[ 0 ].setSelectionRange( 0, 3 );
    assert.equal( $control[ 0 ].selectionStart, 0 );
    assert.equal( $control[ 0 ].selectionEnd, 3 );
    $control.fval( 'bar' );
    assert.equal( $control[ 0 ].selectionStart, 0 );
    assert.equal( $control[ 0 ].selectionEnd, 3 );

    $form.remove();

  } );

} );
