import EmptyImage from '@/assets/images/no-info.svg'
import Empty from '../Empty'

const RenderEmpty = ({ props }) => {
  const renderHtml = (componentName) => {
    switch (componentName) {
      case 'card':
        return <Empty text="暂无相关信息" image={EmptyImage} />
      default:
        return <Empty style={{ paddingTop: '30px' }} text="暂无相关信息" />
    }
  }
  return renderHtml(props.componentName)
}

function renderEmpty(componentName) {
  return <RenderEmpty componentName={componentName} />
}

export default renderEmpty
