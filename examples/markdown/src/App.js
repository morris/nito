var $ = require( './dollar' );
var NavItem = require( './NavItem' );
var Page = require( './Page' );

module.exports = $.nito( {

  base: [
    '<div class="app" id="app">',
      '<p><button class="btn btn-default create">New Page</button></p>',
      '<ul class="nav nav-tabs">',
      '</ul>',
      '<div class="active-page">',
      '</div>',
    '</div>'
  ],

  id: 'app',

  mount: function ( env ) {
    this.env = env;
    this.data = { pages: [] };
    this.on( 'click', '.create', this.create );
    this.on( 'click', 'a', this.navigate );
    if ( process.browser ) {
      $( env ).on( 'popstate', this.update.bind( this ) );
    }
  },

  update: function () {
    var env = this.env;
    var data = this.data;

    var path = process.browser ? env.location.pathname : env.url;

    this.find( '.nav' ).nest( this.data.pages.map( function ( page ) {
      return {
        title: page.title,
        id: page.id,
        active: '/' + page.id === path
      };
    } ), NavItem, this );

    this.find( '.active-page' ).nest( this.data.pages.filter( function ( page ) {
      return '/' + page.id === path;
    } ), Page, this );
  },

  navigate: function ( e ) {
    var $a = $( e.target );
    history.pushState( {}, '', $a.attr( 'href' ) );
    e.preventDefault();
    this.update();
  },

  create: function () {
    this.data.pages.push( {
      id: this.uuid(),
      title: 'Untitled',
      body: '> What is bravery, without a dash of recklessness?'
    } );
    this.persist();
  },

  remove: function ( page ) {
    var pages = this.data.pages;
    pages.splice( pages.indexOf( page ), 1 );
    this.persist();
  },

  save: function ( page, data ) {
    $.extend( page, data );
    this.persist();
  },

  persist: function () {
    $.post( '/', JSON.stringify( this.data ) );
    this.update();
  },

  uuid: function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, function ( c ) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : ( r & 0x3 | 0x8 );
      return v.toString( 16 );
    } );
  }

} );
