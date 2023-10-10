import {
  withZKCWeb3MetaMaskProvider,
  ZKCWasmServiceHelper,
  ZKCWasmServiceUtil,
} from 'zkc-sdk';

import { WasmSDK } from '../../initWasm/wasmSDK';

// Get the URL of the wasm file for initializing the WebAssembly instance.
const zkHelloWorldURL = new URL(
  './wasmsrc/c/zk-hello-world.wasm',
  import.meta.url,
);

// Application image id that has been created and can be used for task proofing
const ZK_HELLO_WORLD_MD5 = '4470FD5212FCDCAA5B50F3DC538FCDAE';

const luckyNumberNode = document.querySelector('#lucky-number'),
  luckyButtonNode = document.querySelector('#get-lucky'),
  submitProofNode = document.querySelector('#submit-proof'),
  proofMessageNode = document.querySelector('#proof-message');

luckyButtonNode.addEventListener('click', getRandomNumber);
submitProofNode.addEventListener('click', submitProof);

async function getRandomNumber() {
  const randomNumber = Math.ceil(Math.random() * 10);

  luckyNumberNode.textContent = randomNumber;

  // load wasm module instance
  const { exports } = await WasmSDK.connect(zkHelloWorldURL);

  // Call the checkLucky function export from zk-hello-world.wasm
  const isLucky = exports.checkLucky(randomNumber);

  return alert(
    isLucky
      ? 'Congratulations! Please submit your proof on-chain!'
      : 'Not Lucky, pleasy try again',
  );
}

async function submitProof() {
  withZKCWeb3MetaMaskProvider(async provider => {
    const userAddress = await provider.connect();
    // Whether the wallet has been connected
    if (!userAddress) return alert('Please connect your wallet.');

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
    const msgHexString = ZKCWasmServiceUtil.createProvingSignMessage(info);

    // Sign the message
    let signature;
    try {
      signature = await provider.sign(msgHexString);
    } catch (error) {
      console.error('Signing error:', error, 'Signing message', msgHexString);
      return alert('Unsigned Transaction');
    }

    // After the sdk modification is complete, remove the following code
    const zkcWasmServiceHelperBaseURI =
      'https://zkwasm-explorer.delphinuslab.com:8090';

    const endpoint = new ZKCWasmServiceHelper(zkcWasmServiceHelperBaseURI);

    // Submit proof
    const response = await endpoint.addProvingTask({
      ...info,
      signature,
    });

    if (!response?.id)
      return alert(
        'Add proving task failed, Please check your lucky number and try again!',
      );

    console.log('addProvingTask response:', response);
    alert('Add proving task success!');

    // Set the result onto the body
    proofMessageNode.textContent = `Hello World! ZK Proof: https://zkwasm-explorer.delphinuslab.com/task/${response.id}`;
  });
}
