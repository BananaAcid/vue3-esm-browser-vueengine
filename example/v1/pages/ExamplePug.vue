<template lang="pug">
div.page
  h1 Pug Example Page
  p This page is rendered using Pug!
	p It uses LessCSS for styling.
</template>

<style scoped lang="less">
.page {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 5px;

  @col: blue;

  h1 {
    color: #333;
  }

  p {
    color: @col;
  }
}
</style>
