import {test, expect} from "bun:test";
import {Box, Box_attach, Box_derive, Box_detach, Box_get, Box_set} from "../src";

test("new Box / set / get", () => {
    const box = new Box(0);
    expect(Box_get(box)).toBe(0);

    Box_set(box, 10);
    expect(Box_get(box)).toBe(10);
});

test("attach / detach", () => {
    const box = new Box(0);
    let newValue: number | undefined;

    const listener = Box_attach(box, value => newValue = value);
    Box_set(box, 20);
    expect(newValue).toBe(20);

    Box_detach(box, listener);
    Box_set(box, 40);
    expect(newValue).toBe(40);
});

test("derive", () => {
    const counter = new Box(2);

    const doubled = Box_derive(counter, c => c * c);
    expect(Box_get(doubled)).toBe(4);

    Box_set(counter, 4);
    expect(Box_get(doubled)).toBe(16);
});