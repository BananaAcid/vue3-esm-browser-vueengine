<template>
  <div class="page">
    <h1>Welcome to this Vue3 template</h1>
    <p>This is the main page of this single-page application.</p>
    <p>Click the navigation links above to explore other pages.</p>
    <p>Have a look at the <b>README.md</b></p>
    <br />
    <p>typescript test: {{ word }} and {{ getColor(Color.Red) }}</p>
  </div>
  <VDivider />
  <div class="page">
    <p>
      Alternative versions (based on the readme): &nbsp;&nbsp;
      <VBtn href="/example-minimal">minimal</VBtn>
    </p>
    <p>simpler version here: &nbsp;&nbsp; <VBtn href="/v1">version 1</VBtn></p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const word = ref('Hello!');

enum Color {
  Red,
  Green,
  Blue,
}

function getColor(colNum: Color): string {
  switch (colNum) {
    case Color.Red:
      return 'red';
    case Color.Green:
      return 'green';
    case Color.Blue:
      return 'blue';
  }
}
</script>

<style scoped>
.v-divider {
  margin: 1em 0;
}

.page {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
}
h1 {
  color: #2c3e50;
  margin-bottom: 1rem;
}
p {
  color: #34495e;
  line-height: 1.6;
}
</style>
