export default function generateEntry({ needsPinia, needsRouter }) {
  let entry = `import Vue from 'vue'
${needsPinia ? `import { createPinia, PiniaVuePlugin } from 'pinia'\n` : ''}
import App from './App.vue'
${needsRouter ? `import router from './router'\n` : ''}
import '@/assets/main.css'
${needsPinia ? `\nVue.use(PiniaVuePlugin)\n` : ''}
new Vue({
  ${needsRouter ? `router,\n\t` : ''}${
    needsPinia ? `pinia: createPinia(),\n\t` : ''
  }render: (h) => h(App)
}).$mount('#app')
`

  return entry
}
