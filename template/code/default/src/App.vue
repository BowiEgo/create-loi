<script setup>
import { ref } from 'vue'
import TopBar from '@/widgets/TopBar.vue'
import HelloWorld from '@/widgets/HelloWorld.vue'
import { Card, Loading, Skeleton } from '@/components'

const loading = ref(true)

const changeThemeToLight = () => {
  document.documentElement.setAttribute('data-theme', 'light')
}
const changeThemeToDark = () => {
  document.documentElement.setAttribute('data-theme', 'dark')
}

setTimeout(() => {
  loading.value = false
}, 1000)
</script>

<template>
  <div id="app">
    <TopBar title="Loi Application" />
    <header>
      <button class="button light" @click="changeThemeToLight">LIGHT</button>
      <button class="button dark" @click="changeThemeToDark">DARK</button>
    </header>

    <Card>
      <HelloWorld msg="Index Page" />
    </Card>

    <Loading :loading="loading">
      <Card>
        <Skeleton :row="9" row-height="15" row-gap="12" round animate />
      </Card>
    </Loading>

    <div v-if="!loading">
      <Card>
        <p>
          <span
            >Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus libero magni rem
            aspernatur provident impedit dicta dolor, excepturi enim quo placeat quibusdam
            repudiandae neque voluptatum possimus quaerat voluptas deserunt? Quis.</span
          >
          <span
            >Sapiente quia perspiciatis, repellat nobis id dolor beatae magnam quod sint atque
            doloribus non, eaque iste voluptate totam quos distinctio explicabo ab voluptates? Sed
            magnam facere aliquam officia. Iusto, harum?</span
          >
        </p>
      </Card>
    </div>

    <Card>
      <Skeleton v-if="loading" :row="7" row-height="15" row-gap="12" round animate />
    </Card>

    <!-- <TheWelcome /> -->
  </div>
</template>

<style scoped>
#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 1rem 2rem;

  font-weight: normal;
}

header {
  line-height: 1.5;
  max-height: 100vh;
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
}

button {
  width: 120px;
  height: 30px;
  background: transparent;
  color: var(--app-background);
  border-radius: var(--my-border-radius-max);
  border: none;
}

button.light {
  background: var(--my-c-white-soft);
}

button.dark {
  background: var(--my-c-black);
}
</style>
