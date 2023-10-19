import {
  withZKCWeb3MetaMaskProvider,
  ZKCWasmService,
  ZKCProveService,
} from 'zkc-sdk';

// Get the URL of the wasm file for initializing the WebAssembly instance.
const zkHelloWorldURL = new URL(
  './wasmsrc/c/zk-hello-world.wasm',
  import.meta.url,
);

// Application image id that has been created and can be used for task proofing
const ZK_HELLO_WORLD_MD5 = '4470FD5212FCDCAA5B50F3DC538FCDAE';

// get DOM Node
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
  const { exports } = await ZKCWasmService.loadWasm(zkHelloWorldURL);

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
    const luckyNumberValue = +luckyNumberNode.textContent || 0;

    if (luckyNumberValue === 0) return alert('Get your lucky number first!');

    // Information to be signed
    const taskInfo = {
      md5: ZK_HELLO_WORLD_MD5,
      public_inputs: [],
      private_inputs: [`0x${luckyNumberValue.toString(16)}:i64`],
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
