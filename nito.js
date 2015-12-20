/*! Nito v0.10.0 - https://github.com/morris/nito */

;( function ( root, factory ) {

	if ( typeof define === 'function' && define.amd ) {
		define( [], function () { return factory; } );
	} else if ( typeof module === 'object' && module.exports ) {
		module.exports = factory;
	} else {
		factory( root, root.$ );
	}

} )( this, function ( window, $ ) {

	if ( $.nito ) return $; // extend $ only once

	var extend = $.extend, isArray = $.isArray, each = $.each;

	// class factory

	$.nito = function ( settings ) {

		// derive from $.Comp
		var Comp = function ( el, env, data ) {
			$.Comp.call( this, el, env, data );
		};

		Comp.prototype = Object.create( $.Comp.prototype );
		Comp.prototype.factory = Comp;

		// extend with static methods
		extend( Comp, $.Comp );

		// set static members
		var base = settings.base;
		Comp.base = $( isArray( base ) ? base.join( '\n' ) : base )[ 0 ];
		Comp.identify = settings.identify;
		Comp.id = settings.id || ++$.nitoId;

		// extend prototype with settings; unset static settings
		var proto = extend( Comp.prototype, settings );
		delete proto.base;
		delete proto.identify;
		delete proto.id;

		return Comp;

	};

	// component class

	$.Comp = function ( el, env, data ) {
		this.el = el;
		this.$el = $( el );

		this.mount( env );
		this.update( data );
	};

	extend( $.Comp, {

		appendTo: function ( container, env, data ) {
			var comp = this.create( env, data );
			comp.$el.appendTo( container );
			return comp;
		},

		create: function ( env, data ) {
			return this.mount( this.base ? this.base.cloneNode( true ) : null, env, data );
		},

		mount: function ( el, env, data ) {

			var $el = $( el ).eq( 0 );
			el = $el[ 0 ];

			// component without element
			if ( !el ) return new this( null, env, data );

			// mount component only once
			var comps = el.nitoComps = el.nitoComps || {};
			var comp = comps[ this.id ];

			if ( comp ) return comp;

			// get serialized data from attribute, if any
			try {
				if ( !data ) data = JSON.parse( $el.attr( deliverAttr + this.id ) );
			} catch ( ex ) {
				console.warn( ex );
			}

			// create component
			comp = comps[ this.id ] = new this( el, env, data );
			return comp;

		},

		deliver: function ( env, data ) {
			return this.create( env, data ).$el.deliver( true );
		}

	} );

	$.nitoId = 0;

	extend( $.Comp.prototype, {

		mount: function () {},

		update: function () {},

		on: function () {

			// bind any function argument to the component
			var comp = this;
			var args = [].map.call( arguments, function ( arg ) {
				return typeof arg === 'function' ? arg.bind( comp ) : arg;
			} );

			comp.$el.on.apply( comp.$el, args );
			return comp;

		},

		find: function () {
			return this.$el.find.apply( this.$el, arguments );
		}

	} );

	// $ extensions

	extend( $.fn, {

		mount: function ( factory, env, data ) {

			return this.each( function () {
				factory.mount( this, funcValue( env, this ), funcValue( data, this ) );
			} );

		},

		update: function ( factory, data ) {

			return this.comps( factory, function () {
				this.update( funcValue( data, this ) );
			} );

		},

		comps: function ( factory, fn ) {

			if ( factory && fn ) {

				var id = factory.id;
				return this.each( function () {
					var comp = this.nitoComps && this.nitoComps[ id ];
					if ( comp ) fn.call( comp );
				} );

			}

			fn = fn || factory;

			return this.each( function () {
				each( this.nitoComps || {}, fn );
			} );

		},

		loop: function ( items, factory, env ) {

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
					comp.update( item );
				} else {
					comp = factory.create( env, item );
					map[ key ] = comp;
					comp._sort = -index;
				}

				comp._index = index; // target index
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
					if ( child.nitoKey ) delete map[ child.nitoKey ];
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

		nest: function ( item, factory, env ) {

			if ( item ) return this.loop( [ item ], factory, env )[ 0 ];
			this.loop( [], factory, env );

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
				return name.match( /^\d+$/ ) ? parseInt( name, 10 ) : name;
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
				var type = tagName === 'INPUT' ? this.type : tagName;

				if ( value === undefined || value === null ) value = '';

				switch ( type ) {
				case 'SELECT':
					var multiple = this.multiple && isArray( value );

					$control.children().each( function () {
						this[ selectedProp ] = multiple ?
							value.indexOf( this.getAttribute( 'value' ) ) >= 0 :
							value == this.getAttribute( 'value' );
					} );

					break;

				case 'TEXTAREA':
					this[ valueProp ] = value + '';
					if ( defaults ) $control.html( value + '' ); // Support: IE
					break;

				case 'radio':
					this[ checkedProp ] = value == this.getAttribute( 'value' );
					break;

				case 'checkbox':
					this[ checkedProp ] = isArray( value ) ?
						value.indexOf( this.getAttribute( 'value' ) ) >= 0 :
						!!value;
					break;

				case 'button':
				case 'file':
				case 'image':
				case 'reset':
				case 'submit':
					break;

				default: // text, hidden, password, etc.
					this[ valueProp ] = value + '';
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
					if ( this.type === 'checkbox' || this.type === 'radio' ) {
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

		},

		deliver: function ( html ) {

			// for each component on the matched elements, serialize data into attribute
			this.comps( function () {
				var id = this.factory.id;
				if ( typeof id === 'string' ) {
					this.$el.attr( deliverAttr + id, JSON.stringify( this.data ) );
				}
			} );

			// return outer html or elements
			return html ? $( '<div></div>' ).append( this[ 0 ] ).html() : this;

		}

	} );

	var deliverAttr = 'data-nito-';

	function funcValue( value, context ) {
		return typeof value === 'function' ? value.call( context ) : value;
	}

	return $;

} );
