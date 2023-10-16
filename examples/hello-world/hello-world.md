# Hello World!

## Overview

This is a tutorial for initializing an instance of the WebAssembly module and calling the functions within it.

## Setup

### Prerequisite

> All the required dependencies are in package.json, and you can install all of them with the `pnpm i` command.if you just prefer to run a single example, you can also install the required dependencies individually with the following commands

- [ZKC-SDK][1], which can be installed by executing:

```shell
npm install zkc-sdk
```

- [Parcel][2], or other build tool for web

```shell
npm install parcel
# or parcel index.html for compiling individually
```

### Implementation

1.  Import ZKC-SDK and `hello-world.wasm` in `index.js`

```javascript
import { WasmSDK } from '../../initWasm/wasmSDK';

const helloWorldURL = new URL('./wasmsrc/c/hello-world.wasm', import.meta.url);
```

2.  Load wasm module instance and call the add function export from wasm

```javascript
const runWasmAdd = async () => {
  // load wasm module instance
  const { exports } = await WasmSDK.connect(helloWorldURL);

  // Call the Add function export from wasm, save the result
  const addResult = exports.add(26, 26);

  // Set the result onto the body
  document.body.textContent = `Hello World! addResult: ${addResult}`;
};

runWasmAdd();
```

3.  Load `index.js` file in `index.html`:

```html
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Hello World - AssemblyScript</title>
    <link rel="preload" href="./index.js" as="script" />
  </head>

  <body>
    <script type="module" src="./index.js"></script>
  </body>
</html>
```

## Demo

With the following command, you can compile and preview the project

```shell
pnpm hello-world
```

## More Info

- [Compiling `hello-world.ts` into an WebAssembly module](./wasmsrc/assemblyscript/README.md)
- [Compiling `hello-world.c` into an WebAssembly module](./wasmsrc/c/README.md)
- [Compiling `hello-world.rs` into an WebAssembly module](./wasmsrc/rust/README.md)

[1]: https://github.com/zkcrossteam/ZKC-SDK
[2]: https://parceljs.org/
