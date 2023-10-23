# Hello World!

## Overview

This is a tutorial for initializing an instance of the WebAssembly module and calling the functions within it using [ZKC-SDK][1].

## Setup

### Prerequisite

- [ZKC-SDK][1], which can be installed by executing:

```shell
npm install zkc-sdk
```

- [Parcel][2], or other build tool for web

```shell
npm install parcel
```

### Implementation

1.  Import ZKC-SDK and `hello-world.wasm` in `index.js`

```javascript
import { ZKCWasmService } from 'zkc-sdk';

// Get the URL of the wasm file for initializing the WebAssembly instance.
const helloWorldURL = new URL('./wasmsrc/c/hello-world.wasm', import.meta.url);
```

2.  Load wasm module instance and call the add function export from wasm

```javascript
const runWasmAdd = async () => {
  // load wasm module instance
  const { exports } = await ZKCWasmService.loadWasm(helloWorldURL);

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
    <title>Hello World</title>
    <link rel="preload" href="./index.js" as="script" />
  </head>

  <body>
    <script type="module" src="./index.js"></script>
  </body>
</html>
```

## Run

With the following command, you can compile and preview the project

```shell
parcel ./index.html
```

## More Info

- [How to compile Assemblyscript `hello-world.ts` into a WebAssembly module][3]
- [How to compile C `hello-world.c` into a WebAssembly module][4]
- [How to compile Rust `hello-world.rs` into a WebAssembly module][5]

[1]: https://github.com/zkcrossteam/ZKC-SDK
[2]: https://parceljs.org/
[3]: ./wasmsrc/assemblyscript/README.md
[4]: ./wasmsrc/c/README.md
[5]: ./wasmsrc/rust/README.md
