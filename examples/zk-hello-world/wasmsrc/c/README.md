# ZK Hello World!

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

#### [zkWasm-C][2]

First, you need to add the zkWasm-C SDK repository to the project, either directly in the project root folder by cloning it, or you can add the repository as a Git submodule to the project.

If you want to clone the repository, execute the following command:

```shell
git clone https://github.com/zkcrossteam/zkWasm-C.git
```

If you want to add submodules, execute the following command:

```shell
git submodule add git@github.com:zkcrossteam/zkWasm-C.git
```

### Implementation

1.  Create a file called `zk-hello-world.c` :

```c
#include <stdint.h>
#include <zkwasmsdk.h>

__attribute__((visibility("default"))) int checkLucky(int a)
{
  return a % 2;
}

__attribute__((visibility("default"))) int zkmain()
{

  int privateInput = (int)wasm_input(0);

  require(checkLucky(privateInput));

  return 0;
}
```

2.  Create a Makefile

```Makefile
LIBS  = -lkernel32 -luser32 -lgdi32 -lopengl32
SDKDIR = ../../../../../zkWasm-C
CFLAGS = -Wall -I$(SDKDIR)/sdk/c/sdk/include/ -I$(SDKDIR)/sdk/c/hash/include/
# Should be equivalent to your list of C files, if you don't build selectively
CFILES = $(wildcard *.c)
ifeq ($(CLANG),)
CLANG=clang
endif
FLAGS = -flto -O3 -nostdlib -fno-builtin -ffreestanding -mexec-model=reactor --target=wasm32 -Wl,--strip-all -Wl,--initial-memory=131072 -Wl,--max-memory=131072 -Wl,--no-entry -Wl,--allow-undefined -Wl,--export-dynamic

all: zk-hello-world.wasm

sdk.wasm:
    sh $(SDKDIR)/sdk/scripts/build.sh sdk.wasm

zk-hello-world.wasm: $(CFILES) sdk.wasm
    $(CLANG) -o $@ $(CFILES) sdk.wasm $(FLAGS) $(CFLAGS)

clean:
    sh $(SDKDIR)/sdk/scripts/clean.sh
    rm -f *.wasm *.wat
```

3.  Compile `zk-hello-world.c` into a wasm module which will output a `zk-hello-world.wasm` :

```shell
make
```

[1]: https://llvm.org/
[2]: https://github.com/zkcrossteam/zkWasm-C
