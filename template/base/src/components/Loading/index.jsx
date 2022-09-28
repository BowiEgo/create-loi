import { createNamespace } from '@/utils/create'

const [name] = createNamespace('loading', true)

export default {
  name,
  props: {
    loading: {
      type: Boolean,
      default: true
    }
  },
  setup(props, { slots }) {
    return () => {
      if (props.loading) {
        return slots.default?.()
      }
    }
  }
}
