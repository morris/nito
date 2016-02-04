<img src="logo.png" alt="Nito">

Minimal component library for jQuery, inspired by React and Riot.
Just an experiment. [Or maybe not.](https://rawgit.com/morris/nito/v0.10.0/examples/nito-vs-react/)

```js
var Todo = $.nito( {

	base: [
		'<div>',
			'<h1>Todo</h1>',
			'<ul class="items"></ul>',
		'</div>'
	],

	mount: function () {
		this.data = [
			{ title: 'Get Nito', completed: false },
			{ title: 'Create something', completed: false }
		];
	},

	update: function () {
		this.find( '.items' ).loop( this.data, TodoItem, this );
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
		this.$el.weld( this.data );
		this.$el.classes( { completed: this.data.completed } );
	},

	toggle: function () {
		this.data.completed = !this.data.completed;
		this.todo.update(); // always update explicitly
	}

} );
```

- Create reusable components with jQuery or Zepto
- Promotes one-way data flow
- One simple factory, a few functions, <500 lines
- [No templates](http://blog.nodejitsu.com/micro-templates-are-dead/),
[no virtual DOM](http://blog.500tech.com/is-reactjs-fast/),
[no JSX](https://www.pandastrike.com/posts/20150311-react-bad-idea)
- Not a framework - never gets in the way
- Just $ and standard JavaScript
- Favors explicit code over implicit magic
- Pairs well with [Bootstrap](http://getbootstrap.com)


## Examples

### [Todo](https://rawgit.com/morris/nito/v0.10.0/examples/todo/)

A simple client-side todo app with TodoMVC-like features.

### [Nito vs. React](https://rawgit.com/morris/nito/v0.10.0/examples/nito-vs-react/)

Structural comparison of the two libraries, including benchmark.

### [Markdown Editor](https://github.com/morris/nito/tree/master/examples/markdown)

Isomorphic (server- and client-side) app built with Nito on Node.js.


## Getting started

```html
<script src="jquery-1.11.3.min.js"></script>
<script src="nito.min.js"></script>
```


## Defining components

#### `$.nito( settings )`

- Create a component factory
- `settings` is an object that defines the prototype of the components
	- `id`
		- Component identifier
		- Optional. Mandatory for server-side/shared components
	- `base`
		- Base HTML for components
		- May be a string or an array of strings
		- Arrays will be joined with `\n`
		- Optional, used in `Comp.create` (see below)
	- `mount( env )`
		- Called when mounting a component
		- `env` is used to pass constant references, e.g. the app/store/controller or a parent component
		- Define event handlers here
		- Optional, defaults to noop
	- `update()`
		- Updates the component
		- Has to be called explicitly (except for components rendered with `loop`/`nest`)
		- Use `this.data` to update the component
		- Optional, defaults to noop
	- `unmount()`
		- Called when unmounting a component
	- `identify( item )`
		- Generates keys from items in `loop`
		- Keys are used for component reconciliation
		- Must return a distinct, truthy string or number
		- See `loop`
		- Optional
	- Add more methods and properties as needed
- Returns the created factory


## Creating components

#### `Comp.create( env, data )`

- Create a component using the component base HTML
- `env` is passed to `comp.mount`. Optional
	- Use `env` to pass constant references, e.g. the app/store/controller or a parent component
- `data` is passed to `comp.set`. Optional
	- Use `data` for variable data/state
- Returns the created component

#### `Comp.mount( base, env, data )`

- Create a component using given base HTML, element or selector
- Useful for components with varying or server-rendered HTML
- Only applied once
- See above

#### `Comp.appendTo( selector, env, data )`

- Create a component using `Comp.create` and then append it to `$( selector )`
- See above

#### `Comp.deliver( env, data )`

- Create a component using `Comp.create`
- Returns the outer HTML of the component including serialized data
- Useful for transmission of components from server to client
- See above


## Component members and methods

#### `comp.$el` and `comp.el`

- jQuery object and DOM element pointing to the root element of the component, if any

#### `comp.set( data )`

- Set `data` as `comp.data`
- Call `comp.update()`
- Returns `comp`

#### `comp.find( selector )`

- Shortcut to `comp.$el.find`

#### `comp.on( event, [selector,] handler )`

- Shortcut to `comp.$el.on`
- `handler` is bound to `comp`, *not* to the element
- Returns `comp`


## Nesting components

Super-efficiently nest components in any DOM element using `loop` or `nest`.
Use these methods in `update`, *not* in `mount`.

#### `$el.loop( items, factory, env )`

- For each item, create a component using the factory and append to `$el`
- `items` is an array of `data` passed to the components
- `factory` should be a component factory
- Reconciliation: Existing components are identified with items and reused/updated with given data
	- By default, components are reconciled by item/component index
	- If the `factory.identify` function is defined, components are reconciled by keys
	- New components are created with `factory.create( env, data )`
	- Existing components are updated with `comp.set( data )`
- `$el` must only have children generated by `loop`; don't mix with more children
- Returns array of child components

```js
$( '<ul></ul>' ).loop( [
	{ title: 'Write code', done: true },
	{ title: 'Write readme', done: false }
], TodoItem );
```

#### `$el.nest( item, factory, env )`

- Same as loop, but for one component
- Pass falsy item to not nest anything
- If item is given, needs a valid key
- Returns child component, if any


## Updating components

The following methods are helpful and/or speed optimized
for usage in component `update` methods.

#### `$els.classes( map )`

- Set classes on `$els` softly
- Classes not present in map are not touched
- Function values are computed using each element as `this`
- Returns `$els`

```js
$( '.form-group' ).classes( {
	'has-success': true,
	'has-error': false
} );
```

#### `$els.weld( data, selectors )`

- Set `data` on `$els`
- If `data` is not an object, set `data` as `$els`'s inner HTML softly
	- Function values are computed using each element as `this`
- If `data` is a map of `name: html` pairs:
	- Find `.name` and set the given HTML softly
	- `selectors` is an optional map of `name: selector` pairs
	- If `selectors[ name ]` is given, use that instead of `.name`
- Returns `$els`

```js
$( '<h1></h1>' ).weld( 'hello' );
$( '<div><h1 class="title"></h1><p class="post"></p></div>' )
	.weld( { title: 'hello', contents: 'world' }, { contents: '.post' } );
```

#### `$els.values()`

- Serialize named form controls in `$els` into an object
- Supports all controls and nested names like `object[key]`, `array[index]`, `multiple[]`
- Returns an object containing the values

#### `$els.values( data, defaults )`

- Fill named form controls in `$els` with given data
- Supports all controls and nested data
- If `defaults` is falsy, sets the value properties (user input)
	- User input will be overwritten
	- Form defaults are not modified
- If `defaults` is truthy, sets values on the DOM (form defaults)
	- Modifies DOM attributes like `value` and `selected`, *not* the properties
	- Inputs modified by the user will still reflect the user input
- Use `reset` to discard user input
- Returns `$els`

#### `$els.reset()`

- Reset each form or individual form control in `$els` (without children)
- Returns `$els`


## Mount and update components on existing DOM

#### `$els.mount( factory, env, data )`

- Mount components on each element in `$els` using `factory`
- `env` and `data` are passed to `factory.mount`, both optional
- Components are only created once per factory
	- An element may have multiple components, but only one for each factory
- Returns `$els`

#### `$els.update( factory, data )`

- If `factory` is set, update all components from `factory` mounted on `$els`
- Otherwise, update all components mounted on `$els`
- `data` is passed to `comp.set`. Optional
- Returns `$els`

#### `$els.unmount( factory )`

- If `factory` is set, unmount all components from `factory` mounted on `$els`
- Otherwise, unmount all components mounted on `$els`
- Returns `$els`

## Serialize component data for server-to-client transmission

#### `$els.deliver( html )`

- Serialize all components mounted on `$els` into attributes
- If `html` is set, return the outer HTML of the first element in `$els`
- Otherwise return `$els`
