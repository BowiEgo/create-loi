import { ref, watch } from 'vue'
import { useRectMutationObserver } from '@/hooks'
import { createNamespace } from '@/utils/create'

const [name] = createNamespace('rect', true)

export default {
  name,
  props: { name: String },
  emits: ['on-mutate'],
  setup(props, { emit, slots, expose }) {
    const { name } = props
    const container = ref(null)
    const { DOMRect } = useRectMutationObserver(container)

    watch(DOMRect, () => {
      emit('on-mutate', { name: name, DOMRect: DOMRect.value })
    })

    const getEl = () => {
      return container.value
    }
    expose({ getEl })

    return () => {
      return <div ref={container}>{{ ...slots }}</div>
    }
  }
}
