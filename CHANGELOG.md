# Changelog

## v0.9.0

- Renamed `setup` to `mount`
- Renamed `extra` to `env`
- Reordered `data, env` to `env, data`
- Added `$.fn.mount`
- Added `$.fn.update`
- `mount` now only gets `env`
- `update` now only gets `data`

## v0.8.0

- `values` is now able to serializes form controls
- Removed `keyProp` in favor of new `identify` method
	- Reconciliation uses the item index by default
- Optimized `weld`

## v0.7.1

- Fixed `classes` edge cases
- Fixed `values` edge cases
- Fixed `values` nested bug
- Added tests

## v0.7.0

- Components are now created via `clone`
- Optimized `loop`
- Renamed `idProp` to `keyProp` and default to `key`
- Renamed `fill` to `values`
- `weld` now only selects `.name`
- Removed `$.fn.style` and `$.fn.attrs`
	- Benchmarks show that `$.fn.css` and `$.fn.attr` are faster
	- Browsers are/should be smart enough not to repaint/reflow if a style/attribute is unchanged
- Added React comparison example

## v0.6.0

- Improved todo example
- `fill` can now set default values or user values
- Added `$.fn.reset` method
- `$.fn.classes`, `$.fn.styles`, `$.fn.attrs` and `$.fn.weld` now accept functions as values

## v0.5.0

- Fixed `fill`: Now fills the DOM, *not* the value props
- Added `fill` tests
- Fixed zepto dependency

## v0.4.1

- Improved `fill` and `weld`

## v0.4.0

- Added `style` and `attrs` methods
- Added tests
- Added changelog
- Removed router
