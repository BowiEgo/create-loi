<script setup>
defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="greetings">
    <h1 class="blue">{{ msg }}</h1>
    <h3>
      You’ve successfully created a project with
      <a target="_blank" href="https://vitejs.dev/">Vite</a> +
      <a target="_blank" href="https://v2.vuejs.org/">Vue 2</a>.
    </h3>
  </div>
</template>

<style scoped>
.greetings {
  --h3-text-color: var(--my-c-text-light-1);
  --greetings-hero-name-color: transparent;
  --greetings-hero-name-background: -webkit-linear-gradient(120deg, #41d1ff 30%, #0f0fbc);
}
[data-theme='dark'] .greetings {
  --h3-text-color: var(--my-c-text-dark-1);
}
.greetings {
  margin-bottom: 20px;
}
h1 {
  font-weight: 500;
  font-size: 30px;
  line-height: 38px;
  background: var(--greetings-hero-name-background);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: var(--greetings-hero-name-color);
  /* top: -10px; */
}

h3 {
  font-size: 20px;
  line-height: 28px;
  color: var(--h3-text-color);
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

a,
.blue {
  text-decoration: none;
  color: #007acc;
}
</style>
