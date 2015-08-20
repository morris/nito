/*! Nito v0.5.0 - https://github.com/morris/nito */

;( function ( root, factory ) {

	if ( typeof define === 'function' && define.amd ) {

		define( [], function () {

			return factory;

		} );

	} else if ( typeof module === 'object' && module.exports ) {

		module.exports = factory;

	} else {

		factory( root, root.$ );

	}

} )( this, function ( window, $ ) {

	if ( $.nito ) return; // extend $ only once

	var extend = $.extend, isArray = $.isArray, each = $.each;

	extend( $, {

		nito: function ( settings ) {

			// parse settings
			var idProp = settings.idProp || 'id';
			var base = settings.base;
			if ( isArray( base ) ) base = base.join( '\n' );

			// define component class
			var Comp = function ( base, data, extra ) {

				$.Comp.call( this, base, data, extra );

			};

			// inherit instance methods
			Comp.prototype = Object.create( $.Comp.prototype );

			// extend prototype with settings
			extend( Comp.prototype, settings );

			// inherit static methods
			extend( Comp, $.Comp );

			// set static settings
			Comp.base = base;
			Comp.idProp = idProp;

			return Comp;

		}

	} );

	//

	$.Comp = function ( base, data, extra ) {

		this.$el = $( base );
		if ( this.$el.length > 0 ) this.$el[ 0 ].nitoComp = this;
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

			return this.loop( [ item ], factory, extra )[ 0 ];

		},

		loop: function ( items, factory, extra ) {

			var idProp = factory.idProp || 'id';
			var remove = factory.remove.bind( factory ) || function ( child ) { child.$el.remove(); };
			var $container = this.eq( 0 );
			var container = this[ 0 ];
			var itemMap = {};

			items = items.filter( function ( item ) {

				if ( !item ) return false;

				var id = item[ idProp ];
				if ( !id ) throw new Error( 'Undefined id "' + idProp + '" in loop' );
				if ( itemMap[ id ] ) throw new Error( 'Non-distinct id "' + id + '" in loop' );
				itemMap[ id ] = item;

				return true;

			} );

			var childMap = container.nitoChildMap || {};

			// remove unmapped children

			each( childMap, function ( id, child ) {

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

				} else if ( make || $child.index() !== index ) {

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

			container.nitoChildMap = childMap;

			return children;

		},

		classes: function ( classes ) {

			return this.each( function () {

				var el = this, $el = $( el );

				each( classes, function ( name, condition ) {

					$el.toggleClass( name, funcValue( condition, el ) );

				} );

			} );

		},

		style: function ( css ) {

			return this.each( function () {

				var el = this, $el = $( el );

				each( css, function ( prop, value ) {

					value = funcValue( value, el );
					if ( $el.css( prop ) !== value ) $el.css( prop, value );

				} );

			} );

		},

		attrs: function ( attrs ) {

			return this.each( function () {

				var el = this, $el = $( el );

				each( attrs, function ( name, value ) {

					value = funcValue( value, el );
					if ( $el.attr( name ) !== value ) $el.attr( name, value );

				} );

			} );

		},

		// original idea: https://github.com/tmpvar/weld - thanks!
		weld: function ( data, selectors ) {

			if ( data === null || typeof data === 'undefined' ) data = '';

			if ( typeof data !== 'object' ) {

				return this.each( function () {

					var value = funcValue( data, this ) + '';
					var $el = $( this );
					var html = $el.html();
					if ( html !== value ) $el.html( value );

				} );

			}

			selectors = selectors || {};
			var $set = this;

			each( data, function ( name, value ) {

				var selector = selectors[ name ] || ( '#' + name + ', ' + '.' + name );
				$set.find( selector ).not( 'input, textarea, select' ).weld( value );

			} );

			return this;

		},

		fill: function ( data, user, base ) {

			if ( !data ) return this;

			var $container = this;
			var valueProp = 'defaultValue';
			var checkedProp = 'defaultChecked';
			var selectedProp = 'defaultSelected';

			if ( user ) {

				valueProp = 'value';
				checkedProp = 'checked';
				selectedProp = 'selected';

			}

			each( data, function ( name, value ) {

				if ( base ) name = base + '[' + name + ']';

				var $control;

				if ( isArray( value ) ) {

					// multiple values

					$control = $container.find( '[name="' + name + '[]"]' );
					$control.each( function () {

						if ( this.type === 'checkbox' ) {

							setModified( this, checkedProp, value.indexOf( this.getAttribute( 'value' ) ) >= 0 );

						} else if ( this.multiple ) {

							$( this ).children().each( function () {

								setModified( this, selectedProp, value.indexOf( this.getAttribute( 'value' ) ) >= 0 );

							} );

						}

					} );

				} else if ( value && typeof value === 'object' ) {

					// nested values

					return $container.fill( value, user, name );

				} else {

					// single values

					$control = $container.find( '[name="' + name + '"]' );
					if ( $control.length === 0 ) return this;

					var control = $control[ 0 ];
					var tagName = control.tagName;
					var type = control.type;

					if ( tagName === 'SELECT' ) {

						$control.find( 'option' ).each( function () {

							setModified( this, selectedProp, value === this.getAttribute( 'value' ) );

						} );

					} else if ( type === 'radio' ) {

						$control.each( function () {

							setModified( this, checkedProp, value === this.getAttribute( 'value' ) );

						} );

					} else if ( type === 'checkbox' ) {

						control[ checkedProp ] = value;

					} else if (
						type === 'text' ||
						type === 'password' ||
						type === 'hidden'
					) {

						setModified( control, valueProp, value );

					} else if ( tagName === 'TEXTAREA' ) {

						setModified( control, valueProp, value );
						if ( !user ) $control.html( value ); // IE needs this

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
					$( this ).find( 'option' ).reset();
					break;

				}

			} );

			return this;

		}

	} );

	function funcValue( value, context ) {

		return typeof value === 'function' ? value.call( context ) : value;

	}

	function setModified( object, property, value ) {

		if ( object[ property ] !== value ) object[ property ] = value;

	}

} );
