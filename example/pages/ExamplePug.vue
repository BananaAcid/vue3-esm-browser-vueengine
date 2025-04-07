<template lang="pug">
div.page
  h1 Pug Example Page
  p This page is rendered using Pug!
  p It uses LessCSS for styling.
</template>

<style scoped lang="less">
.page {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;

  @col: blue;

  h1 {
    color: #2c3e50;
    margin-bottom: 1rem;
  }

  p {
    color: @col;
    line-height: 1.6;
  }
}
</style>
