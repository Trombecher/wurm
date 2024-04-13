function State(value) {
    this.l = new Set;
    this.v = value;
}

let
    // State
    getState = state => state.v,
    setState = (state, value, oldValue = state.v) => value !== state.v &&
        (state.v = value, state.l[forEach](listener => listener(value, oldValue))),
    deriveState = (state, transform, newState = new State(transform(state.v))) =>
        (attach(state, (value, oldValue) => setState(newState, transform(value, oldValue))), newState),
    attach = (state, listener) => (state.l.add(listener), listener),
    detach = (state, listener) => {
        state.l.delete(listener);
    },

    // Aliasing
    setAttributeOnElement = (element, key, value) => element.setAttribute(key, value),
    isInstanceOf = (test, prototype) => test instanceof prototype,
    _document = document,
    createText = text => _document.createTextNode(text || ""),
    nextSibling = element => element.nextSibling,
    createElementString = "createElement",
    forEach = "forEach",

    // Inserting
    insertStateToString = (state, transform = x => x, textNode = createText(transform(state.v))) =>
        (attach(state, (value, oldValue) => textNode.textContent = transform(value, oldValue)), textNode),

    insertState = (state, transform, start = createText(), end = createText()) =>
        (attach(state, element => {
            while(nextSibling(start) !== end) nextSibling(start).remove();
            traverseAndRender(transform(element), node => end.before(node));
        }), [start, transform(state.v), end]),

    traverseAndRender = (element, callback) => isInstanceOf(element, Node)
        ? callback(element) // Call the callback with the node.
        : isInstanceOf(element, Array)
            ? element[forEach](element => traverseAndRender(element, callback)) // Call recursively for children
            : element && callback("" + element), // To string if element

    mount = (target, element) => traverseAndRender(element, node => target.append(node)),

    createProxy = namespace => new Proxy({}, {
        get: (
            _,
            tag,
            element
        ) => (attributes, ...children) => (
            element = namespace
                ? _document[createElementString + "NS"](namespace, tag)
                : _document[createElementString](tag),

                Object.entries(attributes || {})[forEach](([key, value]) => key[0] === "_"
                    ? (key = key.slice(1), setAttributeOnElement(
                        element,
                        key,
                        isInstanceOf(value, State)
                            ? (attach(value, value => setAttributeOnElement(element, key, value)), value.v)
                            : value
                    ))
                    : element[key] = isInstanceOf(value, State)
                        ? (attach(value, value => element[key] = value), value.v)
                        : value),

                mount(element, children),
                element
        ),
    }),
    tags = createProxy(),
    svgTags = createProxy("http://www.w3.org/2000/svg");

export {
    State,
    getState,
    setState,
    attach,
    detach,
    deriveState,
    insertState,
    insertStateToString,
    mount,
    tags,
    svgTags
};