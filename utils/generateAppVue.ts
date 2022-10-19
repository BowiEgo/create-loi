export default function generateAppVue({ needsRouter }) {
  let appVue = `<script setup>
import { ref } from 'vue'
import { useTheme } from '@/hooks'
import { ConfigProvider } from '@/Components'
import TopBar from '@/widgets/TopBar.vue'
${needsRouter ? '' : `import HomeView from './views/HomeView.vue'\n`}
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
        <TopBar title="Loi Application" @changeSlider="updateTextScaleByPct" />${
          needsRouter
            ? `
        <nav>
          <router-link to="/">Home</router-link>
          <router-link to="/about">About</router-link>
        </nav>
        <router-view></router-view>`
            : `
        <HomeView />`
        }
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
${
  needsRouter
    ? `\nnav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin: 0.1rem 0 0.6rem 0;
}

nav a.router-link-exact-active {
  color: var(--my-c-blue);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
  color: var(--color-text);
  font-weight: 700;
}

nav a:first-of-type {
  border: 0;
}`
    : ''
}
</style>
`

  return appVue
}
