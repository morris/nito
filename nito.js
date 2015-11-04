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

		// define component class
		var Comp = function ( el, data, extra ) {
			$.Comp.call( this, el, data, extra );
		};

		// derive from $.Comp
		Comp.prototype = Object.create( $.Comp.prototype );

		// extend prototype with settings
		extend( Comp.prototype, settings );

		// extend with static methods
		extend( Comp, $.Comp );

		// set static members
		var base = settings.base;
		Comp.base = $( isArray( base ) ? base.join( '\n' ) : base )[ 0 ];
		Comp.identify = settings.identify;

		return Comp;

	};

	//

	$.Comp = function ( el, data, extra ) {
		this.$el = $( el ).eq( 0 );
		this.el = this.$el[ 0 ];

		this.setup( data, extra );
		this.update( data, extra );
	};

	extend( $.Comp, {

		appendTo: function ( container, data, extra ) {
			var comp = this.create( data, extra );
			comp.$el.appendTo( container );
			return comp;
		},

		create: function ( data, extra ) {
			return this.setup( this.base ? this.base.cloneNode( true ) : null, data, extra );
		},

		setup: function ( el, data, extra ) {
			return new this( el, data, extra );
		}

	} );

	extend( $.Comp.prototype, {

		setup: function () {},

		update: function () {},

		on: function ( event, handler ) {

			// bind any function in arguments to the component
			var comp = this;
			var args = [].map.call( arguments, function ( arg ) {
				return typeof arg === 'function' ? arg.bind( comp ) : arg;
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

			var container = this[ 0 ];
			if ( !container ) return;
			var children = container.children;
			var map = container.nitoMap = container.nitoMap || {};
			var identify = factory.identify;
			var index = 0;

			// reconcile items with existing components via index or identify()
			var comps = items.map( function ( item ) {

				var key = identify ? identify( item ) : index + 1;
				if ( !key ) throw new Error( 'Invalid key in loop' );
				var comp = map[ key ];

				if ( comp ) {
					// store distance between actual and target index
					comp._sort = Math.abs( index - comp._index );
					comp.update( item, extra );
				} else {
					comp = factory.create( item, extra );
					map[ key ] = comp;
					comp._sort = -index;
				}

				comp._index = index; // target index;
				comp.el.nitoKeep = true;
				comp.el.nitoKey = key;

				++index;

				return comp;

			} );

			// remove obsolete components
			index = 0;
			while ( index < children.length ) {

				var child = children[ index ];

				if ( !child.nitoKeep ) {
					container.removeChild( child );
					delete map[ child.nitoKey ];
				} else {
					++index;
				}

			}

			// append and/or reorder components
			comps.slice( 0 ).sort( function ( a, b ) {

				// sort by distance between actual index and target index
				// sorting keeps number of appends/inserts low
				return b._sort - a._sort || b._index - a._index;

			} ).forEach( function ( comp ) {

				// move each component to its target index
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
						// skip form controls
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

		values: function ( data, defaults ) {

			function parse( name ) {
				return name.replace( /\]/g, '' ).split( /\[/g );
			}

			function tryInt( name ) {
				return name.match( /^\d+$/ ) ? parseInt( name ) : name;
			}

			var $controls = this.filter( '[name]' ).add( this.find( '[name]' ) );

			if ( data === undefined ) { // get values

				data = {};
				$controls.serializeArray().forEach( function ( entry ) {

					var path = parse( entry.name );
					var name = path[ 0 ];
					var current = data;

					for ( var i = 0, l = path.length - 1; i < l; ++i ) {
						var part = path[ i ];
						name = path[ i + 1 ];
						var container = name.match( /^\d*$/ ) ? [] : {};
						current = current[ part ] = current[ part ] || container;
					}

					if ( name === '' ) {
						current.push( entry.value );
					} else {
						current[ tryInt( name ) ] = entry.value;
					}

				} );

				return data;

			}

			// set values
			var valueProp = 'value';
			var checkedProp = 'checked';
			var selectedProp = 'selected';

			if ( defaults ) {
				valueProp = 'defaultValue';
				checkedProp = 'defaultChecked';
				selectedProp = 'defaultSelected';
			}

			$controls.each( function () {

				var value = data;
				parse( this.name ).forEach( function ( part ) {
					if ( value && part !== '' ) value = value[ tryInt( part ) ];
				} );

				var $control = $( this );
				var tagName = this.tagName;
				var type = this.type;

				if ( isArray( value ) ) {

					if ( type === 'checkbox' ) {

						this[ checkedProp ] = value.indexOf( this.getAttribute( 'value' ) ) >= 0;

					} else if ( this.multiple ) { // select[multiple]

						$control.children().each( function () {
							this[ selectedProp ] = value.indexOf( this.getAttribute( 'value' ) ) >= 0;
						} );

					}

				} else {

					if ( value === undefined || value === null ) value = '';

					if ( tagName === 'SELECT' ) {

						$control.children().each( function () {
							this[ selectedProp ] = value == this.getAttribute( 'value' );
						} );

					} else if ( type === 'radio' ) {

						this[ checkedProp ] = value == this.getAttribute( 'value' );

					} else if ( type === 'checkbox' ) {

						this[ checkedProp ] = !!value;

					} else if ( tagName === 'TEXTAREA' ) {

						this[ valueProp ] = value + '';
						if ( defaults ) $control.html( value + '' ); // Support: IE

					} else if (
						type !== 'button' &&
						type !== 'file' &&
						type !== 'image' &&
						type !== 'reset' &&
						type !== 'submit'
					) {

						this[ valueProp ] = value + '';

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
