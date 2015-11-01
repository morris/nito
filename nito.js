/*! Nito v0.8.0 - https://github.com/morris/nito */

;( function ( root, factory ) {

	if ( typeof define === 'function' && define.amd ) {

		define( [], function () { return factory; } );

	} else if ( typeof module === 'object' && module.exports ) {

		module.exports = factory;

	} else {

		factory( root, root.$ );

	}

} )( this, function ( window, $ ) {

	if ( $.nito ) return; // extend $ only once

	var extend = $.extend, isArray = $.isArray, each = $.each;

	$.nito = function ( settings ) {

		// parse settings
		var keyProp = settings.keyProp || 'key'; // deprecated, remove at 1.0.0
		var identify = settings.identify || function ( item ) { return item[ keyProp ]; };
		var base = settings.base;
		base = $( isArray( base ) ? base.join( '\n' ) : base )[ 0 ];

		// define component class
		var Comp = function ( el, data, extra ) {
			$.Comp.call( this, el, data, extra );
		};

		// inherit instance methods
		Comp.prototype = Object.create( $.Comp.prototype );

		// extend prototype with settings
		extend( Comp.prototype, settings );

		// inherit static methods
		extend( Comp, $.Comp );

		// set static settings
		Comp.base = base;
		Comp.identify = identify;

		return Comp;

	};

	//

	$.Comp = function ( el, data, extra ) {
		this.$el = $( el ).eq( 0 );
		this.el = this.$el[ 0 ];
		if ( this.el ) this.el.nitoComp = this;

		this.setup( data, extra );
		this.update( data, extra );
	};

	extend( $.Comp, {

		create: function ( data, extra ) {
			return this.setup( this.base ? this.base.cloneNode( true ) : null, data, extra );
		},

		setup: function ( el, data, extra ) {
			return new this( el, data, extra );
		},

		appendTo: function ( container, data, extra ) {
			var comp = this.create( data, extra );
			comp.$el.appendTo( container );

			return comp;
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

		loop: function ( items, factory, extra ) {

			var identify = factory.identify || function ( item ) { return item.key; };
			var container = this[ 0 ];
			var children = container.children;
			var compMap = container.nitoCompMap = container.nitoCompMap || {};
			var index = 0;

			var comps = items.map( function ( item ) {

				var key = identify( item );
				if ( !key ) throw new Error( 'Undefined key in loop' );
				var comp = compMap[ key ];

				if ( comp ) {
					comp._sort = Math.abs( index - comp._index );
				} else {
					comp = factory.create( item, extra );
					compMap[ key ] = comp;
					comp._sort = -index;
				}

				comp._index = index;
				comp.el.nitoKeep = true;
				comp.el.nitoKey = key;
				comp.update( item, extra );

				++index;

				return comp;

			} );

			index = 0;

			while ( index < children.length ) {

				var child = children[ index ];

				if ( !child.nitoKeep ) {
					container.removeChild( child );
					delete compMap[ child.nitoKey ];
				} else {
					++index;
				}

			}

			comps.slice( 0 ).sort( function ( a, b ) {

				return b._sort - a._sort || b._index - a._index;

			} ).forEach( function ( comp ) {

				var el = comp.el;
				var other = children[ comp._index ];

				if ( !other ) {
					container.appendChild( el );
				} else if ( el !== other ) {
					container.insertBefore( el, other );
				}

				el.nitoKeep = false;

			} );

			return comps;

		},

		nest: function ( item, factory, extra ) {

			if ( item ) return this.loop( [ item ], factory, extra )[ 0 ];
			this.loop( [], factory, extra );

		},

		classes: function ( classes ) {

			return this.each( function () {

				var el = this, $el = $( el );

				each( classes, function ( name, condition ) {
					$el.toggleClass( name, !!funcValue( condition, el ) );
				} );

			} );

		},

		// original idea: https://github.com/tmpvar/weld - thanks!
		weld: function ( data, selectors ) {

			if ( data === null || data === undefined ) data = '';

			if ( typeof data !== 'object' ) {

				return this.each( function () {

					var value = funcValue( data, this ) + '';

					switch ( this.tagName ) {

					case 'INPUT':
					case 'TEXTAREA':
					case 'SELECT':
						break;

					case 'IMG':
						if ( this.src !== value ) this.src = value;
						break;

					default:
						if ( ( this.nitoHTML || this.innerHTML ) !== value ) {
							this.innerHTML = this.nitoHTML = value;
						}

					}

				} );

			}

			selectors = selectors || {};
			var $set = this;

			each( data, function ( name, value ) {
				var selector = selectors[ name ] || ( '.' + name );
				$set.find( selector ).weld( value );
			} );

			return this;

		},

		values: function ( data, defaults, base ) {

			if ( !data ) return this;

			var $container = this;

			var valueProp = 'value';
			var checkedProp = 'checked';
			var selectedProp = 'selected';

			if ( defaults ) {

				valueProp = 'defaultValue';
				checkedProp = 'defaultChecked';
				selectedProp = 'defaultSelected';

			}

			each( data, function ( name, value ) {

				if ( base ) name = base + '[' + name + ']';

				var $control;

				if ( isArray( value ) ) {

					// multiple values

					$control = $container.find( '[name="' + name + '[]"]' );
					$control.each( function () {

						if ( this.type === 'checkbox' ) {

							this[ checkedProp ] = value.indexOf( this.getAttribute( 'value' ) ) >= 0;

						} else if ( this.multiple ) {

							$( this ).children().each( function () {
								this[ selectedProp ] = value.indexOf( this.getAttribute( 'value' ) ) >= 0;
							} );

						}

					} );

				} else if ( value && typeof value === 'object' ) {

					// nested values
					return $container.values( value, defaults, name );

				} else {

					// single values
					$control = $container.find( '[name="' + name + '"]' );
					if ( $control.length === 0 ) return this;

					var control = $control[ 0 ];
					var tagName = control.tagName;
					var type = control.type;

					if ( value === undefined || value === null ) value = '';

					if ( tagName === 'SELECT' ) {

						$control.children().each( function () {

							this[ selectedProp ] = value == this.getAttribute( 'value' );

						} );

					} else if ( type === 'radio' ) {

						$control.each( function () {

							this[ checkedProp ] = value == this.getAttribute( 'value' );

						} );

					} else if ( type === 'checkbox' ) {

						control[ checkedProp ] = !!value;

					} else if (
						type !== 'button' &&
						type !== 'file' &&
						type !== 'image' &&
						type !== 'reset' &&
						type !== 'submit'
					) {

						control[ valueProp ] = value + '';

					} else if ( tagName === 'TEXTAREA' ) {

						control[ valueProp ] = value + '';
						if ( defaults ) $control.html( value + '' ); // IE fix

					}

				}

			} );

			return this;

		},

		reset: function () {

			this.each( function () {

				switch ( this.tagName ) {

				case 'FORM':
					this.reset();
					break;

				case 'INPUT':
					var type = this.type;

					if ( type === 'checkbox' || type === 'radio' ) {

						this.checked = this.defaultChecked;

					} else {

						// text, password, hidden
						this.value = this.defaultValue;

					}

					break;

				case 'TEXTAREA':
					this.value = this.defaultValue;
					break;

				case 'OPTION':
					this.selected = this.defaultSelected;
					break;

				case 'SELECT':
					$( this ).children().reset();
					break;

				}

			} );

			return this;

		}

	} );

	function funcValue( value, context ) {
		return typeof value === 'function' ? value.call( context ) : value;
	}

} );
