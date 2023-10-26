# ZK Hello World!

## Overview

This tutorial guides you through initializing an instance of the WebAssembly module, calling its functions, and ensuring the correct execution of the function by generating a zero knowledge proof and verifying it on-chain using the [ZKC-SDK][1].

The goal of this example is to prove that the user has indeed obtained a lucky number that satisfies the condition (number % 2 == 1).

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

1.  Create application through [ZKC-DeveloperCenter][3]

    > This is not a required step, you can use the application image id below to complete the proof.

```javascript
// Application image id that has been created and can be used for task proofing, of course, you can deploy the wasm application yourself to get the application id (which will cost some ETH)
const ZK_HELLO_WORLD_MD5 = '4470FD5212FCDCAA5B50F3DC538FCDAE';
```

2.  Import ZKC-SDK and `hello-world.wasm` in `index.js`

```javascript
import {
  withZKCWeb3MetaMaskProvider,
  ZKCWasmService,
  ZKCProveService,
}

// Get the URL of the wasm file for initializing the WebAssembly instance.
const zkHelloWorldURL = new URL(
  './wasmsrc/c/zk-hello-world.wasm',
  import.meta.url,
);
```

3.  Load wasm module instance and call the getLucky function export from wasm module

```javascript
// get random number
async function getRandomNumber() {
  const randomNumber = Math.ceil(Math.random() * 10);

  luckyNumberNode.textContent = randomNumber;

  // load wasm module instance
  const { exports } = await WasmSDK.connect(ZKHelloWorldExample);

  // Call the checkLucky function export from wasm, check the number
  const isLucky = exports.checkLucky(randomNumber);

  return isLucky
    ? alert('Congratulations! Please submit your proof on-chain!')
    : alert('Not Lucky, pleasy try again');
}
```

4.  Submit proof

```javascript
async function submitProof() {
  withZKCWeb3MetaMaskProvider(async provider => {
    const luckyNumberValue = +luckyNumberNode.textContent || 0;

    if (luckyNumberValue === 0) return alert('Get your lucky number first!');

    // Information to be signed
    const taskInfo = {
      md5: 'ZK_HELLO_WORLD_MD5',
      public_inputs: '(0x)[0-f]*:(i64|bytes|bytes-packed)',
      private_inputs: '(0x)[0-f]*:(i64|bytes|bytes-packed)',
    };

    try {
      var response = await new ZKCProveService().settlement(provider, taskInfo);
    } catch (error) {
      console.dir(error);
      return alert(error.message ? error.message : 'Prove failed!');
    }

    alert('Add proving task success!');

    // Set the result onto the body
    proofMessageNode.textContent = `Hello World! ZK Proof: https://scan.zkcross.org/request/${response.body?.application?.uuid}`;
  });
}
```

5.  Load `index.js` file in `index.html`:

```html
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>ZK Hello World</title>
  </head>

  <body>
    <button id="get-lucky">get lucky!</button>
    <p>
      lucky number:
      <span id="lucky-number"></span>
    </p>
    <button id="submit-proof">Submit your proof!</button>
    <p id="proof-message"></p>
    <script type="module" src="./index.js"></script>
  </body>
</html>
```

## Run

With the following command, you can compile and preview the project

```shell
npm run start
```

## More Info

- [Compiling `zk-hello-world.c` into a WebAssembly module][3]
- [Create application][4]

[1]: https://github.com/zkcrossteam/ZKC-SDK
[2]: https://parceljs.org/
[3]: ./wasmsrc/c/README.md
[4]: https://dev.zkcross.org/create-app
