/*! Nito v2.0.0-beta - https://github.com/morris/nito */

;( function ( root, factory ) {

  if ( typeof define === 'function' && define.amd ) {
    define( [], function () { return factory; } );
  } else if ( typeof module === 'object' && module.exports ) {
    module.exports = factory;
  } else {
    factory( root.$ );
  }

} )( this, function ( $ ) {

  var extend = Object.assign || $.extend;
  var isArray = Array.isArray || $.isArray;
  var each = $.each;

  // $ extensions

  extend( $.fn, {

    // component lifecycle

    mount: function ( func ) {

      return this.each( function () {

        func.call( this );

      } );

    },

    // fast event triggers

    triggerUpdate: function () {

    },

    triggerData: function ( data ) {

    },

    // nesting

    nest: function ( items, fn ) {

      if ( items && typeof items.map !== 'function' ) {
        throw new Error( 'nest expects items with a forEach function' );
      }
      if ( typeof fn !== 'function' ) {
        throw new Error( 'nest expects a function' );
      }

      return this.each( function () {

        var container = this;
        var children = container.children;
        var index = 0;

        // reconcile items with existing components via index or identify()
        ( items || [] ).forEach( function ( item ) {

          var comp = children[ index++ ];
          if ( !comp ) {
            comp = fn( item );
            container.appendChild( $( comp )[ 0 ] );
          }
          $( comp ).triggerData( item );

        } );

        // remove obsolete components
        while ( index < children.length ) {
          container.removeChild( container.lastChild );
        }

      } );

    },

    nestOne: function ( fn, item ) {
      return this.nest( fn, item ? [ item ] : [] );
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
        if ( html === null ) html = ''; // Support: IE
        if ( this.lastHtml !== html ) {
          this.innerHTML = this.lastHtml = html;
        }
      } );

    },

    ftext: function ( text ) {

      return this.each( function () {
        if ( this.lastText !== text ) {
          this.textContent = this.lastText = text;
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
        $.parseName( this.name || '' ).forEach( function ( part ) {
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

      value = $.toValue( value );

      return this.each( function () {

        var el = this;
        var tagName = el.tagName;

        switch ( tagName === 'INPUT' ? el.type : tagName ) {
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

    outerHtml: function () {
      return $( '<div></div>' ).append( this ).html();
    }

  } );

  extend( $, {

    parseName: function ( name ) {
      return name.replace( /\]/g, '' ).split( /\[/g ).map( function ( part ) {
        return part.match( /^\d+$/ ) ? parseInt( part, 10 ) : part;
      } );
    },

    toValue: function ( value ) {
      if ( value === null || value === undefined || value === false ) return '';
      if ( value === true ) return 'on';
      if ( isArray( value ) ) return value.map( toValue );
      return value + '';
    }

  } );

  return $;

} );
