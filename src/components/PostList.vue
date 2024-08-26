<template>
  <div>
    <div v-for="post in posts" :key="post.created_at" @click="$emit('postClicked', post)">
      <p>{{ post.content || "内容なし" }}</p>
      <p v-if="post.special">特別な情報: {{ post.special }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    posts: Array,
  },
};
</script>