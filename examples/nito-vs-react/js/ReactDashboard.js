// originally written by Jonathan Miles
// https://github.com/jonmiles/react-performance-tests

// might look cleaner with JSX, didn't want to introduce build steps though

var ReactDashboard = React.createClass( {

  getInitialState: function () {
    return { elapsed: 0 };
  },

  update: function () {
    this.setState( { elapsed: this.state.elapsed + 1 } );
  },

  render: function () {
    var items = this.props.store.data;

    return React.createElement( 'div', { className: 'dashboard' },
      items.map( function ( d ) {
        return React.createElement( ReactItem, { key: d.id, color: d.color,
          name: d.name, score: d.score } );
      } )
    );
  }

} );

var ReactItem = React.createClass( {

  render: function () {
    return React.createElement( 'div',
      { className: 'item', style: { color: this.props.color } },
      React.createElement( 'strong', null, this.props.name ),
      React.createElement( 'br' ),
      'S' + this.props.score
    );
  }

} );
