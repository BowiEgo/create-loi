<script setup>
import { computed } from 'vue'
import { useTextScale } from '@/hooks'

// textScale
const { fontSizeBase, em } = useTextScale(14)
const cssVar = computed(() => {
  return {
    fontSize: fontSizeBase.value
  }
})
</script>

<template>
  <div class="paragraph" :style="cssVar">
    <p>
      <span
        >Lorem ipsum dolor sit amet consectetur, adipisicing elit. Excepturi voluptate id, rerum
        quasi nam nisi obcaecati saepe facilis maxime inventore unde sit, aperiam pariatur eum
        tenetur odit atque, aliquid rem.</span
      >
    </p>
  </div>
</template>

<style scoped></style>
