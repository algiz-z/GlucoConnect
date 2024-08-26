<template>
  <div v-if="patientPosts.length > 0">
    <h2 v-if="patient">{{ patient.username }} の詳細情報</h2>
    <h3>投稿一覧</h3>
    <div v-for="post in patientPosts" :key="post.created_at" class="ui card">
      <div class="content">
        <div class="header">{{ formatDate(post.created_at) }}</div>
        <div class="meta">
          <span v-if="post.post_type === 'note'">日常記録</span>
          <span v-else-if="post.post_type === 'medicine'">薬の相性</span>
          <span v-else-if="post.post_type === 'meal'">食事記録</span>
          <span v-else>その他</span>
        </div>
        <div class="description">
          <p>{{ post.content || "内容なし" }}</p>
          <p v-if="post.special">特別な情報: {{ post.special }}</p>
          <p v-if="post.post_type === 'medicine'">薬の評価: {{ post.medicine_score }}</p>
        </div>
      </div>
      <div v-if="post.picture" class="image">
        <img :src="post.picture" alt="投稿画像" />
      </div>
    </div>
  </div>
  <div v-else>Loading...</div>
</template>

<script>
import { baseUrl } from "@/assets/config.js";

export default {
  data() {
    return {
      patient: null, // 患者の詳細情報を格納
      patientPosts: [], // この患者に関連する投稿
    };
  },
  methods: {
    async fetchPatientDetails() {
      try {
        const patientId = this.$route.params.id;

        // 患者の投稿データを取得
        const articlesResponse = await fetch(`${baseUrl}/articles?userId=${patientId}`, {
          headers: {
            Authorization: 'mtitoken', // 認証トークンを追加
          },
        });
        if (!articlesResponse.ok) {
          throw new Error(`HTTP error! status: ${articlesResponse.status}`);
        }
        const articlesData = await articlesResponse.json();
        this.patientPosts = articlesData.articles || []; // 投稿データを格納

        // 仮にpatient情報が含まれている場合、取得して設定
        if (this.patientPosts.length > 0) {
          this.patient = {
            username: this.patientPosts[0].user_id, // 例として user_id を使用
          };
        }

      } catch (error) {
        console.error("Error fetching patient details or posts:", error);
      }
    },
    formatDate(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    },
  },
  mounted() {
    this.fetchPatientDetails();
  },
};
</script>

<style scoped>
.ui.card {
  margin-bottom: 20px;
}
</style>