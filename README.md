# ZKC-by-example

> ZKC-by-example contains some examples showing how to create a ZKCross wasm application and deploy the proof to the chain with [ZKC-SDK][1].

## Example list

1.  hello world Getting started with wasm, we will compile Typescript/C/Rust to WebAssembly and initialize it with the ZKC sdk, and then we are able to call the method exported from WebAssembly to get a lucky number.
2.  ZK hello world zkWASM-C basics, in this example, we will add zkWasm-C as a submodule, compile and call the methods in zkWasm-C, finally, we will prove our inputs and deploy the proof onto the chain with ZKC SDK
3.  dice game For an advanced challenge, we will create a complete ZKCross web application which includes compiling and running the wasm file, creating and deploying the wasm application, and finally submitting proof and deploy it onto the chain.

## Technology Stack

- Front end
  - Language: [TypeScript v5][2]
  - Component engine: [React v18][3]
  - CSS utility class: [Bootstrap v5][4]
  - Package management tool: [pnpm][5]
  - CI / CD: [GitHub Actions][6] + [Vercel][7]
- WASM
  - Language: [C][8]
  - Compilation tool: [Clang][9]

## How To Run This Repository

```shell
git clone https://github.com/zkcrossteam/ZKC-by-example.git
```

## How to compile

### Frontend

If you want to launch and preview any of example, you can execute the following command

> [Node.js][10] and [pnpm][11] is required.

```shell
pnpm i

# For hello world example
pnpm hello-world
# For zk hello world example
pnpm zk-hello-world
# For dice game example
pnpm dice-game
```

### WASM

#### zkWasm-C

First, you need to add the C SDK repository to the project, either directly in the project root folder by cloning it, or you can add the SDK repository as a Git submodule to the project.

If you want to clone the repository, execute the following command:

```shell
git clone git@github.com:zkcrossteam/zkWasm-C.git
```

If you want to add submodules, execute the following command:

```shell
git submodule add git@github.com:zkcrossteam/zkWasm-C.git
```

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
