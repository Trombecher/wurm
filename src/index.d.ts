export class Box<T> {
    constructor(value: T);
}

export type Listener<T> = (value: T, oldValue: T) => void;
export type TransformListener<T, U> = (value: T, oldValue: T) => U;

export type Ele = Node | number | string | boolean | symbol | null | undefined | Ele[];

export function Box_get<T>(box: Box<T>): T;

export function Box_set<T>(box: Box<T>, value: T): void;

export function Box_attach<T>(box: Box<T>, listener: Listener<T>): Listener<T>;

export function Box_detach<T>(box: Box<T>, listener: Listener<T>): void;

export function Box_derive<T, U>(box: Box<T>, transform: TransformListener<T, U>): Box<U>;

export function Box_insert<T>(box: Box<T>, transform: TransformListener<T, Ele>): Node;

export function Box_insertToString<T>(box: Box<T>, transform?: TransformListener<T, string>): Text;

export function mount(target: Element, element: Ele): void;

export type EF<A = Record<string, any>> = (firstChildOrAttributes?: A | Ele, ...children: Ele[]) => Node;

export const tags: Record<string, EF>;
export const svgTags: Record<string, EF>;