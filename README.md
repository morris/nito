<img src="logo.png" width="200" alt="Nito">

Minimal component library for jQuery, inspired by React and Riot.
Just an experiment.
[Or maybe not.](https://cdn.rawgit.com/morris/nito/v1.0.0/examples/nito-vs-react/)

```js
var Todo = $.nito( {

  base: [
    '<div>',
      '<h1>Todo</h1>',
      '<ul class="items"></ul>',
    '</div>'
  ],

  mount: function () {
    this.data = {
      items: [
        { title: 'Get Nito', completed: false },
        { title: 'Create something', completed: false }
      ]
    };
  },

  update: function () {
    this.find( '.items' ).nest( TodoItem, this.data.items, this );
  }

} );

var TodoItem = $.nito( {

  base: [
    '<li>',
      '<strong class="title"></strong>',
    '</li>'
  ],

  mount: function ( todo ) {
    this.todo = todo;
    this.on( 'click', this.toggle );
  },

  update: function () {
    this.find( '.title' ).ftext( this.data.title );
    this.$el.classes( { completed: this.data.completed } );
  },

  toggle: function () {
    this.data.completed = !this.data.completed;
    this.todo.update(); // always update explicitly
  }

} );
```

- Create reusable components with jQuery or Zepto
- Designed for pure update functions, driven by minimal state
- One simple factory, a few functions, <500 lines
- Not a framework - never gets in the way
- Just $ and standard JavaScript
- Pairs well with [Bootstrap](http://getbootstrap.com)


## Examples

### [Todo](https://cdn.rawgit.com/morris/nito/v1.0.0/examples/todo/)

A simple client-side todo app with TodoMVC-like features.

### [Nito vs. React](https://cdn.rawgit.com/morris/nito/v1.0.0/examples/nito-vs-react/)

Structural comparison of the two libraries, including benchmark.

### [Markdown Editor](https://github.com/morris/nito/tree/master/examples/markdown)

Isomorphic app (server- and client-side) built with Nito on Node.js.


## Getting started

```html
<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
<script src="https://cdn.rawgit.com/morris/nito/v1.0.0/nito.min.js"></script>
```


## Defining components

#### `$.nito( settings )`

- Create a component class
- `settings` is an object that defines the prototype of the components
  - `id`
    - Component identifier
    - Optional. Mandatory for server-side/shared components
  - `base`
    - Base HTML for components
    - May be a string or an array of strings
    - Arrays will be joined with `\n`
    - Optional, used in `compClass.create` (see below)
  - `mount( env )`
    - Called when mounting a component
    - `env` is used to pass constant references, e.g. the app/store/controller or a parent component
    - Define event handlers here
    - Optional
  - `update()`
    - Updates the component
    - Has to be called explicitly (except for components rendered with `nest`/`nestOne`)
    - Use `this.data` to update the component
    - Optional
  - `unmount()`
    - Called when unmounting a component
    - Optional
  - `identify( item )`
    - Generates keys from items in `nest`
    - Keys are used for component reconciliation
    - Must return a distinct, truthy string or number per `nest`
    - See `nest`
    - Optional
  - Add more methods and properties as needed
- Returns the created class


## Creating components

#### `compClass.create( data, env )`

- Create a component using the component base HTML
- `data` is passed to `comp.set` and available as `comp.data`. Optional
  - Use `data` for variable data/state
- `env` is passed to `comp.mount`. Optional
  - Use `env` to pass constant references, e.g. the app/store/controller or a parent component
- Return the created element (`$` object)


## Component members and methods

#### `comp.$el` and `comp.el`

- jQuery object and DOM element pointing to the root element of the component, if any

#### `comp.set( data )`

- If `data` is truthy, set `data` as `comp.data`
- Call `comp.update()`
- Return `comp`

#### `comp.find( selector )`

- Shortcut to `comp.$el.find`

#### `comp.on( event, [selector,] handler )`

- Shortcut to `comp.$el.on`
- `handler` is bound to `comp`, *not* to the element
- Return `comp`


## Mount and update components on existing DOM

#### `$els.mount( compClass, data, env )`

- Mount components on each element in `$els` using `compClass`
- `data` is passed to `comp.set`. Optional
- `env` is passed to `comp.mount`. Optional
- Components are only created once per class
  - An element may have multiple components, but only one for each class
- Return `$els`

#### `$els.update( compClass, data )`

- If `compClass` is set, update all `compClass` components mounted on `$els`
- Otherwise, update all components mounted on `$els`
- `data` is passed to `comp.set`. Optional
- Return `$els`

#### `$els.unmount( compClass )`

- If `compClass` is set, unmount all `compClass` components mounted on `$els`
- Otherwise, unmount all components mounted on `$els`
- Return `$els`


## Nesting components

Efficiently nest components in any DOM element using `nest` or `nestOne`.
Use these methods in `update`, *not* in `mount`.

#### `$els.nest( compClass, items, env )`

- For each item, create a component of the given class and append to `$els`
- `items` is an array of `data` objects passed to the components
- `compClass` should be a component class
- Reconciliation: Existing components are identified with items and reused/updated with given data
  - By default, components are reconciled by item/component index
  - If the `compClass.identify` function is defined, components are reconciled by keys
  - New components are created with `compClass.create( data, env )`
  - Existing components are updated with `comp.set( data )`
- `$els` should only have children generated by `nest`
- Return array of child components

```js
$( '<ul></ul>' ).nest( TodoItem, [
  { title: 'Write code', done: true },
  { title: 'Write readme', done: false }
] );
```

#### `$els.nestOne( compClass, item, env )`

- Same as `nest`, but for one item
- Pass falsy item to not nest anything
- Return child component, if any


## Updating components

The following methods are helpful and/or speed optimized
for usage in component `update` methods.

### Basics

#### `$els.classes( map )`

- Set classes on `$els` softly
- Classes not present in map are not touched
- Function values are computed using each element as `this`
- Return `$els`

```js
$( '.form-group' ).classes( {
  'has-success': true,
  'has-error': false
} );
```

#### `$els.fhtml( html )`

- Set inner HTML in `$els` softly
- Faster than `$els.html`
- Return `$els`

#### `$els.ftext( text )`

- Set text content in `$els` softly
- Faster than `$els.text`
- Return `$els`

### Forms

#### `$els.serializeData()`

- Serialize named form controls in `$els` into an object
- Supports all controls and nested names like `object[key]`, `array[index]`, `multiple[]`
- Checkboxes are serialized with their `value`, or `'on'` if no value is present
- Return an object containing the values

#### `$els.fill( data )`

- Fill named form controls in `$els` with given data (JSON-like)
- Supports all controls and nested data
- Return `$els`

```js
$( '[name]' ).fill( {
  title: 'Nito',
  description: '...'
} );
```

#### `$els.fillDef( data )`

- Same as `fill` but for default values
- Return `$els`

#### `$els.fval( value )`

- Set form control value in `$els` softly
- User input will be overwritten
- Form defaults are not modified
- Return `$els`

#### `$els.fdef( value )`

- Set default form control value in `$els` softly
- Modifies DOM attributes like `value` and `selected`, *not* the properties
- Inputs modified by the user will still reflect the user input
- Return `$els`

#### `$els.reset()`

- Reset each form or individual form control in `$els` (without children)
- Return `$els`


## Server-side helpers

#### `$els.deliver()`

- Serialize all component data in `$els` into attributes
- Use before transferring element HTML from server to client
- Return `$els`

#### `$els.outerHtml()`

- Return outer HTML of `$els`
- Use to transfer element HTML from server to client
