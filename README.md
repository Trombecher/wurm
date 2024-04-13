# wurm

![](./wurm.webp)

The smallest web framework, written in JavaScript. Features:

- 🪶 Ultra-lightweight (**~855B** minified and **~650B** minified+gzipped)
- 🦅 Unopinionated
- ✅ Type definitions
- ❌ No dependencies
- ❌ No exceptions
- ❌ Zero setup

Here is the classic "counter" example:

```js
import {
    State,
    getState,
    insertStateToString,
    setState,
    mount,
    tags
} from "wurm";

let {button} = tags;
let counter = new State(0);

mount(document.body, button(
    {onclick: () => setState(counter, getState(counter) + 1)},
    "Clicked: ",
    insertStateToString(counter)
));
```

You can install `wurm` via [NPM](https://www.npmjs.com/package/wurm):

```shell
bun i wurm
```

> Note: This framework is a reimplementation of common features from [Aena](https://github.com/trombecher/aena) and will eventually succeed it.

## Docs

This framework is very small, so the docs fit right into the README.

### Elements

You can create elements by destructuring the tag names from the `tags` (or `svgTags`, for SVG namespace) export and calling them:

```js
import {tags} from "wurm";

let {div} = tags;

mount(document.body, div({}, "Hi"));
```

Those return nodes, but you can insert any valid value. Component handling is up to you :). You can append/add/mount elements to containers via the `mount` function.

#### Arguments

Arguments are passed as a `Record` (object) into the first argument of the element function. If no children succeed it, it can be omitted.

All properties you want to end up being assigned to the JavaScript object (like `onclick` or `type`) are not modified, but all properties, that should end up as attributes on the HTML element are prefixed with `_`, like `_d` on a path element.

### State

wurm provides you with `State`, a signal-based state solution. It follows the basic operations:

```js
import {State, setState, getState} from "wurm";

let state = new State(0); // Create
setState(state, 10); // Set
console.log(getState(state)) // Get, logs 10
```

You can attach/detach listeners to the `State` to get notified when the value changes:

```js
import {State, attach, detach} from "wurm";

let message = new State("Hi");
let listener = attach(message, (newMessage, oldMessage) => {
    // ...
});
detach(message, listener);
```

If some values are based off others, deriving is a solution:

```js
import {State, deriveState} from "wurm";

let count = new State(2);
let square = deriveState(count, count => count * count); // Always contains the square of count.
```

### Integrating State

`State` can be integrated via `insertStateToString`:

```js
import {State, insertStateToString, mount} from "wurm";

let count = new State(0);

mount(document.body, [
    "Count: ",
    insertStateToString(count),
    ", Double: ",
    insertStateToString(count, count => `${count * count}`)
]);
```

or mapped to dynamically rendered nodes via `insertState`:

```js
import {State, insertState, mount, tags} from "wurm";

let {div} = tags;
let numbers = new State([0, 10, 20]);

mount(document.body, insertState(numbers, numbers => numbers.map(n => div(`Number: ${n}`))));
```

---

**🚀 You're done! Start making some apps!**

---

## Internals: Decreasing Bundle Size

There are a few number of tips and tricks implemented to reduce the bundle size immensely:

### Aliasing Common Variables And Behavior

Global object, like `document` or `Object` are aliased to local variables on multiple use.

```js
let
    _document = document,
    createElement = (tag, namespace) => namespace
        ? _document.createElementNS(namespace, tag)
        : _document.createElement(tag);
```

### "Dissolving" JavaScript Classes

Methods names on classes are not minified because they are property keys on the prototype object and **object property keys cannot be minified**. A regular JavaScript class looks like this:

```js
class State {
    #value; // optional
    
    constructor(value) {
        this.#value = value;
    }
    
    set(value) {
        this.#value = value;
    }
    
    get(value) {
        return this.#value;
    }
}
```

There are a few things bloating the minified output: keywords `constructor`, `return` and `this`, unminified methods `get` and `set` and the unminified property `#value`. Private variables are enforcing runtime safety but this safety can be moved to the compile time using type declarations: so they are basically useless. By minifying the property by hand, the bundle size decreases even more:

```js
class State {
    constructor(value) {
        this.v = value;
    }
    
    set(value) {
        this.v = value;
    }

    get(value) {
        return this.v;
    }
}
```

Now we can move on to move the methods out of the class, so they can be minified. This typically results in ugly code, but it is worth it considering bundle size. Also recall that JavaScript classes are just constructor functions, invoked with `new`:

```js
function State(value) {
    this.v = value;
}

let
    getState = state => state.v,
    setState = (state, value) => {
        state.v = value;
    };
```

We also moved from `function`s to anonymous arrow functions, operating _on_ the State than _in_ the State. But we have to keep the constructor a `function` because we have to access `this`.