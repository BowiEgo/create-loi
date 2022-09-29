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
