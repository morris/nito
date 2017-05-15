var NavItem = require( './NavItem' );
var Page = require( './Page' );

module.exports = App;

function App( $el ) {

  console.log( 'mount App' );

  var $ = $el.constructor;
  var $nav = $el.find( '.nav' );
  var $activePage = $el.find( '.activePage' );
  var data = { pages: [] };

  $el.mount( '.nav-item', NavItem );
  $el.mount( '.page', Page );

  $el.on( 'click', 'a', function ( e ) {
    var $a = $( e.target );
    history.pushState( {}, '', $a.attr( 'href' ) );
    e.preventDefault();
    $el.update();
  } );

  $el.on( 'click', '.create', function () {
    $el.dispatch( 'create-page' );
  } );

  $el.on( 'create-page', function () {
    data.pages.push( {
      id: uuid(),
      title: 'Untitled',
      body: '> What is bravery, without a dash of recklessness?'
    } );
    persist();
  } );

  $el.on( 'save-page', function ( e, page ) {
    $.extend( pages.filter( function ( p ) {
      return p.id === page.id;
    } ), data );
    persist();
  } );

  $el.on( 'remove-page', function ( e, page ) {
    var pages = data.pages;
    pages.splice( pages.indexOf( page ), 1 );
    persist();
  } );

  $el.on( 'update', function () {
    var path = $.window.location.pathname;

    $nav.nest( data.pages.map( function ( page ) {
      return {
        title: page.title,
        id: page.id,
        active: '/' + page.id === path
      };
    } ), '#templates .nav-item' );

    $activePage.nest( data.pages.filter( function ( page ) {
      return '/' + page.id === path;
    } ), '#templates .page' );
  } );

  $( $.window ).on( 'popstate', function () {
    $el.update();
  } );

  function persist() {
    $.post( '/', JSON.stringify( data ) );
    $el.update();
  }

  function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, function ( c ) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : ( r & 0x3 | 0x8 );
      return v.toString( 16 );
    } );
  }

}
