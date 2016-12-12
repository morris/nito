QUnit.module( 'nest', function () {

  var Item = $.nito( {

    base: [
      '<div class="item">',
      '</div>'
    ],

    identify: function ( item ) {
      return item.id;
    },

    update: function () {
      this.$el.text( this.data.title );
    }

  } );

  //

  QUnit.test( 'order, with identify', testLoop );

  QUnit.test( 'order, without identify', function ( assert ) {

    var t = Item.identify;
    Item.identify = null;
    testLoop( assert );
    Item.identify = t;

  } );

  function testLoop( assert ) {

    var $items = $( '<div></div>' );

    $items.nest( Item, [
      { id: 1, title: 'A' },
      { id: 2, title: 'B' },
      { id: 3, title: 'C' },
      { id: 4, title: 'D' },
      { id: 5, title: 'E' },
      { id: 6, title: 'F' },
      { id: 7, title: 'G' }
    ] );

    assert.equal( $items.children().length, 7 );
    assert.equal( join(), 'ABCDEFG' );

    $items.nest( Item, [
      { id: 1, title: 'A' },
      { id: 2, title: 'B' },
      { id: 3, title: 'C' },
      { id: 4, title: 'D' },
      { id: 5, title: 'E' },
      { id: 6, title: 'F' },
      { id: 7, title: 'G' }
    ] );

    assert.equal( $items.children().length, 7 );
    assert.equal( join(), 'ABCDEFG' );

    $items.nest( Item, [
      { id: 1, title: 'A' },
      { id: 3, title: 'C' },
      { id: 4, title: 'D' },
      { id: 5, title: 'E' },
      { id: 6, title: 'F' },
      { id: 2, title: 'B' },
      { id: 7, title: 'G' }
    ] );

    assert.equal( $items.children().length, 7 );
    assert.equal( join(), 'ACDEFBG' );

    $items.nest( Item, [
      { id: 1, title: 'A' },
      { id: 2, title: 'B' },
      { id: 8, title: 'X' },
      { id: 3, title: 'C' },
      { id: 6, title: 'F' },
      { id: 9, title: 'Y' },
      { id: 4, title: 'D' },
      { id: 5, title: 'E' },
      { id: 7, title: 'G' }
    ] );

    assert.equal( $items.children().length, 9 );
    assert.equal( join(), 'ABXCFYDEG' );

    $items.nest( Item, [
      { id: 9, title: 'Y' },
      { id: 8, title: 'X' },
      { id: 3, title: 'C' },
      { id: 1, title: 'A' }
    ] );

    assert.equal( $items.children().length, 4 );
    assert.equal( join(), 'YXCA' );

    $items.nest( Item, [] );

    assert.equal( $items.children().length, 0 );

    $items.nest( Item, [
      { id: 1, title: 'A' },
      { id: 2, title: 'B' },
      { id: 3, title: 'C' },
      { id: 4, title: 'D' },
      { id: 5, title: 'E' },
      { id: 6, title: 'F' },
      { id: 7, title: 'G' }
    ] );

    assert.equal( $items.children().length, 7 );
    assert.equal( join(), 'ABCDEFG' );

    $items.nest( Item, [
      { id: 1, title: 'A' },
      { id: 3, title: 'C' },
      { id: 4, title: 'D' },
      { id: 5, title: 'E' },
      { id: 7, title: 'G' },
      { id: 6, title: 'F' },
      { id: 2, title: 'B' },
    ] );

    assert.equal( $items.children().length, 7 );
    assert.equal( join(), 'ACDEGFB' );

    function join() {
      var s = [];
      $items.children().each( function () {
        s.push( $( this ).html() );
      } );
      return s.join( '' );
    }

  }

  QUnit.test( 'nestOne', function ( assert ) {

    var $items = $( '<div></div>' );

    $items.nestOne( Item, { id: 1, title: 'A' } );

    assert.equal( $items.children().length, 1 );
    assert.equal( $items.children().eq( 0 ).html(), 'A' );

    $items.nestOne( Item, null );

    assert.equal( $items.children().length, 0 );

  } );

  QUnit.test( 'errors', function ( assert ) {

    assert.throws( function () {
      $().nest();
    }, /Invalid component class/ );

    assert.throws( function () {
      $().nest( function () {} );
    }, /Invalid component class/ );

    assert.throws( function () {
      $( '<div></div>' ).nest( $.nito( {} ), true );
    }, /Invalid items/ );

  } );

} );
