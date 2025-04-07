<template>
  <NavigationComponent />

  <main>
    <RouterView v-slot="{ Component }">
      <transition name="fade">
        <component :key="$route.path" :is="Component" />
      </transition>
    </RouterView>
  </main>
</template>

<script setup>
import NavigationComponent from '/components/Navigation.vue';
</script>

<style scoped>
main {
  position: relative;
}

.fade-enter-active {
  animation: fade 0.25s;
  position: relative;
  z-index: 1;
}

.fade-leave-active {
  animation: fade 0.25s reverse;
  position: absolute;
  left: 0;
  right: 0;
}

@keyframes fade {
  from {
    opacity: 0%;
  }

  to {
    opacity: 100%;
  }
}
</style>
