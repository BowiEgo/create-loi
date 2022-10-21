// Utils
import { createNamespace } from '@/utils/create'
import { addUnit } from '@/utils/format'
import Loading from '../Loading'
import './index.css'

const [name, bem] = createNamespace('switch', true)

export default {
  name,

  props: {
    size: [Number, String],
    value: null,
    loading: Boolean,
    disabled: Boolean,
    activeColor: String,
    inactiveColor: String,
    activeValue: {
      type: null,
      default: true
    },
    inactiveValue: {
      type: null,
      default: false
    }
  },

  setup(props, { emit, slots }) {
    const isChecked = () => props.value === props.activeValue

    const onClick = (event) => {
      emit('click', event)

      if (!props.disabled && !props.loading) {
        const newValue = isChecked() ? props.inactiveValue : props.activeValue
        emit('input', newValue)
        emit('change', newValue)
      }
    }

    const genLoading = () => {
      if (props.loading) {
        const color = isChecked() ? props.activeColor : props.inactiveColor
        return <Loading class={bem('loading')} color={color} />
      }
    }

    return () => {
      const { loading, disabled } = props
      const checked = isChecked()

      const style = {
        fontSize: addUnit(props.size),
        backgroundColor: checked ? props.activeColor : props.inactiveColor
      }

      return (
        <div
          class={bem({
            on: checked,
            loading,
            disabled
          })}
          role="switch"
          style={style}
          aria-checked={String(checked)}
          onClick={onClick}
        >
          <div class={bem('node')}>{genLoading()}</div>
          {slots.background?.()}
        </div>
      )
    }
  },

  render() {
    const { checked, loading, disabled } = this

    return (
      <div
        class={bem({
          on: checked,
          loading,
          disabled
        })}
        role="switch"
        style={this.style}
        aria-checked={String(checked)}
        onClick={this.onClick}
      >
        <div class={bem('node')}>{this.genLoading()}</div>
      </div>
    )
  }
}
