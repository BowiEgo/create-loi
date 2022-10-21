import { computed, watch } from 'vue'
import useConfigInject from './useConfigInject'
import { num_reg } from '../utils/regx'

export function useTextScale(FONT_SIZE_BASE = 12) {
  const fontSizeBase = computed(() => {
    const { textScale } = useConfigInject().configProvider
    return FONT_SIZE_BASE * textScale + 'px'
  })

  function em(size) {
    return size / FONT_SIZE_BASE + 'em'
  }

  return {
    fontSizeBase,
    em
  }
}
