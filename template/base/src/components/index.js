import Card from './Card'
import ConfigProvider from './ConfigProvider'
import Empty from './Empty'
import Loading from './Loading'
import Skeleton from './Skeleton'
import Slider from './Slider'
import MySwitch from './Switch'

const components = [Card, ConfigProvider, Empty, Loading, Skeleton, Slider, MySwitch]

function install(app) {
  components.forEach((component) => {
    app.component(component.name, component)
  })
}

export { install, Card, ConfigProvider, Empty, Loading, Skeleton, Slider, MySwitch }

export default {
  install
}
