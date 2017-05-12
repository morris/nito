function Store() {

  var data = [];
  var nextId = 1;

  function get() {
    return data;
  }

  function change( size, rate ) {

    var i, item;

    size = Math.round( size + ( Math.random() - 0.5 ) * size * rate );

    // add
    for ( i = 0; data.length < size; ++i ) {
      item = randomData();
      item.id = nextId++;
      data.push( item );
    }

    // remove
    for ( i = 0; data.length > size; ++i ) {
      data.splice( random( data ), 1 );
    }

    var modify = Math.floor( data.length * rate );
    for ( i = 0; i < modify; ++i ) {
      $.extend( data[ random( data ) ], randomData() );
    }

    var reinsert = Math.floor( data.length * rate ) - 1;
    for ( i = 0; i < reinsert; ++i ) {
      var from = random( data );
      item = data.splice( from, 1 )[ 0 ];
      var to = random( data );
      data.splice( to, 0, item );
    }

  }

  function random( arr ) {
    return Math.floor( arr.length * Math.random() );
  }

  var names = [ 'foo', 'bar', 'baz', 'one', 'two', 'three' ];
  var colors = [ 'red', 'lime', 'darkblue', 'orange', 'magenta', 'grey' ];

  function randomData() {
    return {
      name: names[ random( names ) ],
      score: Math.round( Math.random() * 10 ),
      color: colors[ random( colors ) ]
    };
  }

  return {
    change: change,
    get: get
  };

}
