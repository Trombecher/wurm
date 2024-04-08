function Box(value) {
    this.l = new Set;
    this.v = value;
}

let
    // Box
    Box_get = box => box.v,
    Box_set = (box, value, oldValue = box.v) => value !== box.v &&
        (box.v = value, box.l[forEach](listener => listener(value, oldValue))),
    Box_attach = (box, listener) => (box.l.add(listener), listener),
    Box_detach = (box, listener) => {
        box.l.delete(listener);
    },
    Box_derive = (box, transform, newBox = new Box(transform(box.v))) =>
        (Box_attach(box, (value, oldValue) => newBox.v = transform(value, oldValue)), newBox),

    // Aliasing
    setAttributeOnElement = (element, key, value) => element.setAttribute(key, value),
    isInstanceOf = (test, prototype) => test instanceof prototype,
    _document = document,
    createText = (text = "") => _document.createTextNode(text),
    nextSibling = element => element.nextSibling,
    _Object = Object,
    _Node = Node,
    createElementString = "createElement",
    _Array = Array,
    forEach = "forEach",

    // Inserting
    Box_insertToString = (box, transform = x => x, textNode = createText(transform(box.v))) =>
        (Box_attach(box, (value, oldValue) => textNode.textContent = transform(value, oldValue)), textNode),
    Box_insert = (box, transform, start = createText(), end = createText()) =>
        (Box_attach(box, element => {
            while(nextSibling(start) !== end) nextSibling(start).remove();
            traverseAndRender(transform(element), node => end.before(node));
        }), [start, transform(box.v), end]),

    traverseAndRender = (element, callback) => isInstanceOf(element, _Node)
        ? callback(element) // Call the callback with the node.
        : isInstanceOf(element, _Array)
            ? element[forEach](element => traverseAndRender(element, callback)) // Call recursively for children
            : element && callback("" + element), // To string if element

    mount = (target, element) => traverseAndRender(element, node => target.append(node)),

    createProxy = namespace => new Proxy({}, {
        get: (
            _,
            tag,
            element
        ) => (firstChildOrAttributes, ...children) => (
            element = namespace
                ? _document[createElementString + "NS"](namespace, tag)
                : _document[createElementString](tag),

                !isInstanceOf(firstChildOrAttributes, _Node) && !_Array.isArray(firstChildOrAttributes) && isInstanceOf(firstChildOrAttributes, _Object)
                    ? _Object.entries(firstChildOrAttributes)[forEach](([key, value]) => key[0] === "_"
                        ? (key = key.slice(1), setAttributeOnElement(
                            element,
                            key,
                            isInstanceOf(value, Box)
                                ? (Box_attach(value => setAttributeOnElement(element, key, value)), value.v)
                                : value
                        ))
                        : element[key] = isInstanceOf(value, Box)
                            ? (Box_attach(value => element[key] = value), value.v)
                            : value)
                    : children.unshift(firstChildOrAttributes),

                mount(element, children),
                element
        ),
    }),
    tags = createProxy(),
    svgTags = createProxy("http://www.w3.org/2000/svg");

export {
    Box,
    Box_get,
    Box_set,
    Box_attach,
    Box_detach,
    Box_derive,
    Box_insertToString,
    Box_insert,
    mount,
    tags,
    svgTags
};