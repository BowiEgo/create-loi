import { createNamespace } from '@/utils/create'
import defaultEmptyImage from '@/assets/images/no-data.svg'
import './index.css'

const [name, bem] = createNamespace('empty', true)

export default {
  name,
  props: {
    image: String,
    text: String
  },
  setup(props) {
    return () => (
      <div class={bem()}>
        <img src={props.image || defaultEmptyImage} alt="" />
        <span>{props.text}</span>
      </div>
    )
  }
}
