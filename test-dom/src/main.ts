import {
    State,
    getState,
    setState,
    insertState,
    insertStateToString,
    attach,
    detach,
    deriveState,
    mount,
    tags,
    svgTags,
} from "../../src";

let {div, main} = tags;
let {p} = svgTags;
let numbers = new State([0, 10, 20]);

let listener = attach(numbers, n => console.log(n));
detach(numbers, listener);

let double_numbers = deriveState(numbers, n => n.map(n => n * n));
setState(numbers, [20, 40, 60]);

console.log(getState(numbers))

mount(document.body, main({},
    p(),
    insertStateToString(double_numbers),
    insertState(numbers, numbers => numbers.map(n => div({}, `Number: ${n}`))),
));