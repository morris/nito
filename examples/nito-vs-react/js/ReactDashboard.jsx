var ReactDashboard = React.createClass( {

  render: function () {
    return <div className='dashboard'>
      {
        this.props.store.data.map( function ( d ) {
          return <ReactItem key={d.id} color={d.color}
            name={d.name} score={d.score} />;
        } )
      }
    </div>;
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
    return <div className='item' style={{color: this.props.color}}>
      <strong>this.props.name</strong>
      <br />
      S{this.props.score}
    </div>;
  }

} );
