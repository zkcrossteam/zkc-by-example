export const { Memory, Table } = WebAssembly;

export type InitWasm = (
  importObject: WebAssembly.Imports,
) => Promise<WebAssembly.WebAssemblyInstantiatedSource>;

export const DEFAULT_IMPORT = {
  global: {},
  env: {
    memory: new Memory({ initial: 10, maximum: 100 }),
    table: new Table({ initial: 0, element: 'anyfunc' }),
    abort: () => {
      console.error('abort in wasm!');
      throw new Error('Unsupported wasm api: abort');
    },
    require: (b: any) => {
      if (!b) {
        console.error('require failed');
        throw new Error('Require failed');
      }
    },
    wasm_input: () => {
      console.error('wasm_input should not been called in non-zkwasm mode');
      throw new Error('Unsupported wasm api: wasm_input');
    },
    checkLucky: a => {
      console.error('check lucky funtion error');
      throw new Error('check lucky function required');
    },
  },
};

export class WasmSDK<T> {
  constructor(
    public exports: T,
    public importObject = DEFAULT_IMPORT,
  ) {}

  static async connect<T>(
    wasmFileOrInitWasm: URL | InitWasm,
    importObject = DEFAULT_IMPORT,
  ) {
    const { instance } =
      wasmFileOrInitWasm instanceof URL ||
      typeof wasmFileOrInitWasm === 'string'
        ? await WebAssembly.instantiateStreaming(
            fetch(wasmFileOrInitWasm),
            importObject,
          )
        : await wasmFileOrInitWasm(importObject);

    return new WasmSDK<T>(instance.exports as T, importObject);
  }
}
