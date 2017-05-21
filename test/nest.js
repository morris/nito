QUnit.module( 'nest', function () {

  function Item( $el ) {

    $el.on( 'update', function () {
      var data = $el.data( 'item' );
      $el.text( data.title );
    } );

  }

  QUnit.test( 'nest', function ( assert ) {

    var done = assert.async();

    var $fixture = $( '#qunit-fixture .nest' ).mount( '.item', Item );

    $fixture.nest( [
      { title: 'A' },
      { title: 'B' },
      { title: 'C' },
      { title: 'D' },
      { title: 'E' },
      { title: 'F' },
      { title: 'G' }
    ] );

    $.nextFrame( function () {
      assert.equal( $fixture.children().length, 7 );
      assert.equal( join(), 'ABCDEFG' );
      $fixture.nest( [] );

      $.nextFrame( function () {
        assert.equal( $fixture.children().length, 0 );
        assert.equal( join(), '' );
        $fixture.nest( [ { title: 'F' } ] );

        $.nextFrame( function () {
          assert.equal( $fixture.children().length, 1 );
          assert.equal( join(), 'F' );
          done();
        } );
      } );

    } );

    function join() {
      var s = [];
      $fixture.children().each( function () {
        s.push( $( this ).html() );
      } );
      return s.join( '' );
    }

  } );

  QUnit.test( 'nestOne', function ( assert ) {

    var done = assert.async();

    var $fixture = $( '#qunit-fixture .nestOne' ).mount( '.item', Item );

    $fixture.nestOne( { title: 'A' } );

    $.nextFrame( function () {
      assert.equal( $fixture.children().length, 1 );
      $fixture.nestOne( null );

      $.nextFrame( function () {
        assert.equal( $fixture.children().length, 0 );
        done();
      } );

    } );

  } );

  QUnit.test( 'errors', function ( assert ) {

    assert.throws( function () {
      $().nest();
    }, /nest expects an item array/ );

  } );

} );
