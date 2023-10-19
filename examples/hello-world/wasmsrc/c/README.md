# Hello World!

## Overview

This is a tutorial for compiling a C file into a WebAssembly module.

## Setup

### Prerequisite

#### [LLVM][1]

```shell
# for Mac
brew install llvm
# for Win 7/8/10
choco install llvm -y
# for Win 10/11
winget install -e --id LLVM.LLVM
```

> Please make sure that the system environment variables have been added successfully

### Implementation

1.  Create a file called `hello-world.c` :

```c
__attribute__((visibility("default"))) int add(int a, int b)
{
  return a + b;
}
```

2.  Compile `hello-world.c` into a wasm module which will output a `hello-world.wasm` :

```shell
clang --target=wasm32 --no-standard-libraries -Wl,--export-all -Wl,--no-entry -o hello-world.wasm hello-world.c
```

[1]: https://llvm.org/
