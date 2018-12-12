# Mouse Presence

Centralizes handling of mouse appearance/disappearance events in the browser.


# Installation

npm: `npm install --save mouse-presence`

Yarn: `yarn add mouse-presence`


# API Reference

## `MousePresence.onDisappear(cb)`

`cb`: A callback function that takes no arguments and returns nothing.

returns: A reference to `cb`.

Registers a callback to be called whenever a mouse cursor disappearance is dispatched.

## `MousePresence.onAppear(cb)`

`cb`: A callback function that takes no arguments and returns nothing.

returns: A reference to `cb`.

Registers a callback to be called whenever the mouse is moved after a disappearance was dispatched.
(Moving the mouse after the cursor disappeared will cause it to reappear.)

## `MousePresence.unregisterCallback(cb)`

`cb`: The callback reference to be unregistered.

returns: Nothing.

Unregisters a previously-registered callback from either onDisappear or onAppear (or both).
If no such callback is found, nothing happens.

## `MousePresence.dispatchDisappear()`

returns: Nothing.

Dispatches a mouse disappearance event, which will call all registered onDisappear callbacks (will
only do this once - subsequent calls will have no effect until the next onAppear event occurs).
It will also register a one-time mousemove listener on the document, which when triggered, will
call all registered onAppear callbacks.

## `MousePresence.isPresentNow()`

returns: Boolean indicating whether the mouse cursor is present.

Determine if the mouse cursor is present or not (according to the last reported
appearance/disappearance event).


# Examples

Component A:

```javascript
let MousePresence = require("mouse-presence");

// Gets called on every onDisappear event
MousePresence.onDisappear(() => {
    // Take actions...
});

// Gets called on every onAppear event
MousePresence.onAppear(() => {
    // Take actions...
});
```

Component B:

```javascript
let MousePresence = require("mouse-presence");

// Only gets called for one onDisappear event, then unregisters itself
let disappearCb = MousePresence.onDisappear(() => {
    MousePresence.unregisterCallback(disappearCb);
});
```

Component C:

```javascript
let MousePresence = require("mouse-presence");

// Mouse cursor disappears when typing
this.element.addEventListener('keydown', () => {
    MousePresence.dispatchDisappear();
    // Will immediately dispatch onDisappear
    // Will automatically attach a mousemove listener, upon which onAppear will be dispatched
    // Will not redispatch onDisappear until the onAppear event occurs
});
```
