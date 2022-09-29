import { ref } from 'vue'
import { inBrowser } from '../utils'

let width
let height

export function useWindowSize() {
  let width
  let height

  if (!width) {
    width = ref(0)
    height = ref(0)

    if (inBrowser) {
      const update = () => {
        width.value = window.innerWidth
        height.value = window.innerHeight
      }

      update()
      window.addEventListener('resize', update, { passive: true })
      window.addEventListener('orientationchange', update, { passive: true })
    }
  }

  return { width, height }
}
