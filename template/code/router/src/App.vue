<script setup>
import { ref } from 'vue'
import { useTheme } from '@/hooks'
import { ConfigProvider } from '@/Components'
import TopBar from '@/widgets/TopBar.vue'
import HomeView from './views/HomeView.vue'

const TEXT_SCALE_MAX = 3

const { theme, setLightTheme, setDarkTheme } = useTheme()

const textScale = ref(1)

const updateTextScaleByPct = (percent) => {
  textScale.value = 1 + ((TEXT_SCALE_MAX - 1) / 100) * percent
}
</script>

<template>
  <div id="app">
    <ConfigProvider :theme="theme.value" :text-scale="textScale">
      <div>
        <TopBar title="Loi Application" @changeSlider="updateTextScaleByPct" />
        <nav>
          <router-link to="/">Home</router-link>
          <router-link to="/about">About</router-link>
        </nav>
        <HomeView />
      </div>
    </ConfigProvider>
  </div>
</template>

<style scoped>
#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 15vw 1rem 2rem;

  font-weight: normal;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
</style>
