import { ref, onMounted, onUnmounted } from 'vue'

function useRectMutationObserver(container) {
  const DOMRect = ref(null)
  const observer = ref(null)

  // observe DOM mutation
  const initMutationObserver = dom => {
    const MutationObserver = window.MutationObserver
    observer.value = new MutationObserver(() => {
      DOMRect.value = dom.getBoundingClientRect()
    })
    observer.value.observe(dom, {
      childList: true, // 子节点的变动（新增、删除或者更改）
      attributes: true, // 属性的变动
      characterData: true, // 节点内容或节点文本的变动
      subtree: true, // 是否将观察器应用于该节点的所有后代节点
      attributeFilter: ['class', 'style'], // 观察特定属性
      attributeOldValue: true, // 观察 attributes 变动时，是否需要记录变动前的属性值
      characterDataOldValue: true, // 观察 characterData 变动，是否需要记录变动前的值
    })
  }

  onMounted(() => {
    container.value && initMutationObserver(container.value)
  })

  onUnmounted(() => {
    observer.value && observer.value.disconnect()
  })

  return {
    DOMRect,
  }
}

export default useRectMutationObserver
