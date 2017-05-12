// originally written by Jonathan Miles
// https://github.com/jonmiles/react-performance-tests
// looks cleaner with JSX, didn't want to introduce build steps though

var ReactDashboard = React.createClass( {

  render: function () {
    return React.createElement( 'div', { className: 'dashboard' },
      this.props.store.get().map( function ( d ) {
        return React.createElement( ReactItem, {
          key: d.id, color: d.color,
          name: d.name, score: d.score
        } );
      } )
    );
  },

  update: function () {
    this.setState( { elapsed: this.state.elapsed + 1 } );
  },

  getInitialState: function () {
    return { elapsed: 0 };
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
