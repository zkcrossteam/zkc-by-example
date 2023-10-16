# ZK Hello World!

## Overview

This is a tutorial for initializing an instance of the WebAssembly module and calling the functions within it.

## Setup

### Prerequisite

> All the required dependencies are in `package.json`, and you can install all of them with the `pnpm i` command.if you just prefer to run a single example, you can also install the required dependencies individually with the following commands

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
// Application image id that has been created and can be used for task proofing, of course, you can upload the wasm application yourself to get the application id (which will cost some ETH)
const ZK_HELLO_WORLD_MD5 = '4470FD5212FCDCAA5B50F3DC538FCDAE';
```

2.  Import ZKC-SDK and `hello-world.wasm` in `index.js`

```javascript
import { withZKCWeb3MetaMaskProvider, ZKCWasmServiceHelper } from 'zkc-sdk';

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
    const userAddress = await provider.connect();
    // Whether the wallet has been connected
    if (!userAddress) return alert('Please connect your wallet.');

    // check network
    try {
      await provider.switchNet();
    } catch (error) {
      console.dir(error);
      return alert(error.message);
    }

    const luckyNumberValue = +luckyNumberNode.textContent || 0;

    if (luckyNumberValue === 0) return alert('Get your lucky number first!');

    // Information to be signed
    const info = {
      user_address: userAddress.toLowerCase(),
      md5: ZK_HELLO_WORLD_MD5,
      public_inputs: [],
      private_inputs: [`0x${luckyNumberValue.toString(16)}:i64`],
    };

    // JSON.stringify
    const messageString = JSON.stringify(info);

    // Sign the message
    let signature;
    try {
      signature = await provider.sign(messageString);
    } catch (error) {
      console.error('Signing error:', error, 'Signing message', messageString);
      return alert('Unsigned Transaction');
    }

    const zkc = new ZKCWasmServiceHelper();

    // Submit proof
    const response = await zkc.addProvingTask({
      ...info,
      signature,
    });

    console.log('addProvingTask response:', response);

    if (!response.body?.application?.uuid)
      return alert(
        'Add proving task failed, Please check your lucky number and try again!',
      );

    alert('Add proving task success!');

    // Set the result onto the body
    proofMessageNode.textContent = `Hello World! ZK Proof: https://scan.zkcross.org/request/${response.body?.application?.uuid}`;
  });
}
```

4.  Load `index.js` file in `index.html`:

```html
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>ZK Hello World - AssemblyScript</title>
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

## Demo

With the following command, you can compile and preview the project

```shell
pnpm zk-hello-world
# or parcel index.html for compiling individually
```

## More Info

- [Compiling `zk-hello-world.c` into an WebAssembly module][3]
- [Create application][4]

[1]: https://github.com/zkcrossteam/ZKC-SDK
[2]: https://parceljs.org/
[3]: ./wasmsrc/c/README.md
[4]: https://dev.zkcross.org/create-app
