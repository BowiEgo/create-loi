<script setup lang="ts">
import { ref } from 'vue'
import HelloWorld from '@/widgets/HelloWorld.vue'
import News from '@/widgets/News.vue'
import Paragraph from '@/widgets/Paragraph.vue'
import { Card, Loading, Skeleton } from '@/components'
import { useFetchHomeData } from './useFetchData'

const loading = ref(true)
const list = ref([])

// 请求数据
useFetchHomeData({ list }, loading)
</script>

<template>
  <div id="home">
    <!-- <HelloWorld msg="Index Page" /> -->

    <Loading :loading="loading">
      <div>
        <Card>
          <Skeleton
            v-for="item in 3"
            :key="item"
            :row="2"
            row-height="13"
            row-gap="12"
            round
            image
          />
        </Card>
        <Card>
          <Skeleton :row="5" row-height="13" row-gap="12" round />
        </Card>
      </div>
    </Loading>

    <Card v-if="!loading">
      <News
        v-for="(item, index) in list"
        :key="index"
        :title="item.TITLE"
        :img="item.IMG"
        :time="item.UPDATETIME"
      />
    </Card>

    <div v-if="!loading">
      <Card>
        <Paragraph />
      </Card>
    </div>

    <Card>
      <Skeleton v-if="loading" :row="8" row-height="13" row-gap="12" round />
    </Card>

    <!-- <TheWelcome /> -->
  </div>
</template>

<style scoped>
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
