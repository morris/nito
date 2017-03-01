// store

var store = new Store();
store.change( parseInt( $( '#comps' ).val(), 10 ), 0 );

var nitoDashboard = NitoDashboard.create( null, store ).appendTo( '#nito' );
var reactDashboard = ReactDOM.render(
  React.createElement( ReactDashboard, { store: store } ),
  document.getElementById( 'react' )
);

// benchmark

$( '#benchmark' ).on( 'click', function () {

  var suite = new Benchmark.Suite();
  var comps = parseInt( $( '#comps' ).val(), 10 );
  var rate = parseFloat( $( '#rate' ).val(), 10 );

  suite.add( 'Nito', function () {

    store.change( comps, rate );
    nitoDashboard.update();

  } ).add( 'React', function() {

    store.change( comps, rate );
    reactDashboard.update();

  } ).on( 'cycle', function ( event ) {

    $( '#log' ).append( String( event.target ) + '\n' );

  } ).on( 'complete', function () {

    $( '#log' ).append( 'Fastest is ' + this.filter( 'fastest' )[ 0 ].name + '\n' );

  } ).run( { 'async': true } );

} );

// stats

var stats = new MemoryStats();

stats.domElement.style.position = 'fixed';
stats.domElement.style.right = '0px';
stats.domElement.style.top = '0px';

document.body.appendChild( stats.domElement );

function updateStats() {
  stats.update();
  requestAnimationFrame( updateStats );
}

updateStats();

// code comparison

$( '#code-comparison' ).hide();

$( '#compare-code' ).on( 'click', function () {
  $( '#code-comparison' ).toggle();
} );

$.ajax( 'js/NitoDashboard.js' ).then( function ( source ) {
  $( '#nito-source' ).text( source );
} );

$.ajax( 'js/ReactDashboard.jsx' ).then( function ( source ) {
  $( '#react-source' ).text( source );
} );
