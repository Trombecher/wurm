import {Box, Box_insert, mount, tags} from "../../src";

let {div} = tags;
let numbers = new Box([0, 10, 20]);

mount(document.body, Box_insert(numbers, numbers => numbers.map(n => div(`Number: ${n}`))));