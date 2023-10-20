# Hello World!

## Overview

This is a tutorial for compiling an AssemblyScript file into a WebAssembly module.

## Setup

### Prerequisite

-   [AssemblyScript Compiler][1], which can be installed by executing:

```shell
npm install -g assemblyscript
```

### Implementation

1.  Create `hello-world.ts` AssemblyScript file:

```typescript
/**
 * @param a 32-bit integer
 * @param b 32-bit integer
 * @returns 32-bit interger
 */
export function add(a: i32, b: i32): i32 {
  return a + b;
}
```

2.  Compile `hello-world.ts` into a wasm module which will output a `hello-world.wasm` :

```shell
asc hello-world.ts -o hello-world.wasm
```

[1]: https://www.assemblyscript.org/compiler.html#using-the-compiler