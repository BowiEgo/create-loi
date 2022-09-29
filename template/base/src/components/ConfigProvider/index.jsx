import { provide, reactive, watch } from 'vue'
import { createNamespace } from '../../utils/create'
import defaultRenderEmpty from './renderEmpty'

const [name] = createNamespace('config-provider', true)

export const defaultConfigProvider = reactive({
  renderEmpty: defaultRenderEmpty
})

export default {
  name,
  inheritAttrs: false,
  props: {
    theme: {
      type: String,
      default: 'default'
    },
    textScale: {
      type: Number,
      default: 1
    },
    renderEmpty: {
      type: Function,
      default: defaultRenderEmpty
    }
  },
  setup(props, { slots }) {
    const renderEmptyComponent = (name) => {
      const renderEmpty = props.renderEmpty || slots.renderEmpty
      return renderEmpty(name)
    }

    const configProvider = reactive({
      ...props,
      renderEmpty: renderEmptyComponent
    })

    Object.keys(props).forEach((key) => {
      watch(
        () => props[key],
        () => {
          configProvider[key] = props[key]
        }
      )
    })

    provide('configProvider', configProvider)

    return () => slots.default?.()
  }
}
