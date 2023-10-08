# ZK Hello World!

## Overview

This is a tutorial for initializing an instance of the WebAssembly module and calling the functions within it.

## Setup

### Prerequisite

- [ZKC-SDK][2], which can be installed by executing:

```shell
npm install zkc-sdk
```

### Implementation

1.  Import ZKC-SDK and `hello-world.wasm` in `index.js`

```javascript
import { WasmSDK } from '../../initWasm/wasmSDK';
import helloWorldExample from './zk-hello-world.wasm';
```

2.  Load wasm module instance and call the getLucky function export from wasm module

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

3. Submit proof

```javascript
async function submitProof() {
  withZKCWeb3MetaMaskProvider(async provider => {
    // Whether the wallet has been connected
    if (!userAddress) return alert('Please connect your wallet.');

    const luckyNumberValue = +luckyNumberNode.textContent || 0;

    if (luckyNumberValue === 0) return alert('Get your lucky number first!');

    // Signed information
    const info = {
      user_address: userAddress.toLowerCase(),
      md5: TUTORIAL_MD5,
      private_inputs: luckyNumberValue,
    };

    // Signed string
    const msgHexString = ZKCWasmServiceUtil.createProvingSignMessage(info);

    // Send a signature request
    let signature;
    try {
      signature = await provider.sign(msgHexString);
    } catch (error) {
      console.error('error signing message', error);
      return alert('Unsigned Transaction');
    }

    const endpoint = new ZKCWasmServiceHelper();

    const response = await endpoint.addProvingTask({
      ...info,
      signature,
    });

    console.log('addProvingTask response:', response);
    alert('Add proving task success!');

    // Set the result onto the body
    proofMessageNode.textContent = `Hello World! ZK Proof: ${response}`;
  });
}
```

4. Load `index.js` file in `index.html`:

```html
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>ZK Hello World - AssemblyScript</title>
    <link rel="preload" href="./index.js" as="script" />
  </head>

  <body>
    <script type="module" src="./index.js"></script>
    <button id="get-lucky" onclick="getRandomNumber()">get lucky!</button>
    <p>
      lucky number:
      <span id="lucky-number"></span>
    </p>
    <button id="submit-proof" onclick="submitProof()">
      Submit your proof!
    </button>
    <p id="proof-message"></p>
  </body>
</html>
```

## Demo

[1]: https://www.assemblyscript.org/compiler.html#using-the-compiler
[2]: https://github.com/zkcrossteam/ZKC-SDK
