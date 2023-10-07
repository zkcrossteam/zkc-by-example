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
