var Store = function () {

  this.data = [];
  var nextId = 1;

  this.change = function ( size, rate ) {

    var data = this.data;
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

  };

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

};
