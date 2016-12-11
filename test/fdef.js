QUnit.module( 'fdef', function () {

  QUnit.test( 'input/text', function ( assert ) {

    var $form = $( '<form><input type="text" name="foo"></form>' );
    var $control = $form.find( 'input' );

    assert.equal( $control.val(), '' );
    assert.equal( $control.prop( 'value' ), '' );

    $control.fdef( 'bar' );

    assert.equal( $control.attr( 'value' ), 'bar' );
    assert.equal( $control.val(), 'bar' );

    $control.prop( 'value', 'baz' );

    assert.equal( $control.attr( 'value' ), 'bar' );
    assert.equal( $control.val(), 'baz' );

    $form[ 0 ].reset();

    assert.equal( $control.attr( 'value' ), 'bar' );
    assert.equal( $control.val(), 'bar' );

  } );

  QUnit.test( 'input/text/edge', function ( assert ) {

    var $form = $( '<form><input type="text" name="foo"></form>' );
    var $control = $form.find( 'input' );

    assert.equal( $control.val(), '' );

    $control.fdef( 0 );
    assert.equal( $control.val(), '0' );

    $control.fdef( null );
    assert.equal( $control.val(), '' );

    $control.fdef( undefined );
    assert.equal( $control.val(), '' );

  } );

  QUnit.test( 'textarea', function ( assert ) {

    var $form = $( '<form><textarea name="foo"></textarea></form>' );
    var $control = $form.find( 'textarea' );

    assert.equal( $control.val(), '' );
    assert.equal( $control.prop( 'value' ), '' );

    $control.fdef( 'bar' );

    assert.equal( $control.html(), 'bar' );
    assert.equal( $control.val(), 'bar' );

    $control.val( 'baz' );

    assert.equal( $control[ 0 ].defaultValue, 'bar' );
    assert.equal( $control.val(), 'baz' );

    $form[ 0 ].reset();

    assert.equal( $control.html(), 'bar' );
    assert.equal( $control.val(), 'bar' );

  } );

  QUnit.test( 'textarea/edge', function ( assert ) {

    var $form = $( '<form><textarea name="foo"></textarea></form>' );
    var $control = $form.find( 'textarea' );

    assert.equal( $control.val(), '' );
    assert.equal( $control.prop( 'value' ), '' );

    $control.fdef( 0 );

    assert.equal( $control.html(), '0' );
    assert.equal( $control.val(), '0' );

    $control.fdef( null );

    assert.equal( $control.html(), '' );
    assert.equal( $control.val(), '' );

    $control.fdef( undefined );

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

    $control.fdef( 'baz' );

    assert.notOk( $control.is( '[value]' ) );
    assert.ok( $baz.is( '[selected]' ) );

    // the following assertion is wrong, the browser may choose to keep 'bar'
    // assert.equal( $control.val(), 'baz' );

    $form[ 0 ].reset();

    assert.ok( $baz.is( '[selected]' ) );
    assert.equal( $control.val(), 'baz' );

  } );

  QUnit.test( 'select/multiple', function ( assert ) {

    var $form = $( '<form><select name="foo[]" multiple><option value="bar">bar</option><option value="baz">baz</option></form>' );
    var $control = $form.find( 'select' );
    var $bar = $form.find( 'option' ).eq( 0 );
    var $baz = $form.find( 'option' ).eq( 1 );

    $control.fdef( [] );

    assert.notOk( $bar.is( '[selected]' ) );
    assert.notOk( $baz.is( '[selected]' ) );

    $control.fdef( [ 'bar' ] );

    assert.ok( $bar.is( '[selected]' ) );
    assert.notOk( $baz.is( '[selected]' ) );

    $control.fdef( [ 'baz' ] );

    assert.notOk( $bar.is( '[selected]' ) );
    assert.ok( $baz.is( '[selected]' ) );

    $control.fdef( [ 'bar', 'baz' ] );

    assert.ok( $bar.is( '[selected]' ) );
    assert.ok( $baz.is( '[selected]' ) );

  } );

  QUnit.test( 'checkbox', function ( assert ) {

    var $form = $( '<form><input type="checkbox" name="foo"></form>' );
    var $control = $form.find( 'input' );

    $control.fdef( true );

    assert.ok( $control.is( '[checked]' ) );
    assert.ok( $control.prop( 'checked' ) );

    $control.fdef( false );

    assert.notOk( $control.is( '[checked]' ) );
    assert.notOk( $control.prop( 'checked' ) );

    $control.fval( true );

    assert.notOk( $control.is( '[checked]' ) );
    assert.ok( $control.prop( 'checked' ) );

    $control.prop( 'checked' );

    assert.notOk( $control.is( '[checked]' ) );
    assert.ok( $control.prop( 'checked' ) );

  } );

  QUnit.test( 'checkbox/multiple', function ( assert ) {

    var $form = $( '<form><input type="checkbox" name="foo[]" value="bar"><input type="checkbox" name="foo[]" value="baz"></form>' );
    var $control = $form.find( 'input' );
    var $bar = $form.find( 'input' ).eq( 0 );
    var $baz = $form.find( 'input' ).eq( 1 );

    $control.fdef( [] );

    assert.notOk( $bar.is( '[checked]' ) );
    assert.notOk( $baz.is( '[checked]' ) );

    $control.fdef( [ 'bar' ] );

    assert.ok( $bar.is( '[checked]' ) );
    assert.notOk( $baz.is( '[checked]' ) );

    $control.fdef( [ 'baz' ] );

    assert.notOk( $bar.is( '[checked]' ) );
    assert.ok( $baz.is( '[checked]' ) );

    $control.fdef( [ 'bar', 'baz' ] );

    assert.ok( $bar.is( '[checked]' ) );
    assert.ok( $baz.is( '[checked]' ) );

  } );

  QUnit.test( 'radio', function ( assert ) {

    var $form = $( '<form><input type="radio" name="foo" value="bar"><input type="radio" name="foo" value="baz"></form>' );
    var $control = $form.find( 'input' );
    var $bar = $form.find( 'input' ).eq( 0 );
    var $baz = $form.find( 'input' ).eq( 1 );

    assert.equal( $bar.attr( 'value' ), 'bar' );
    assert.equal( $baz.attr( 'value' ), 'baz' );

    $control.fdef( 'baz' );

    assert.notOk( $bar.is( '[checked]' ) );
    assert.ok( $baz.is( '[checked]' ) );

    $control.fdef( 'bar' );

    assert.ok( $bar.is( '[checked]' ) );
    assert.notOk( $baz.is( '[checked]' ) );

  } );

} );
