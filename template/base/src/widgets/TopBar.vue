<script setup>
import { ref, watch } from 'vue'
import { MySwitch, Slider } from '@/components'
import { useTheme } from '@/hooks'

defineProps({
  title: {
    type: String,
    required: false
  }
})

const { theme, setLightTheme, setDarkTheme } = useTheme()

const isDarkTheme = ref(theme.value === 'dark')
const textScalePercent = ref(0)

watch(isDarkTheme, () => {
  isDarkTheme.value ? setDarkTheme() : setLightTheme()
})
watch(textScalePercent, () => {
  emit('changeSlider', textScalePercent.value)
})

const emit = defineEmits(['changeSlider'])
</script>

<template>
  <div class="top-bar">
    <div class="logo-area">
      <img alt="Vue logo" class="logo" src="@/assets/logo.png" width="125" />
      <span class="title">{{ title }}</span>
    </div>
    <div style="width: 30%">
      <Slider v-model="textScalePercent" button-size="18px" />
    </div>
    <MySwitch v-model="isDarkTheme" size="18px" />
  </div>
</template>

<style scoped>
.top-bar {
  --title-color: var(--my-c-text-light-1);
}

[data-theme='dark'] .top-bar {
  --title-color: var(--my-c-text-dark-1);
  border-bottom: 1px solid var(--my-c-gray-dark-3);
  box-shadow: none;
}
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  padding: 0 20px;
  background: var(--app-background);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.04), 0 1px 4px rgba(0, 0, 0, 0.04);
  z-index: 9999;
}

.logo-area {
  display: flex;
  align-items: center;
}

.logo {
  width: 20px;
}

.title {
  font-size: 12px;
  margin-left: 4px;
  color: var(--title-color);
}
</style>
