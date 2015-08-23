var ReactDashboard = React.createClass( {

	getInitialState: function () {
		return {
			elapsed: 0
		};
	},

	update: function () {

		this.setState( { elapsed: this.state.elapsed + 1 } );

	},

	render: function() {

		var items = this.props.store.data;

		return (
			<div className='dashboard'>
				{items.map( function ( d ) {
					return <ReactItem key={d.id} color={d.color} name={d.name} score={d.score} />
				})}
			</div>
		);

	}

} );

var ReactItem = React.createClass( {

	render: function () {

		var style = {
			color: this.props.color
		};

		return (
			<div className='item' style={style} >
				<strong>{this.props.name}</strong><br/>
				S{this.props.score}
			</div>
		);

	}

} );
