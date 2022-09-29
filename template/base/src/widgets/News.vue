<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="news">
    <div class="content">
      <div class="brief">
        <p class="my-multi-ellipsis--l2">
          {{ title }}
        </p>
        <div class="tail">
          <span>{{ time.slice(0, 19) }}</span>
        </div>
      </div>
      <div class="pic">
        <img :src="img" alt="" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.news {
  --news-border-color: #e8e8e8;
  --news-brief-text-color: var(--my-c-text-light-1);
  --news-tail-text-color: #cccccc;
}
html[data-theme='dark'] .news {
  --news-border-color: #464646;
  --news-brief-text-color: var(--my-c-text-dark-2);
  --news-tail-text-color: var(--my-c-text-dark-4);
}

.news {
  border-bottom: 1px solid var(--news-border-color);
  margin-bottom: 10px;
}
.content {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.brief {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 16px;
  color: var(--news-brief-text-color);
  line-height: 23px;
}

.brief p {
  margin: 0;
  margin-top: -2px;
}

.tail {
  margin-top: 12px;
  font-size: 12px;
  color: var(--news-tail-text-color);
  line-height: 12px;
}

.tail span {
  display: inline-block;
  margin-right: 10px;
}

.tail span:empty {
  margin-right: 0;
}

.pic {
  flex: 0 0 100px;
  height: 67px;
  background-color: antiquewhite;
  margin-left: 8px;
  border-radius: var(--my-border-radius-sm);
  overflow: hidden;
}

.pic img {
  width: 100%;
  height: 100%;
}
</style>
