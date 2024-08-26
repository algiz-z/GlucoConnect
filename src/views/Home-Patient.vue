<template>
  <div class="ui grid centered">
    <!-- メニューバー -->
    <div class="sixteen wide column">
      <!-- Menuコンポーネントがここに配置されると仮定 -->
    </div>

    <!-- 投稿フォーム -->
    <div class="sixteen wide column">
      <div class="ui main container">
        <div class="ui active inverted page dimmer" v-if="isLoading">
          <div class="ui text loader">Loading</div>
        </div>
        <PostForm
          :postType="newArticle.post_type"
          :content.sync="newArticle.content"
          :imageSrc.sync="newArticle.imageSrc"
          :isFormValid="isFormValid"
          @update:postType="updatePostType"
          @submitPost="submitPost"
        >
          <template v-slot>
            <component
              :is="currentComponent"
              :content.sync="newArticle.content"
              :imageSrc.sync="newArticle.imageSrc"
              :medicineScore.sync="newArticle.medicine_score"
              :medicineName.sync="newArticle.medicine_name"
              @update:content="updateContent"
              @update:imageSrc="updateImageSrc"
              @update:medicineScore="updateMedicineScore"
              @update:medicineName="updateMedicineName"
            />
          </template>
        </PostForm>
      </div>
    </div>

    <!-- タイムライン -->
    <div class="sixteen wide column">
      <div class="timeline-container">
        <Timeline :articles="articles" />
      </div>
    </div>
  </div>
</template>

<script>
import { baseUrl } from '@/assets/config.js';
import PostForm from '@/components/PostForm.vue';
import Timeline from '@/components/Timeline.vue';
import PatientDailyRecord from '@/components/patient/PatientDailyRecord.vue';
import PatientMealRecord from '@/components/patient/PatientMealRecord.vue';
import MedicineScoreSelector from '@/components/patient/MedicineScoreSelector.vue';

export default {
  name: 'HomePatient',
  components: {
    PostForm,
    Timeline,
    PatientDailyRecord,
    PatientMealRecord,
    MedicineScoreSelector,
  },
  data() {
    return {
      isLoading: true,
      newArticle: {
        post_type: 1,
        content: '',  // 空の文字列で初期化
        imageSrc: '',
        medicine_score: 5,
        medicine_name: '',
      },
      articles: [], // APIから取得する記事を格納するための配列
    };
  },
  computed: {
    isFormValid() {
      switch (this.newArticle.post_type) {
        case 1:
          return this.newArticle.content && this.newArticle.content.length > 0;
        case 2:
          return (this.newArticle.content && this.newArticle.content.length > 0) || (this.newArticle.imageSrc && this.newArticle.imageSrc.length > 0);
        case 3:
          return this.newArticle.medicine_score > 0 && this.newArticle.medicine_name.length > 0;
        default:
          return false;
      }
    },
    currentComponent() {
      switch (this.newArticle.post_type) {
        case 1:
          return 'PatientDailyRecord';
        case 2:
          return 'PatientMealRecord';
        case 3:
          return 'MedicineScoreSelector';
      }
    }
  },
  methods: {
    updateContent(event) {
      this.newArticle.content = event.target.value || '';  // テキストエリアの値を取得
    },
    updateImageSrc(src) {
      this.newArticle.imageSrc = src;
    },
    updatePostType(type) {
      this.newArticle.post_type = type;
    },
    updateMedicineScore(score) {
      this.newArticle.medicine_score = score;
    },
    updateMedicineName(name) {
      this.newArticle.medicine_name = name;
    },
    async submitPost() {
      const authToken = localStorage.getItem('token');
      const userId = localStorage.getItem('user_id');
      
      if (!authToken || !userId) {
        console.error('No authorization token or user_id found in localStorage');
        this.$router.push('/login'); // Loginページにリダイレクト
        return;
      }
  
      let newArticle = {
        user_id: userId,
        created_at: Date.now(), // UNIXTIMEでタイムスタンプを設定 (ミリ秒単位)
        post_type: '',
        content: '',
        medicine_score: 0,
        picture: '',
        special: ''
      };
  
      switch (this.newArticle.post_type) {
        case 1: // 日常記録
          newArticle.post_type = 'note';
          newArticle.content = this.newArticle.content;
          break;
        case 2: // 食事記録
          newArticle.post_type = 'meal';
          newArticle.content = this.newArticle.content;
          newArticle.picture = this.newArticle.imageSrc;
          break;
        case 3: // 薬記録
          newArticle.post_type = 'medicine';
          newArticle.medicine_score = this.newArticle.medicine_score;
          newArticle.special = this.newArticle.medicine_name; // 薬の名前を special に格納
          newArticle.content = this.newArticle.content;
          break;
        default:
          console.error('Unknown post type');
          return;
      }
  
      try {
        const response = await fetch(`${baseUrl}/article`, {
          method: 'POST',
          headers: {
            'Authorization': authToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newArticle),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        console.log('Post successful');
        this.fetchArticles(); // タイムラインを更新
        this.resetForm(); // フォームをリセット (投稿成功後に実行)
      } catch (error) {
        console.error('Error submitting post:', error);
      }
    },
    resetForm() {
      this.newArticle = {
        post_type: 1,
        content: '',  // フォームリセット時に再度空文字で初期化
        imageSrc: '',
        medicine_score: 5,
        medicine_name: '',
      };
    },

    async fetchArticles() {
      const userId = localStorage.getItem('user_id');
      const authToken = localStorage.getItem('token');
    
      if (!userId || !authToken) {
        console.error('No user_id or authorization token found in localStorage');
        this.$router.push('/login'); // Loginページにリダイレクト
        this.isLoading = false;
        return;
      }

      const url = `${baseUrl}/articles?userId=${encodeURIComponent(userId)}`;
    
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': authToken,
            'Content-Type': 'application/json',
          },
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        console.log('Fetched articles:', data.articles); // デバッグ用のコンソール出力

        // articles 配列にデータをセット
        this.articles = data.articles.map(article => ({
          ...article,
          content: article.content || '', // contentが存在しない場合は空文字列を設定
        }));
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        this.isLoading = false;
      }
    },
  },
  mounted() {
    this.fetchArticles(); // コンポーネントがマウントされたときに記事をフェッチ
  },
};
</script>

<style scoped>
/* タイムラインを中央に寄せるためのスタイル */
.timeline-container {
  max-width: 800px; /* タイムラインの最大幅を指定 */
  width: 100%;
  margin: 0 auto; /* タイムラインを中央に配置 */
  padding: 20px;
  background-color: #ffffff; /* タイムライン部分の背景を白に設定 */
  border-radius: 5px; /* 角を丸くするオプション */
}

.ui.grid.centered {
  justify-content: center;
}

.ui.main.container {
  margin-top: 20px; /* メニューバーと投稿フォームの間にスペースを追加 */
}
</style>