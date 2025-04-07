<template>
  <div>styled in orange</div>
</template>

<style scoped lang="less">
@import '/styles/test.less'; //--- BREAKS: .localservice@runtime.33edf5bb.js:26 TypeError: Cannot read properties of undefined (reading 'imports')

div {
  color: @orange;
  font-weight: @bold;
  text-decoration: underline;
}
</style>
