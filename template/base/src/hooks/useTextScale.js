import { computed } from 'vue'
import useConfigInject from './useConfigInject'
import { num_reg } from '../utils/regx'

function useTextScale(name, FONT_SIZE_BASE) {
  const { textSizeConfig } = useConfigInject().configProvider

  const textSize = computed(() => {
    let result
    result =
      textSizeConfig && textSizeConfig[name]
        ? textSizeConfig[name]
        : FONT_SIZE_BASE

    if (typeof result === 'string') {
      result = Number(result.match(num_reg))
    }
    return result
  })
  const fontSize = computed(() => textSize.value + 'PX')
  const textScale = computed(() => textSizeConfig[name] / FONT_SIZE_BASE)

  function em(size) {
    return size / FONT_SIZE_BASE + 'em'
  }

  return {
    textSize,
    fontSize,
    textScale,
    em,
  }
}

export default useTextScale
