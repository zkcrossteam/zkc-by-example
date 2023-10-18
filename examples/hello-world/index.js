import { ZKCWasmService } from 'zkc-sdk';

// Get the URL of the wasm file for initializing the WebAssembly instance.
const helloWorldURL = new URL('./wasmsrc/c/hello-world.wasm', import.meta.url);

const runWasmAdd = async () => {
  // load wasm module instance
  const { exports } = await ZKCWasmService.loadWasm(helloWorldURL);

  // Call the Add function export from wasm, save the result
  const addResult = exports.add(26, 26);

  // Set the result onto the body
  document.body.textContent = `Hello World! addResult: ${addResult}`;
};

runWasmAdd();
