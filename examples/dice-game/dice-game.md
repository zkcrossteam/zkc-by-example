# Hello World!

## Overview

This is a tutorial for initializing an instance of the WebAssembly module and calling the functions within it.

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
const zkc = new ZKCWasmServiceHelper();
const response = await zkc.createApplication({
  address: 'userAddress',
  name: 'dice-game-test1',
  description: 'Dice game test1',
  chainList: [5],
  signature: 'userAddress',
  data: ['Wasm File', 'Icon File Max size 128x128'],
});

const DICE_GAME_MD5 = response?.body?.md5 || '665272C6FD6E4148784BF1BD2905301F';
```

2.  Import ZKC-SDK and `dice-game.wasm` in `index.jsx`

```javascript
import { withZKCWeb3MetaMaskProvider, ZKCWasmServiceHelper } from 'zkc-sdk';

// Get the URL of the wasm file for initializing the WebAssembly instance.
const diceGameUrl = new URL('./wasmsrc/c/dice-game.wasm', import.meta.url);
```

3.  Load wasm module instance and call the getLucky function export from wasm module

```javascript
useEffect(() => {
  ZKCWasmServiceHelper.loadWasm(diceGameUrl).then(
    ({ exports: { init, setBoard, getResult } }) => {
      init();
      diceArr.forEach(setBoard);
      setSum(getResult);
    },
  );
}, [diceArr]);
```

4.  Submit proof

- create a task for proof:

```javascript
// private inputs
// Input must be empty or have format (0x)[0-f]*:(i64|bytes|bytes-packed) and been separated by spaces (eg: 0x12:i64).
const witness = useMemo(
  () => [
    `0x${diceArr.length.toString(16)}:i64`,
    `0x${diceArr
      .map(value => value.toString(16).padStart(2, '0'))
      .join('')}:bytes-packed`,
  ],
  [diceArr],
);

// public inputs
// Inputs must have format (0x)[0-f]*:(i64|bytes|bytes-packed) and been separated by spaces (eg: 0x12:i64).
const publicInputs = useMemo(() => [`0x${sum.toString(16)}:i64`], [sum]);

const info = {
  user_address: 'userAddress.toLowerCase()',
  md5: 'DICE_GAME_MD5',
  public_inputs: publicInputs,
  private_inputs: witness,
};
```

- Submit proof

```javascript
const zkc = new ZKCWasmServiceHelper();
// JSON stringify
const messageString = JSON.stringify(info);

// Sign the message
const signature = await provider.sign(messageString);

// Submit task
const res = await zkc.addProvingTask({
  ...info,
  signature,
});
```

> **Note:** Each time you add a task, the program deducts a certain amount of balance from the upload account of the application.

5.  Load `index.jsx` file in `index.html`:

```html
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Hello World - AssemblyScript</title>
    <link
      rel="stylesheet"
      href="https://unpkg.com/bootstrap@5.3.0/dist/css/bootstrap-utilities.min.css"
    />
  </head>

  <body>
    <div id="app"></div>
    <script type="module" src="./index.jsx"></script>
  </body>
</html>
```

## Demo

With the following command, you can compile and preview the project

```shell
pnpm dice-game
# or parcel index.html for compiling individually
```

## More Info

- [Compiling `dice-game.c` into an WebAssembly module][4]
- [Create application][3]

[1]: https://github.com/zkcrossteam/ZKC-SDK
[2]: https://parceljs.org/
[3]: https://dev.zkcross.org/create-app
[4]: ./wasmsrc/c/README.md
