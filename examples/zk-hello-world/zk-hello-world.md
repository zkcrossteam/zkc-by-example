# ZK Hello World!

## Overview

This is a tutorial for initializing an instance of the WebAssembly module and calling the functions within it.

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
// Application image id that has been created and can be used for task proofing, of course, you can upload the wasm application yourself to get the application id (which will cost some ETH)
const ZK_HELLO_WORLD_MD5 = "4470FD5212FCDCAA5B50F3DC538FCDAE";
```

2.  Import ZKC-SDK and `hello-world.wasm` in `index.js`

```javascript
import { WasmSDK } from "../../initWasm/wasmSDK";

const zkHelloWorldURL = new URL(
  "./wasmsrc/c/zk-hello-world.wasm",
  import.meta.url
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
    ? alert("Congratulations! Please submit your proof on-chain!")
    : alert("Not Lucky, pleasy try again");
}
```

4.  Submit proof

```javascript
async function submitProof() {
  withZKCWeb3MetaMaskProvider(async (provider) => {
    const userAddress = await provider.connect();
    // Whether the wallet has been connected
    if (!userAddress) return alert("Please connect your wallet.");

    const luckyNumberValue = +luckyNumberNode.textContent || 0;

    if (luckyNumberValue === 0) return alert("Get your lucky number first!");

    // Information to be signed
    const info = {
      user_address: userAddress.toLowerCase(),
      md5: "your application id from step2",
      public_inputs: [],
      private_inputs: [`0x${luckyNumberValue.toString(16)}:i64`],
    };

    // JSON.stringify
    const msgHexString = ZKCWasmServiceUtil.createProvingSignMessage(info);

    // Sign the message
    let signature;
    try {
      signature = await provider.sign(msgHexString);
    } catch (error) {
      console.error("Signing error:", error, "Signing message", msgHexString);
      return alert("Unsigned Transaction");
    }

    // After the sdk modification is complete, remove the following code
    const zkcWasmServiceHelperBaseURI =
      "https://zkwasm-explorer.delphinuslab.com:8090";

    const endpoint = new ZKCWasmServiceHelper(zkcWasmServiceHelperBaseURI);

    // Submit proof
    const response = await endpoint.addProvingTask({
      ...info,
      signature,
    });

    if (!response?.id)
      return alert(
        "Add proving task failed, Please check your lucky number and try again!"
      );

    console.log("addProvingTask response:", response);
    alert("Add proving task success!");

    // Set the result onto the body
    proofMessageNode.textContent = `Hello World! ZK Proof: https://zkwasm-explorer.delphinuslab.com/task/${response.id}`;
  });
}
```

4.  Load `index.js` file in `index.html`:

```html
<!DOCTYPE html>
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
parcel index.html
```

## More Info

- [Compiling `zk-hello-world.c` into an WebAssembly module][4]
- [Create application][3]

[1]: https://github.com/zkcrossteam/ZKC-SDK
[2]: https://parceljs.org/
[3]: https://dev.zkcross.org/create-app
[4]: https://git-pager.avosapps.us/wasmsrc/c/README.md
