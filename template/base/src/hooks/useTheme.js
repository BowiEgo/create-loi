import { shallowRef } from 'vue'

const theme = shallowRef({})

export function useTheme() {
  const localTheme = localStorage.getItem('theme')
  theme.value = localTheme ? localTheme : 'light'
  document.documentElement.setAttribute('data-theme', theme.value)

  const setLightTheme = () => {
    document.documentElement.setAttribute('data-theme', 'light')
    theme.value = 'light'
    localStorage.setItem('theme', 'light')
  }

  const setDarkTheme = () => {
    document.documentElement.setAttribute('data-theme', 'dark')
    theme.value = 'dark'
    localStorage.setItem('theme', 'dark')
  }

  return {
    theme,
    setLightTheme,
    setDarkTheme
  }
}
