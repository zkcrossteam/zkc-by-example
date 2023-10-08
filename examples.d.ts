declare module '*.wasm' {
  const initWasm: (
    importObject: WebAssembly.Imports,
  ) => Promise<WebAssemblyInstantiatedSource>;

  export default initWasm;
}

/** A 32-bit signed integer. */
declare type i32 = number;
