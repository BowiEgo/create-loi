import { createNamespace } from '@/utils/create'
import { addUnit, getSizeStyle } from '@/utils/format'
import Loading from '../Loading'
import './index.css'

const [name, bem] = createNamespace('skeleton', true)
const DEFAULT_ROW_WIDTH = '100%'
const DEFAULT_LAST_ROW_WIDTH = '60%'
const DEFAULT_ROW_HEIGHT = '100%'
const DEFAULT_IMAGE_WIDTH = '50%'
const DEFAULT_IMAGE_HEIGHT = '70px'

export default {
  name,
  props: {
    title: Boolean,
    round: Boolean,
    avatar: Boolean,
    image: Boolean,
    loading: { type: Boolean, default: true },
    animate: { type: Boolean, default: true },
    avatarSize: [Number, String],
    imageWidth: {
      type: [Number, String],
      default: DEFAULT_IMAGE_WIDTH
    },
    imageHeight: {
      type: [Number, String],
      default: DEFAULT_IMAGE_HEIGHT
    },
    titleWidth: [Number, String],
    titleHeight: [Number, String],
    titleMargin: [Number, String],
    row: {
      type: [Number, String],
      default: 0
    },
    avatarShape: {
      type: String, // as PropType<'square' | 'round'>
      default: 'round'
    },
    rowWidth: {
      type: [Number, String, Array],
      default: DEFAULT_ROW_WIDTH
    },
    rowHeight: {
      type: [Number, String, Array],
      default: DEFAULT_ROW_HEIGHT
    },
    rowGap: {
      type: [Number, String],
      default: 8
    }
  },
  setup(props) {
    const {
      avatar,
      avatarSize,
      avatarShape,
      image,
      imageWidth,
      imageHeight,
      title,
      titleWidth,
      titleHeight,
      titleMargin,
      rowWidth,
      rowHeight,
      row,
      rowGap,
      animate,
      round
    } = props

    const renderAvatar = () => {
      if (avatar) {
        return <div class={bem('avatar', avatarShape)} style={getSizeStyle(avatarSize)} />
      }
    }

    const renderImage = () => {
      if (image) {
        return (
          <div
            class={bem('image')}
            style={{
              width: addUnit(imageWidth),
              height: addUnit(imageHeight)
            }}
          />
        )
      }
    }

    const renderTitle = () => {
      if (title) {
        return (
          <h3
            class={bem('title')}
            style={{
              width: addUnit(titleWidth),
              height: addUnit(titleHeight),
              marginBottom: addUnit(titleMargin)
            }}
          />
        )
      }
    }

    const getRowWidth = (index) => {
      if (rowWidth === DEFAULT_ROW_WIDTH && index === +row - 1) {
        return DEFAULT_LAST_ROW_WIDTH
      }
      if (Array.isArray(rowWidth)) {
        return rowWidth[index]
      }
      return rowWidth
    }

    const getRowHeight = (index) => {
      if (Array.isArray(rowHeight)) {
        return rowHeight[index]
      }

      return rowHeight
    }

    const renderRows = () =>
      Array(row)
        .fill('')
        .map((_, i) => (
          <div
            class={bem('row')}
            style={{ width: addUnit(getRowWidth(i)), height: addUnit(getRowHeight(i)) }}
          />
        ))

    const cssVar = {
      '--skeleton-row-margin-top': addUnit(rowGap)
    }

    return () => {
      return (
        <Loading loading={props.loading}>
          <div class={bem({ animate: animate, round: round })} style={cssVar}>
            {renderAvatar()}
            <div class={bem('content')}>
              {renderTitle()}
              {renderRows()}
            </div>
            {renderImage()}
          </div>
        </Loading>
      )
    }
  }
}
