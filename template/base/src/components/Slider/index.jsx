import { ref, computed, defineComponent } from 'vue'

// Utils
import {
  clamp,
  addUnit,
  addNumber,
  numericProp,
  getSizeStyle,
  preventDefault,
  stopPropagation,
  createNamespace,
  makeNumericProp
} from '../../utils'

// Composables
import { useRect, useTouch } from '../../hooks'
// Styles
import './index.css'

const [name, bem] = createNamespace('slider', true)

const sliderProps = {
  min: makeNumericProp(0),
  max: makeNumericProp(100),
  step: makeNumericProp(1),
  range: Boolean,
  reverse: Boolean,
  disabled: Boolean,
  readonly: Boolean,
  vertical: Boolean,
  barHeight: numericProp,
  buttonSize: numericProp,
  activeColor: String,
  inactiveColor: String,
  value: {
    type: [Number, Array],
    default: 0
  }
}

export default {
  name,

  props: sliderProps,

  emits: ['change', 'drag-end', 'drag-start', 'input'],

  setup(props, { emit, slots }) {
    let buttonIndex
    let current
    let startValue

    const root = ref()
    const dragStatus = ref()
    const touch = useTouch()

    const scope = computed(() => Number(props.max) - Number(props.min))

    const wrapperStyle = computed(() => {
      const crossAxis = props.vertical ? 'width' : 'height'
      return {
        background: props.inactiveColor,
        [crossAxis]: addUnit(props.barHeight)
      }
    })

    const isRange = (val) => props.range && Array.isArray(val)

    // 计算选中条的长度百分比
    const calcMainAxis = () => {
      const { value, min } = props
      if (isRange(value)) {
        return `${((value[1] - value[0]) * 100) / scope.value}%`
      }
      return `${((value - Number(min)) * 100) / scope.value}%`
    }

    // 计算选中条的开始位置的偏移量
    const calcOffset = () => {
      const { value, min } = props
      if (isRange(value)) {
        return `${((value[0] - Number(min)) * 100) / scope.value}%`
      }
      return '0%'
    }

    const barStyle = computed(() => {
      const mainAxis = props.vertical ? 'height' : 'width'
      const style = {
        [mainAxis]: calcMainAxis(),
        background: props.activeColor
      }

      if (dragStatus.value) {
        style.transition = 'none'
      }

      const getPositionKey = () => {
        if (props.vertical) {
          return props.reverse ? 'bottom' : 'top'
        }
        return props.reverse ? 'right' : 'left'
      }

      style[getPositionKey()] = calcOffset()

      return style
    })

    const format = (value) => {
      const min = +props.min
      const max = +props.max
      const step = +props.step

      value = clamp(value, min, max)
      const diff = Math.round((value - min) / step) * step
      return addNumber(min, diff)
    }

    const isSameValue = (newValue, oldValue) =>
      JSON.stringify(newValue) === JSON.stringify(oldValue)

    const handleRangeValue = (value) => {
      // 设置默认值
      const left = value[0] ?? Number(props.min)
      const right = value[1] ?? Number(props.max)
      // 处理两个滑块重叠之后的情况
      return left > right ? [right, left] : [left, right]
    }

    const updateValue = (value, end) => {
      if (isRange(value)) {
        value = handleRangeValue(value).map(format)
      } else {
        value = format(value)
      }

      if (!isSameValue(value, props.value)) {
        emit('input', value)
      }

      if (end && !isSameValue(value, startValue)) {
        emit('change', value)
      }
    }

    const onClick = (event) => {
      event.stopPropagation()

      if (props.disabled || props.readonly) {
        return
      }

      const { min, reverse, vertical, value } = props
      const rect = useRect(root)

      const getDelta = () => {
        if (vertical) {
          if (reverse) {
            return rect.bottom - event.clientY
          }
          return event.clientY - rect.top
        }
        if (reverse) {
          return rect.right - event.clientX
        }
        return event.clientX - rect.left
      }

      const total = vertical ? rect.height : rect.width
      const val = Number(min) + (getDelta() / total) * scope.value

      if (isRange(value)) {
        const [left, right] = value
        const middle = (left + right) / 2

        if (val <= middle) {
          updateValue([val, right], true)
        } else {
          updateValue([left, val], true)
        }
      } else {
        updateValue(val, true)
      }
    }

    const onTouchStart = (event) => {
      if (props.disabled || props.readonly) {
        return
      }

      touch.start(event)
      current = props.value

      if (isRange(current)) {
        startValue = current.map(format)
      } else {
        startValue = format(current)
      }

      dragStatus.value = 'start'
    }

    const onTouchMove = (event) => {
      if (props.disabled || props.readonly) {
        return
      }

      if (dragStatus.value === 'start') {
        emit('drag-start', event)
      }

      preventDefault(event, true)
      touch.move(event)
      dragStatus.value = 'dragging'

      const rect = useRect(root)
      const delta = props.vertical ? touch.deltaY.value : touch.deltaX.value
      const total = props.vertical ? rect.height : rect.width

      let diff = (delta / total) * scope.value
      if (props.reverse) {
        diff = -diff
      }

      if (isRange(startValue)) {
        const index = props.reverse ? 1 - buttonIndex : buttonIndex
        current[index] = startValue[index] + diff
      } else {
        current = startValue + diff
      }
      updateValue(current)
    }

    const onTouchEnd = (event) => {
      if (props.disabled || props.readonly) {
        return
      }

      if (dragStatus.value === 'dragging') {
        updateValue(current, true)
        emit('drag-end', event)
      }

      dragStatus.value = ''
    }

    const getButtonClassName = (index) => {
      if (typeof index === 'number') {
        const position = ['left', 'right']
        return bem(`button-wrapper`, position[index])
      }
      return bem('button-wrapper', props.reverse ? 'left' : 'right')
    }

    const renderButtonContent = (value, index) => {
      if (typeof index === 'number') {
        const slot = slots[index === 0 ? 'left-button' : 'right-button']
        if (slot) {
          return slot({ value })
        }
      }

      if (slots.button) {
        return slots.button({ value })
      }

      return <div class={bem('button')} style={getSizeStyle(props.buttonSize)} />
    }

    const renderButton = (index) => {
      const current = typeof index === 'number' ? props.value[index] : props.value

      return (
        <div
          role="slider"
          class={getButtonClassName(index)}
          tabindex={props.disabled ? undefined : 0}
          aria-valuemin={props.min}
          aria-valuenow={current}
          aria-valuemax={props.max}
          aria-disabled={props.disabled || undefined}
          aria-readonly={props.readonly || undefined}
          aria-orientation={props.vertical ? 'vertical' : 'horizontal'}
          onTouchstart={(event) => {
            if (typeof index === 'number') {
              // save index of current button
              buttonIndex = index
            }
            onTouchStart(event)
          }}
          onTouchmove={onTouchMove}
          onTouchend={onTouchEnd}
          onTouchcancel={onTouchEnd}
          onClick={stopPropagation}
        >
          {renderButtonContent(current, index)}
        </div>
      )
    }

    // format initial value
    updateValue(props.value)

    return () => (
      <div
        ref={root}
        style={wrapperStyle.value}
        class={bem({
          vertical: props.vertical,
          disabled: props.disabled
        })}
        onClick={onClick}
      >
        <div class={bem('bar')} style={barStyle.value}>
          {props.range ? [renderButton(0), renderButton(1)] : renderButton()}
        </div>
      </div>
    )
  }
}
