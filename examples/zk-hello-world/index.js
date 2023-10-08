import {
  withZKCWeb3MetaMaskProvider,
  ZKCWasmServiceHelper,
  ZKCWasmServiceUtil,
} from 'zkc-sdk';

import { WasmSDK } from '../../initWasm/wasmSDK';

// import ZKHelloWorldExample from './wasmsrc/c/zk-hello-world.wasm';

const ZKHelloWorldExample = new URL(
  './wasmsrc/c/zk-hello-world.wasm',
  import.meta.url,
);

const TUTORIAL_MD5 = '665272C6FD6E4148784BF1BD2905301F';

const luckyNumberNode = document.querySelector('#lucky-number'),
  proofMessageNode = document.querySelector('#proof-message');

async function getRandomNumber() {
  const randomNumber = Math.ceil(Math.random() * 10);

  luckyNumberNode.textContent = randomNumber;

  // load wasm module instance
  const { exports } = await WasmSDK.connect(ZKHelloWorldExample);

  // Call the checkLucky function export from wasm, save the result
  const isLucky = exports.checkLucky(randomNumber);

  return isLucky
    ? alert('Congratulations! Please submit your proof on-chain!')
    : alert('Not Lucky, pleasy try again');
}

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
