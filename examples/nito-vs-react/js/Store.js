var Store = function () {

	this.data = [];
	var nextId = 1;

	this.change = function ( remove, modify, append, reinsert ) {

		var data = this.data;
		var i;

		for ( i = 0; i < remove && data.length > 0; ++i ) {
			data.splice( random( data ), 1 );
		}

		for ( i = 0; i < modify && data.length > 0; ++i ) {
			$.extend( data[ random( data ) ], randomData() );
		}

		for ( i = 0; i < append; ++i ) {
			var item = randomData();
			item.id = nextId;
			++nextId;
			data.push( item );
		}

		for ( i = 0; i < reinsert && data.length > 1; ++i ) {
			var from = random( data );
			var item = data.splice( from, 1 )[ 0 ];
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
