import Card from './Card'
import ConfigProvider from './ConfigProvider'
import Empty from './Empty'
import Loading from './Loading'
import Skeleton from './Skeleton'

const components = [Card, ConfigProvider, Empty, Loading, Skeleton]

function install(app) {
  components.forEach((component) => {
    app.component(component.name, component)
  })
}

export { install, Card, ConfigProvider, Empty, Loading, Skeleton }

export default {
  install
}
