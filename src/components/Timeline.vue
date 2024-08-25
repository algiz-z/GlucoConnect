<template>
  <div class="ui feed">
    <div class="event" v-for="article in articles" :key="article.id">
      <div class="label">
        <img :src="article.userAvatar" />
      </div>
      <div class="content">
        <div class="summary">
          <a class="user">{{ article.username }}</a>
          <div class="date">{{ article.createdAt }}</div>
        </div>
        <div class="extra text">{{ article.content }}</div>
        <div v-if="article.mealPicture" class="extra images">
          <img :src="article.mealPicture" class="ui small rounded image" />
        </div>
        <div v-if="article.medicineScore" class="extra text">
          薬のスコア: {{ article.medicineScore }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Timeline',
  props: {
    articles: Array,
  },
};
</script>