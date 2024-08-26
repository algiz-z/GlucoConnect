<template>
  <div class="ui feed timeline">
    <div v-for="article in articles" :key="article.created_at" :class="['ui card', postTypeClass(article)]">
      <div class="content">
        <!-- 投稿者の情報 -->
        <div class="right floated meta">{{ formatDate(article.created_at) }}</div>
        <img class="ui avatar image" :src="getUserAvatar(article.user_id)" alt="User Avatar" />
        <span>{{ article.user_id }}</span>
      </div>
      <div class="content">
        <!-- 投稿タイプによるアイコン表示 -->
        <i :class="['icon', postTypeIcon(article)]"></i>

        <!-- 投稿内容 -->
        <p v-if="article.content && article.content.length > 0">{{ article.content }}</p>

        <!-- 画像の表示 (食事記録の場合) -->
        <div v-if="article.picture && article.picture.length > 0">
          <img :src="article.picture" alt="Meal" class="ui medium rounded image" />
        </div>

        <!-- 薬のスコアの表示 (薬の相性の場合) -->
        <div v-if="article.post_type === 'medicine' && article.medicine_score > 0" class="ui mini statistics">
          <div class="statistic">
            <div class="value">{{ article.medicine_score }}</div>
            <div class="label">服用後の体調スコア</div>
          </div>
        </div>
      </div>
      <!-- いいねやコメントのアイコン -->
      <div class="extra content">
        <a><i class="like icon"></i> いいね</a>
        <a><i class="comment icon"></i> コメント</a>
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
  methods: {
    postTypeClass(article) {
      switch (article.post_type) {
        case 'note':
          return 'daily-record';
        case 'meal':
          return 'meal-record';
        case 'medicine':
          return 'medicine-record';
        default:
          return '';
      }
    },
    postTypeIcon(article) {
      switch (article.post_type) {
        case 'note':
          return 'sticky note outline';
        case 'meal':
          return 'utensils';
        case 'medicine':
          return 'pills';
        default:
          return '';
      }
    },
    formatDate(timestamp) {
      const date = new Date(timestamp);
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes()}`;
    },
    getUserAvatar(userId) {
      return 'https://www.w3schools.com/howto/img_avatar.png';
    }
  },
};
</script>

<style scoped>
/* タイムラインの全体的なスタイル */
.timeline {
  margin-top: 20px;
  max-width: 800px; /* タイムライン全体の幅を指定 */
  margin-left: auto;
  margin-right: auto;
}

/* カード全体のスタイル */
.ui.card {
  width: 100%; /* カードをタイムラインコンテナの幅に合わせる */
  padding: 10px;
  margin-bottom: 20px;
}

/* 各投稿タイプのカードの色設定 */
.daily-record {
  background-color: #e0f7fa; /* 日常記録の背景色 */
}

.meal-record {
  background-color: #fff3e0; /* 食事記録の背景色 */
}

.medicine-record {
  background-color: #e8f5e9; /* 薬の相性記録の背景色 */
}

/* カード内のアイコンスタイル */
.ui.card .icon {
  margin-right: 5px;
}

/* カード内のテキストスタイル */
.ui.card p {
  font-size: 1.1em;
}

/* いいね、コメントアイコン */
.extra.content a {
  margin-right: 15px;
}
</style>