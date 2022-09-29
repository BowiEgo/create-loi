<script setup>
import TopBar from '@/widgets/TopBar.vue'
import Home from './views/Home.vue'
import { useTheme } from '@/hooks'

useTheme()
</script>

<template>
  <div id="app">
    <TopBar title="Loi Application" />
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
    </nav>
    <Home />
  </div>
</template>

<style scoped>
#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 15vw 1rem 2rem;

  font-weight: normal;
}

button {
  width: 120px;
  height: 30px;
  background: transparent;
  color: var(--app-background);
  border-radius: var(--my-border-radius-max);
  border: none;
}

button.light {
  background: var(--my-c-white-soft);
}

button.dark {
  background: var(--my-c-black);
}
</style>
