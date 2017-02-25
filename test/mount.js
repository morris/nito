QUnit.module( 'mount', function () {

  var settings = {

    mount: function ( options ) {
      this.options = options;
    },

    update: function () {
      this.$el.trigger( 'update', this.data );
    },

    unmount: function () {
      this.$el.trigger( 'unmount', this.data );
    }

  };

  var A = $.nito( settings );
  var B = $.nito( settings );

  //

  QUnit.test( 'mount', function ( assert ) {

    var $el = $( '<div></div>' )
      .mount( A, 'a*', 'a' )
      .mount( A, 'a_*', 'a_' )
      .mount( B, 'b*', 'b' )
      .mount( B, 'b_*', 'b_' );

    var i = 0;

    $el.eachComp( function () {
      if ( this.constructor === A ) {
        assert.equal( this.data, 'a*' );
        assert.equal( this.options, 'a' );
        ++i;
      } else if ( this.constructor === B ) {
        assert.equal( this.data, 'b*' );
        assert.equal( this.options, 'b' );
        ++i;
      } else {
        throw new Error( '?' );
      }
    } );

    assert.equal( i, 2 );

  } );

  QUnit.test( 'update', function ( assert ) {

    var $el = $( '<div></div>' );
    $el.mount( A, 'x', 'a' );
    $el.mount( B, 'x', 'b' );

    var updates = [];
    $el.on( 'update', function ( e, data ) {
      updates.push( data );
    } );
    $el.update();
    $el.update( A );
    $el.update( A, 'a' );
    $el.update( A, 'test' );
    $el.update( A, null );
    $el.update( B );
    $el.update( B, 'b' );
    $el.update( A );

    assert.deepEqual( updates, [ 'x', 'x', 'x', 'a', 'test', 'test', 'x', 'b', 'test' ] );

  } );

  QUnit.test( 'unmount one', function ( assert ) {

    var $el = $( '<div></div>' );
    $el.mount( A, 'x', 'a' );
    $el.mount( B, 'x', 'b' );

    var updates = [];
    $el.on( 'update', function ( e, data ) {
      updates.push( data );
    } );
    var unmounts = [];
    $el.on( 'unmount', function ( e, data ) {
      unmounts.push( data );
    } );
    $el.update();
    $el.update( A );
    $el.update( A, 'a' );
    $el.unmount( A );
    $el.update( A, 'test' );
    $el.update( B );
    $el.update( B, 'b' );
    $el.unmount( B );
    $el.update( B, 'test' );

    assert.deepEqual( updates, [ 'x', 'x', 'x', 'a', 'x', 'b' ] );
    assert.deepEqual( unmounts, [ 'a', 'b' ] );
    $el.eachComp( function () {
      assert.ok( false );
    } );

  } );

  QUnit.test( 'unmount all', function ( assert ) {

    var $el = $( '<div></div>' );
    $el.mount( A, 'x', 'a' );
    $el.mount( B, 'x', 'b' );

    var updates = [];
    $el.on( 'update', function ( e, data ) {
      updates.push( data );
    } );
    var unmounts = [];
    $el.on( 'unmount', function ( e, data ) {
      unmounts.push( data );
    } );
    $el.update();
    $el.update( A );
    $el.update( A, 'a' );
    $el.update( B );
    $el.update( B, 'b' );
    $el.unmount();
    $el.update( A, 'test' );
    $el.update( B, 'test' );

    assert.deepEqual( updates, [ 'x', 'x', 'x', 'a', 'x', 'b' ] );
    assert.deepEqual( unmounts, [ 'a', 'b' ] );
    $el.eachComp( function () {
      assert.ok( false );
    } );

  } );

  QUnit.test( 'errors', function ( assert ) {

    assert.throws( function () {
      $().mount();
    }, /Invalid component class/ );

    assert.throws( function () {
      $().mount( function () {} );
    }, /Invalid component class/ );

    assert.throws( function () {
      $.nito( {} ).create();
    }, /Cannot create component without base/ );

    assert.throws( function () {
      $.nito().create();
    }, /Invalid settings/ );

  } );

  QUnit.test( 'base join', function ( assert ) {

    assert.equal(
      $.nito( { base: [ '<div>', '</div>' ] } ).create().outerHtml(),
      '<div>\n</div>'
    );

  } );

} );
