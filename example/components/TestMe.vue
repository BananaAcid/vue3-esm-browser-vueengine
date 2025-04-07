<template>
  <p>
    this is TEST ME <b>{{ str }}</b>
  </p>
</template>

<script setup>
import { ref } from 'vue';

const letters = ['|', '/', '-', '\\', '|', '/', '-', '\\'];
let pos = 0;
let str = ref('');

setInterval(() => {
  str.value = letters[pos];
  pos = ++pos >= letters.length ? 0 : pos;
}, 300);
</script>
