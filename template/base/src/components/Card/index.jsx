import useConfigInject from '@/hooks/useConfigInject'
import { createNamespace } from '@/utils/create'
import './index.css'

const [name, bem, rawName] = createNamespace('card', true)

export default {
  name,
  props: {
    isEmpty: false
  },
  setup(props, { slots }) {
    const { renderEmpty } = useConfigInject()

    return () => {
      const content = slots.content?.()
      const children = slots.default?.()

      let childrenContent = []
      if (children && children.length > 0) {
        childrenContent.push(slots.default?.())
      }
      if (content && content.length > 0) {
        childrenContent.push(slots.content?.())
      }

      return (
        <div class={bem()}>
          {childrenContent.length > 0 && !props.isEmpty
            ? childrenContent
            : renderEmpty.value(rawName)}
        </div>
      )
    }
  }
}
