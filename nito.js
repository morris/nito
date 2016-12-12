/*! Nito v1.0.0 - https://github.com/morris/nito */

;( function ( root, factory ) {

  if ( typeof define === 'function' && define.amd ) {
    define( [], function () { return factory; } );
  } else if ( typeof module === 'object' && module.exports ) {
    module.exports = factory;
  } else {
    factory( root.$ );
  }

} )( this, function ( $ ) {

  $.nitoId = $.nitoId || 0;

  var extend = Object.assign || $.extend;
  var isArray = Array.isArray || $.isArray;
  var each = $.each;
  var deliverAttr = 'data-nito-';

  // component class factory

  $.nito = function ( settings ) {

    if ( !settings ) throw new Error( 'Invalid settings' );

    var Comp = function ( el, data, env ) {
      $.Comp.call( this, el, data, env );
    };

    Comp.prototype = Object.create( $.Comp.prototype );

    extend( Comp.prototype, settings, {
      compClass: Comp,
      base: null,
      identify: null,
      id: null
    } );

    var base = settings.base;

    extend( Comp, $.Comp, {
      base: $( isArray( base ) ? base.join( '\n' ) : base )[ 0 ],
      identify: settings.identify,
      id: settings.id || ++$.nitoId
    } );

    return Comp;

  };

  // component base class

  $.Comp = function ( el, data, env ) {
    this.el = el;
    this.$el = $( el );

    // for $.fn.nest
    this._sort = 0;
    this._index = 0;

    this.mount( env );
    this.set( data );
  };

  $.Comp.create = function ( data, env ) {
    if ( !this.base ) throw new Error( 'Cannot create component without base' );
    return $( this.base.cloneNode( true ) ).mount( this, data, env );
  };

  extend( $.Comp.prototype, {

    mount: function () {},

    update: function () {},

    unmount: function () {},

    set: function ( data ) {
      if ( data ) this.data = data;
      this.update();
      return this;
    },

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

    // component lifecycle

    mount: function ( compClass, data, env ) {

      if ( typeof compClass !== 'function' || !compClass.id ) {
        throw new Error( 'Invalid component class' );
      }

      var id = compClass.id;

      return this.each( function () {

        var el = this;

        // mount component only once
        var comps = el.nitoComps = el.nitoComps || {};
        var comp = comps[ id ];

        if ( comp ) return;

        // get serialized data from attribute, if any
        try {
          if ( !data ) data = JSON.parse( $( el ).attr( deliverAttr + id ) || null );
        } catch ( ex ) {
          console.warn( ex );
        }

        // create component
        comps[ id ] = new compClass( el, data, env );

      } );

    },

    update: function ( compClass, data ) {

      return this.eachComp( compClass, function () {
        this.set( data );
      } );

    },

    unmount: function ( compClass ) {

      return this.eachComp( compClass, function () {
        this.unmount();
        delete this.el.nitoComps[ this.compClass.id ];
      } );

    },

    // nesting

    nest: function ( compClass, items, env ) {

      if ( typeof compClass !== 'function' || !compClass.create || !compClass.id ) {
        throw new Error( 'Invalid component class' );
      }
      if ( items && !items.map ) throw new Error( 'Invalid items' );

      var identify = compClass.identify;

      return this.each( function () {

        var container = this;
        var children = container.children;
        var map = container.nitoMap = container.nitoMap || {};
        var index = 0;

        // reconcile items with existing components via index or identify()
        var comps = ( items || [] ).map( function ( item ) {

          var key = identify ? identify( item ) : index + 1;
          if ( !key ) throw new Error( 'Invalid key in nest' );
          var comp = map[ key ];

          if ( comp ) {
            // store distance between actual and target index
            comp._sort = Math.abs( index - comp._index );
            comp.set( item );
          } else {
            comp = compClass.create( item, env )[ 0 ].nitoComps[ compClass.id ];
            map[ key ] = comp;
            comp._sort = -index;
          }

          comp._index = index++; // target index
          comp.el.nitoKeep = true;
          comp.el.nitoKey = key;

          return comp;

        } );

        // remove obsolete components
        index = 0;
        while ( index < children.length ) {

          var child = children[ index ];

          if ( !child.nitoKeep ) {
            $( child ).unmount();
            container.removeChild( child );
            if ( child.nitoKey ) delete map[ child.nitoKey ];
          } else {
            ++index;
          }

        }

        // append and/or reorder components
        comps.sort( function ( a, b ) {

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

      } );

    },

    nestOne: function ( compClass, item, env ) {
      return this.nest( compClass, item ? [ item ] : [], env );
    },

    // manipulation

    classes: function ( classes ) {

      return this.each( function () {

        var el = this, $el = $( el );

        each( classes, function ( name, condition ) {
          $el.toggleClass( name, !!condition );
        } );

      } );

    },

    fhtml: function ( html ) {

      return this.each( function () {
        if ( this.nitoHtml !== html ) {
          this.innerHTML = this.nitoHtml = html;
        }
      } );

    },

    ftext: function ( text ) {

      return this.each( function () {
        if ( this.nitoText !== text ) {
          this.textContent = this.nitoText = text;
        }
      } );

    },

    // forms

    serializeData: function () {

      var data = {};

      this.serializeArray().forEach( function ( entry ) {

        var current = data;
        var path = parseName( entry.name );
        var name = path[ 0 ];

        for ( var i = 0, l = path.length - 1; i < l; ++i ) {
          var part = path[ i ];
          name = path[ i + 1 ];
          var container = name === '' || typeof name === 'number' ? [] : {};
          current = current[ part ] = current[ part ] || container;
        }

        if ( name === '' ) {
          current.push( entry.value );
        } else {
          current[ name ] = entry.value;
        }

      } );

      return data;

    },

    fill: function ( data, def ) {

      return this.each( function () {

        var value = data;
        parseName( this.name || '' ).forEach( function ( part ) {
          if ( value && part !== '' ) value = value[ part ];
        } );
        if ( value === data ) value = '';

        $( this ).fval( value, def );

      } );

    },

    fillDef: function ( data ) {
      return this.fill( data, true );
    },

    fval: function ( value, def ) {

      var valueProp = 'value';
      var selectedProp = 'selected';
      var checkedProp = 'checked';

      if ( def ) {
        valueProp = 'defaultValue';
        selectedProp = 'defaultSelected';
        checkedProp = 'defaultChecked';
      }

      value = toValue( value );

      return this.each( function () {

        var el = this;
        var tagName = el.tagName;
        var type = tagName === 'INPUT' ? el.type : tagName;

        switch ( type ) {
        case 'SELECT':
          var multiple = el.multiple && isArray( value );

          $( el ).children().each( function () {
            var optionValue = this.getAttribute( 'value' ) || this.textContent;
            this[ selectedProp ] = multiple ?
              value.indexOf( optionValue ) >= 0 :
              value === optionValue;
          } );

          break;

        case 'TEXTAREA':
          if ( el[ valueProp ] !== value ) el[ valueProp ] = value;
          if ( def ) $( el ).ftext( value ); // Support: IE
          break;

        case 'radio':
        case 'checkbox':
          var elValue = el.getAttribute( 'value' ) || 'on';
          el[ checkedProp ] = isArray( value ) ?
            value.indexOf( elValue ) >= 0 :
            value === elValue;
          break;

        case 'OPTION':
        case 'button':
        case 'file':
        case 'image':
        case 'reset':
        case 'submit':
          break;

        default: // text, hidden, password, etc.
          if ( el[ valueProp ] !== value ) el[ valueProp ] = value;
        }

      } );

    },

    fdef: function ( value ) {
      return this.fval( value, true );
    },

    reset: function () {

      return this.each( function () {

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

    },

    // util

    deliver: function () {

      // for each component mounted on the given elements,
      // serialize data into attribute for transmission
      return this.eachComp( function () {
        var id = this.compClass.id;
        if ( typeof id === 'string' ) {
          this.$el.attr( deliverAttr + id, JSON.stringify( this.data ) );
        }
      } );

    },

    outerHtml: function () {
      return $( '<div></div>' ).append( this ).html();
    },

    eachComp: function ( compClass, fn ) {

      if ( compClass && fn ) {

        var id = compClass.id;
        return this.each( function () {
          var comp = this.nitoComps && this.nitoComps[ id ];
          if ( comp ) fn.call( comp );
        } );

      }

      fn = fn || compClass;

      return this.each( function () {
        each( this.nitoComps || {}, fn );
      } );

    }

  } );

  function parseName( name ) {
    return name.replace( /\]/g, '' ).split( /\[/g ).map( function ( part ) {
      return part.match( /^\d+$/ ) ? parseInt( part, 10 ) : part;
    } );
  }

  function toValue( value ) {
    if ( value === null || value === undefined || value === false ) return '';
    if ( value === true ) return 'on';
    if ( isArray( value ) ) return value.map( toValue );
    return value + '';
  }

  return $;

} );
