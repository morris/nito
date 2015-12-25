var $ = require( './dollar' );
var NavItem = require( './NavItem' );
var Page = require( './Page' );

var App = module.exports = $.nito( {

	base: [
		'<div class="app" id="app">',
			'<p><button class="btn btn-default create">New Page</button></p>',
			'<nav class="nav">',
			'</nav>',
			'<div class="active">',
			'</div>',
		'</div>'
	],

	id: 'app',

	mount: function () {
		// ensure initial data
		this.data = {
			pages: [
				{ title: 'Lo', body: 'wut' }
			],
			active: null
		};

		this.on( 'click', '.create', this.create );
	},

	update: function ( data ) {
		if ( data ) this.data = data;
		var active = this.data.active;

		this.find( '.nav' ).loop( this.data.pages.map( function ( page ) {
			return {
				title: page.title,
				active: page === active
			};
		} ), NavItem, this );
		this.find( '.active' ).nest( this.data.active, Page, this );
	},

	show: function ( page ) {
		this.data.active = page;
		this.update();
	},

	create: function () {
		this.data.pages.push( {
			title: 'New Page',
			body: '> What is bravery, without a dash of recklessness?'
		} );
		this.update();
	},

	remove: function () {
		var pages = this.data.pages;
		pages.splice( pages.indexOf( page ), 1 );
		this.update();
	},

	save: function () {

	}

} );
