import { computed, inject } from 'vue'
import { defaultConfigProvider } from '@/components/ConfigProvider'

export default () => {
  const configProvider = inject('configProvider', defaultConfigProvider)
  const renderEmpty = computed(() => configProvider.renderEmpty)

  return {
    configProvider,
    renderEmpty,
  }
}
