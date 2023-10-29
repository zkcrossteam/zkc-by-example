# zkc-by-example

This repo contains examples demonstrating how to create wasm applications using [zkc-sdk][1].

## Example list

1.  **Hello World**

    This example demonstrates how to compile code written in TypeScript/C/Rust into WebAssembly, and then how to load the Wasm image and call exported functions in a Web Application by utilizing [zkc-sdk][1].
    
    Check the [hello-world.md][17] for more details.

3.  **ZK Hello World**

    This example guides you through initializing an instance of the WebAssembly module, calling its functions, and ensuring the correct execution of the function by generating a zero knowledge proof and verifying the zkProof on-chain using the [zkc-sdk][1].
    
    Check the [zk-hello-world.md][18] for more details.

5.  **Dice Game**

    For a more advanced challenge, we'll create a complete ZKCross web application, which involves compiling and running the wasm file, creating and deploying the wasm application, and submitting the proof for deployment on the chain.
    
    Check the [dice-game.md][19] for more details.

## Technology Stack

- **Front end**

  - Language: [TypeScript v5][2]
  - Component engine: [React v18][3]
  - CSS utility class: [Bootstrap v5][4]
  - Package management tool: [pnpm][5]
  - CI / CD: [GitHub Actions][6] + [Vercel][7]

- **WASM**

  - Language: [C][8] [Rust][16]
  - Compilation tool: [Clang][9]

## More information

- [ZKCross Document][12] _(Website)_
- [Delphinus Tutorial 1: Create your first zkWasm application][13] _(Article)_
- [ZK9: Web3 game development utilizing zkWASM virtual machine – Sinka Gao (Delphinus Lab)][14] _(Video)_ [PPT][15] _(PPT)_

[1]: https://github.com/zkcrossteam/ZKC-SDK
[2]: https://www.typescriptlang.org/
[3]: https://react.dev/
[4]: https://getbootstrap.com/docs/5.3/utilities/api/
[5]: https://pnpm.io/
[6]: https://docs.github.com/en/actions
[7]: https://vercel.com/home
[8]: https://www.gnu.org/software/gnu-c-manual/gnu-c-manual.html
[9]: https://clang.llvm.org/
[10]: https://nodejs.org/en
[11]: https://pnpm.io/
[12]: http://docs.zkcross.org/
[13]: https://delphinuslab.com/2023/01/29/delphinus-tutorial-1-create-your-first-zkwasm-application/
[14]: https://www.youtube.com/watch?v=dLZbfTWLGNI
[15]: https://delphinuslab.com/2023/04/09/talk-was-given-in-zk-summit-9th-in-breakout-session/
[16]: https://www.rust-lang.org/
[17]: ./examples/hello-world/hello-world.md
[18]: ./examples/zk-hello-world/zk-hello-world.md
[19]: ./examples/dice-game/dice-game.md
