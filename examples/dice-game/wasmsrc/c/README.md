# Hello World!

## Overview

This is a tutorial for compiling a C file into a WebAssembly module.

## Setup

### Prerequisite

#### WASM

If you want to compile WASM, please install [Clang][1] and related software.

Because this repository's SDK uses Git submodules, cloning the SDK code is required. If you did not use `--recurse-submodules` during cloning this repository, use the following command to clone the submodule:

```shell
git submodule update --init
```

Make sure that the clang commands in all makefiles are the same as those used to execute clang locally.

> **Tips:** You can search for `CLANG` to check the settings of the clang command in the Makefile.

```shell
cd examples/dice-game/wasmsrc/c

make
```

## From Zero to Hero

In this section, we will provide a brief description of how to build this project. It is assumed that the reader is familiar with the C programming language and the front-end development environment. Basic concepts will not be covered in detail. For additional information about setting up the project's development environment, please refer to the document "[How to run this repository][2]".

### Project Design

This project will implement a dice game, in which the sum of the dice will be used as public input, and some values will be passed as witness (private inputs).

### WASM

#### Add zkWasm-C

First, you need to add the C SDK repository to the project, either directly in the project root folder by cloning it, or you can add the SDK repository as a Git submodule to the project.

If you want to clone the repository, execute the following command:

```shell
git clone git@github.com:zkcrossteam/zkWasm-C.git
```

If you want to add submodules, execute the following command:

```shell
git submodule add git@github.com:zkcrossteam/zkWasm-C.git
```

#### Writing C Language Files and Makefile

Create a WASM folder and create C language files (such as `example.c`) and a Makefile in the folder.

In a C file, You need to include `<zkwasmsdk.h>` header file:

```c
#include <zkwasmsdk.h>
```

You can create functions that can be called by external JavaScript by decorating `__attribute__((visibility("default")))` before the function definition. Here is an example:

```c
__attribute__((visibility("default")))
void setBoard(int input) {
  if(times > 3) return;

  board[times] = input;
  times++;
  result += input;
}
```

`zkmain` is a required function that will be called for data validation each time zk proof is submitted. This function needs to be modified by `__attribute__((visibility("default")))`. Here is the `zkmain` funtion in this project:

```c
__attribute__((visibility("default")))
int zkmain() {
  // read the first public input, like 0x[0-f]*:i64
  // e.g. 0x12:i64
  int pubInput = (int)wasm_input(1);

  // read the first private input, like 0x[0-f]*:i64
  // e.g. 0x3:i64
  int len = (int)wasm_input(0);
  // read the second private input, like 0x[0-f]*:bytes-packed
  // e.g. 0x060606:bytes-packed
  read_bytes_from_u64(dices, len, 0);

  init();
  for(int i = 0; i < 3; i++){
    setBoard(dices[i]);
  }

  // Validate input
  require(pubInput == result);

  return 0;
}
```

You'll notice that `wasm_input`, `read_bytes_from_u64`, and `require` are called in `zkmain`.

`wasm_input` is a function used to get public input and witness, one value at one time. Public input can be read when its argument is `1`, and witness can be read when its argument is `0`.

The `read_bytes_from_u64` function, which takes three arguments, can read public input and witness of type `bytes-packed`. The first argument is a pointer to an array to record the read data, the second argument is the length of the read, and the third argument is `1` to read the public input and `0` to read witness. Each element in the array can store only one two-bytes data.

For example, public input(witness) is `0x01020304:bytes-packed` and the array is `{0x01, 0x02, 0x03, 0x04}`. If the length of the array is longer than the data to be read, the remaining elements are filled with `0`; otherwise, there is no read overflow.

The `require` function can take in a logical operation statement, which can only pass the verification if the logical operation statement is `true`, otherwise the verification will fail.

The Makefile file can be populated with the following:

```makefile
LIBS  = -lkernel32 -luser32 -lgdi32 -lopengl32
SDKDIR = ../../zkWasm-C
CFLAGS = -Wall -I$(SDKDIR)/sdk/c/sdk/include/ -I$(SDKDIR)/sdk/c/hash/include/

# Should be equivalent to your list of C files, if you don't build selectively
CFILES = $(wildcard *.c)
ifeq ($(CLANG),)
CLANG=clang
endif
FLAGS = -flto -O3 -nostdlib -fno-builtin -ffreestanding -mexec-model=reactor --target=wasm32 -Wl,--strip-all -Wl,--initial-memory=131072 -Wl,--max-memory=131072 -Wl,--no-entry -Wl,--allow-undefined -Wl,--export-dynamic

all: example.wasm

sdk.wasm:
    sh $(SDKDIR)/sdk/scripts/build.sh sdk.wasm

example.wasm: $(CFILES) sdk.wasm
    $(CLANG) -o $@ $(CFILES) sdk.wasm $(FLAGS) $(CFLAGS)


clean:
    sh $(SDKDIR)/sdk/scripts/clean.sh
    rm -f *.wasm *.wat
```

You also need to make the following changes to the above:

1.  `SDKDIR` should point to the SDK directory that you downloaded earlier.
2.  `CLANG` should be consistent with local Clang command.

    > The `CLANG` specified in all Makefile files in the SDK should be consistent with the local Clang command. You can check this by searching for `CLANG`.

3.  You can replace `dice-game.wasm` with the name of the file you want to generate.

#### Make

Open the directory where the command line tool created the makefile file in the previous step, and execute the following command:

```shell
make
```

## More information

- [ZKCross Document][3] _(Website)_
- [Delphinus Tutorial 1: Create your first zkWasm application][4] _(Article)_
- [ZK9: Web3 game development utilizing zkWASM virtual machine – Sinka Gao (Delphinus Lab)][5] _(Video)_ [PPT][6] _(PPT)_

[1]: https://www.gnu.org/software/gnu-c-manual/gnu-c-manual.html
[2]: https://git-pager.avosapps.us/#how-to-run-this-repository
[3]: http://docs.zkcross.org/
[4]: https://delphinuslab.com/2023/01/29/delphinus-tutorial-1-create-your-first-zkwasm-application/
[5]: https://www.youtube.com/watch?v=dLZbfTWLGNI
[6]: https://delphinuslab.com/2023/04/09/talk-was-given-in-zk-summit-9th-in-breakout-session/
