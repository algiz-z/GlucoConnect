<template>
  <div class="post-item">
    <h3>{{ post.title }}</h3>
    <p>{{ post.content }}</p>
    <small>投稿タイプ: {{ post.type }}</small>
  </div>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.post-item {
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>