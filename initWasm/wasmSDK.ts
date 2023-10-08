const { Memory, Table } = WebAssembly;

export type InitWasm = (
  importObject: WebAssembly.Imports,
) => Promise<WebAssembly.WebAssemblyInstantiatedSource>;

export const DEFAULT_OPTIONS: WebAssembly.Imports = {
  global: {},
  env: {
    memory: new Memory({ initial: 10, maximum: 100 }),
    table: new Table({ initial: 0, element: 'anyfunc' }),
    abort: () => {
      console.error('abort in wasm!');
      throw new Error('Unsupported wasm api: abort');
    },
  },
};

export class WasmSDK<T> {
  constructor(
    public exports: T,
    public options = DEFAULT_OPTIONS,
  ) {}

  static async connect<T>(
    wasmFileOrInitWasm: URL | InitWasm,
    options = DEFAULT_OPTIONS,
  ) {
    const { instance } =
      wasmFileOrInitWasm instanceof URL
        ? await WebAssembly.instantiateStreaming(
            fetch(wasmFileOrInitWasm),
            options,
          )
        : await wasmFileOrInitWasm(options);

    return new WasmSDK<T>(instance.exports as T, options);
  }
}
