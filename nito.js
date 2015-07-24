/*! nito v0.1.0 - https://github.com/morris/nito */

( function ( nito ) {

	if ( typeof module !== 'undefined' ) module.exports = nito; // server
	else nito( $, window ); // browser

} )( function ( $, window ) {

	if ( $.nito ) return; // extend $ only once

	var extend = $.extend;

	extend( $, {

		nito: function ( settings ) {

			// parse settings
			var idProp = settings.idProp || 'id';
			var base = settings.base;
			if ( $.isArray( base ) ) base = base.join( '\n' );

			// define component class
			var Comp = function ( base, data, extra ) {

				$.Comp.call( this, base, data, extra );

			};

			// inherit instance methods
			Comp.prototype = Object.create( $.Comp.prototype );

			// extend prototype with settings
			$.extend( Comp.prototype, settings );

			// inherit static methods
			$.extend( Comp, $.Comp );

			// set static settings
			Comp.base = base;
			Comp.idProp = idProp;

			return Comp;

		},

		router: function ( router, context ) {

			var handler = router._router ? router : function () {

				var path = window.location.href.split( '#' )[ 1 ] || '';
				var args = path.split( '/' ).filter( function ( arg ) {

					return arg !== '';

				} );
				router.apply( context, args );

			};

			handler._router = true;

			$( window ).on( 'hashchange', handler );

			handler(); // initial call

			return handler;

		},

		routerOff: function ( handler ) {

			$( window ).off( 'hashchange', handler );

		}

	} );

	//

	$.Comp = function ( base, data, extra ) {

		this.$el = $( base ).data( 'comp', this );
		this.setup( data, extra );
		this.update( data, extra );

	};

	extend( $.Comp, {

		create: function ( data, extra ) {

			return this.setup( this.base, data, extra );

		},

		setup: function ( base, data, extra ) {

			return new this( base, data, extra );

		},

		appendTo: function ( container, data, extra ) {

			var comp = this.create( data, extra );
			comp.$el.appendTo( container );

			return comp;

		},

		remove: function ( comp ) {

			comp.$el.remove();

		}

	} );

	extend( $.Comp.prototype, {

		setup: function () {},

		update: function () {},

		on: function ( event, handler ) {

			var self = this;
			var args = [].map.call( arguments, function ( arg ) {

				return typeof arg === 'function' ? arg.bind( self ) : arg;

			} );

			this.$el.on.apply( this.$el, args );

			return this;

		},

		find: function () {

			return this.$el.find.apply( this.$el, arguments );

		}

	} );

	//

	extend( $.fn, {

		nest: function ( item, factory, extra ) {

			return this.loop( [ item ], factory, extra );

		},

		loop: function ( items, factory, extra ) {

			var idProp = factory.idProp || 'id';
			var remove = factory.remove.bind( factory ) || function ( child ) { child.$el.remove(); };
			var childMapKey = '_childMap';
			var $container = $( this );
			var itemMap = {};

			items = items.filter( function ( item ) {

				if ( !item ) return false;

				var id = item[ idProp ];
				if ( !id ) throw new Error( 'Undefined id "' + idProp + '" in loop' );
				if ( itemMap[ id ] ) throw new Error( 'Non-distinct id "' + id + '" in loop' );
				itemMap[ id ] = item;

				return true;

			} );

			var childMap = $container.data( childMapKey ) || {};

			// remove unmapped children

			$.each( childMap, function ( id, child ) {

				if ( !itemMap[ id ] ) {

					remove( child );
					delete childMap[ id ];

				}

			} );

			// reorder existing and append new children

			var index = 0;

			var children = items.map( function ( item ) {

				var id = item[ idProp ];
				var child = childMap[ id ];
				var make = !child;

				if ( make ) {

					child = factory.create( item, extra );
					childMap[ id ] = child;

				}

				child.update( item, extra );
				var $child = child.$el;

				if ( index >= $container.children().length ) {

					$child.appendTo( $container );
					$child.trigger( 'moved' );

				} else if ( make || $child.index() !== index )  {

					if ( index === 0 ) {

						$child.prependTo( $container );

					} else {

						$child.insertAfter( $container.children().eq( index - 1 ) );

					}

					$child.trigger( 'moved' );

				}

				++index;

				return child;

			} );

			$container.data( childMapKey, childMap );

			return children;

		},

		classes: function ( classes ) {

			return this.each( function () {

				var $el = $( this );

				$.each( classes, function ( name, condition ) {

					if ( $el.hasClass( name ) ) {

						if ( !condition ) $el.removeClass( name );

					} else {

						if ( condition ) $el.addClass( name );

					}

				} );

			} );

		},

		// original idea: https://github.com/tmpvar/weld - thanks!
		weld: function ( data, selectors ) {

			if ( data === null || typeof data !== 'object' ) {

				data += '';

				return this.each( function () {

					var $el = $( this );
					var html = $el.html();
					if ( html !== data ) $el.html( data );

				} );

			}

			selectors = selectors || {};
			var $set = this;

			$.each( data, function ( name, value ) {

				var selector = selectors[ name ] || ( '#' + name + ', ' + '.' + name );
				$set.find( selector ).not( 'input, textarea, select' ).weld( value );

			} );

			return this;

		},

		fill: function ( data, base ) {

			var $container = this;

			$.each( data, function ( name, value ) {

				if ( base ) name = base + '[' + name + ']';

				if ( value && typeof value === 'object' ) return $container.fill( value, name );

				var $control;

				if ( $.isArray( value ) ) {

					// multiple values

					$control = $container.find( '[name="' + name + '[]"]' );

					if ( $control.is( 'input[type=checkbox]' ) ) {

						$control.each( function () {

							$( this ).prop( 'checked', value.indexOf( $( this ).attr( 'value' ) ) >= 0 );

						} );

					} else if ( $control.is( 'select[multiple]' ) ) {

						$control.find( 'option' ).each( function () {

							$( this ).prop( 'selected', value.indexOf( $( this ).attr( 'value' ) ) >= 0 );

						} );

					}

				} else {

					// single values

					$control = $container.find( '[name="' + name + '"]' );

					if ( $control.is( 'input[type=text], input[type=password], select, textarea' ) ) {

						$control.val( value );

					} else if ( $control.is( 'input[type=radio]' ) ) {

						$control.each( function () {

							$( this ).prop( 'checked', $( this ).attr( 'value' ) === value );

						} );

					} else if ( $control.is( 'input[type=checkbox]' ) ) {

						if ( typeof value === 'string' ) value = !!parseInt( value );
						$control.prop( 'checked', value );

					}

				}

			} );

			return this;

		}

	} );

} );
