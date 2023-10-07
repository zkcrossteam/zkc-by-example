# Hello World!

## Overview

This is a tutorial for compiling an C file into an WebAssembly module.

## Setup

### Prerequisite

#### [LLVM][1]

```shell
# for Mac
brew install llvm
# for win10
winget install -e --id LLVM.LLVM
```

> Please make sure that the system environment variables have been added successfully

#### [ZKC-SDK][2]

```shell
npm install zkc-sdk
```

### Implementation

1.  Create a file called `hello-world.c` :

```c
__attribute__((visibility("default"))) int add(int a, int b)
{
  return a + b;
}
```

2.  Compile that into a wasm module which will output a `hello-world.wasm` :

```shell
clang --target=wasm32 --no-standard-libraries -Wl,--export-all -Wl,--no-entry -o hello-world.wasm hello-world.c
```

[1]: https://llvm.org/
[2]: https://github.com/zkcrossteam/ZKC-SDK
