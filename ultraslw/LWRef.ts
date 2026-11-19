/*
name: null
description: null
tags: null
*/
// Turu: C#'s `ref` and `out` parameters for the UltrasLW ports. A method that takes `ref T x` or
// `out T x` takes a `Ref<T>` and reads and writes `x.value`; its caller passes `ref(get, set)` over
// its own variable or field, so the method's writes reach it as in C#.

/** A variable a method reads and writes in place (C# `ref` / `out`). */
export interface Ref<T> {
    value: T;
}

/** A `Ref` over a variable or field of the caller: `ref(() => x, (v) => (x = v))`. */
export function ref<T>(get: () => T, set: (value: NoInfer<T>) => void): Ref<T> {
    return {
        get value() {
            return get();
        },
        set value(value: T) {
            set(value);
        },
    };
}

/** C#'s `out _`: a `Ref` whose value is thrown away. */
export function discard<T>(): Ref<T> {
    return { value: undefined as T };
}
