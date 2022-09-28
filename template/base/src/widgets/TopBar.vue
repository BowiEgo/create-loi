<script setup>
defineProps({
  title: {
    type: String,
    required: false
  }
})
</script>

<template>
  <div class="top-bar">
    <img alt="Vue logo" class="logo" src="@/assets/logo.png" width="125" />
    <span class="title">{{ title }}</span>
  </div>
</template>

<style scoped>
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  padding: 0 20px;
  background: var(--app-background);
  display: flex;
  align-items: center;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.04), 0 1px 4px rgba(0, 0, 0, 0.04);
  z-index: 9999;
}

.logo {
  width: 20px;
  height: 20px;
}

.title {
  font-size: 12px;
  margin-left: 10px;
}
</style>
