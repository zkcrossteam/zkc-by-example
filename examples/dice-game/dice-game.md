# Hello World!

## Overview

This is a tutorial for initializing an instance of the WebAssembly module and calling the functions within it.

### Implementation

You need to make the following changes to the above file:

1.  Confirm whether the import source file of `makeWasm` points to the previously created WASM;

#### Call Function in WASM at The Front End

Here is an example of calling `initWasm` on the front-end page:

```typescript
import wasmExample from '../examples/dice-game/demo/c/dice-game.wasm';
import { WasmSDK } from '../initWasm/wasmSDK';

WasmSDK.connect<ZKWasmExample>(wasmExample).then(
  ({ exports: { init, setBoard, getResult } }) => {
    init();
    diceArr.forEach(setBoard);
    setSum(getResult);
  },
);
```

#### Build Public Inputs And Witness

Public inputs and witness allow three data types: `i64`, `bytes`, and `bytes-packed`. Each data needs to end with a `:` and type.

The data of `i64` is read at one time through `wasm_input` in `zkmain`.

#### Add task Through `zkc-sdk`

First, you need to install `zkc-sdk`:

```shell
npm i zkc-sdk

# or
yarn add zkc-sdk

# or
pnpm add zkc-sdk
```

Then, create a task object:

```ts
const info = {
  user_address: userAddress.toLowerCase(),
  md5,
  public_inputs: publicInputs,
  private_inputs: witness,
};
```

`user_address` is the wallet address of the signed user, which needs to be in full **lowercase**; `md5` is the ID of the application, which requires all **uppercase**; `public_inputs` and `private_inputs` are arrays.

Call the static method of SDK to convert the task to a string:

```ts
const msgHexString = ZKCWasmServiceUtil.createProvingSignMessage(info);
```

Create a digital signature:

```ts
const signature = await withZKCWeb3MetaMaskProvider(
  provider =>
    (provider as ZKCWeb3MetaMaskProvider).sign(msgHexString) as string,
);
```

Submit task to zk proof through SDK:

```ts
const endpoint = new ZKCWasmServiceHelper(zkcWasmServiceHelperBaseURI);

const res = await endpoint.addProvingTask({ ...info, signature });
```

> **Note:** Each time you add a task, the program deducts a certain amount of balance from the upload account of the application.
