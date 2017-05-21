QUnit.module( 'mount', function () {

  QUnit.test( 'mount', function ( assert ) {

    var mounts = 0;
    var updates = 0;

    function Div( $el ) {

      $el.trigger( 'mount_' );
      $el.addClass( 'nito' );

      $el.on( 'update', function () {
        $el.trigger( 'update_' );
      } );

    }

    $( 'body' ).on( 'mount_', function () {
      ++mounts;
    } ).on( 'update_', function () {
      ++updates;
    } );

    var done = assert.async();

    var $el = $( 'body' ).mount( 'div', Div );

    setTimeout( function () {
      assert.equal( mounts, $( 'div' ).length );
      assert.equal( updates, $( 'div' ).length );
      assert.equal( $( '.nito' ).length, $( 'div' ).length );

      $( 'div' ).update().update().update();

      setTimeout( function () {
        assert.equal( mounts, $( 'div' ).length );
        assert.equal( updates, 2 * $( 'div' ).length );
        assert.equal( $( '.nito' ).length, $( 'div' ).length );
        done();
      }, 100 );

    }, 100 );

  } );

  QUnit.test( 'errors', function ( assert ) {

    assert.throws( function () {
      $().mount();
    }, /mount expects/ );

    assert.throws( function () {
      $().mount( 'div' );
    }, /mount expects/ );

    assert.throws( function () {
      $().mount( function () {} );
    }, /mount expects/ );

  } );

} );
