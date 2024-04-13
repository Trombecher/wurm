export class State<T> {
    private _;

    constructor(value: T);
}

// export class List<T> extends Array<T> {
//     private _;
//
//     private constructor();
// }

export type Listener<T> = (value: T, oldValue: T) => void;

export type TransformListener<T, U> = (value: T, oldValue: T) => U;

export type Ele = Node | number | string | boolean | symbol | null | undefined | Ele[];

// export function createList<T>(array: T[]): List<T>;

// export function insertList<T>(list: List<T>, transform: (value: T, index: number) => Ele): Ele[];

export function getState<T>(state: State<T>): T;

export function setState<T>(state: State<T>, value: T): void;

export function deriveState<T, U>(state: State<T>, transform: TransformListener<T, U>): State<U>;

export function insertState<T>(state: State<T>, transform: TransformListener<T, Ele>): Node;

export function insertStateToString<T>(state: State<T>, transform?: TransformListener<T, string>): Text;

export function attach<T>(to: State<T>, listener: Listener<T>): Listener<T>;

export function detach<T>(to: State<T>, listener: Listener<T>): void;

export function mount(target: Element, element: Ele): void;

export type EF<A = Record<string, any>> = (attributes?: A, ...children: Ele[]) => Node;

export const tags: Record<string, EF>;
export const svgTags: Record<string, EF>;