<template>
  <div class="ui grid">
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
          :content="newArticle.content"
          :imageSrc="newArticle.imageSrc"
          :isFormValid="isFormValid"
          @update:content="updateContent"
          @update:imageSrc="updateImageSrc"
          @update:postType="updatePostType"
          @submitPost="submitPost"
        >
          <template v-slot>
            <component
              :is="currentComponent"
              :content="newArticle.content"
              :imageSrc="newArticle.imageSrc"
              :medicineScore="newArticle.medicine_score"
              :medicineName="newArticle.medicine_name"
              @update:content="updateContent"
              @update:imageSrc="updateImageSrc"
              @update:medicineScore="updateMedicineScore"
              @update:medicineName="updateMedicineName"
            />
          </template>
        </PostForm>
      </div>
    </div>

    <!-- Timeline -->
    <div class="sixteen wide column timeline-container">
      <Timeline :articles="articles" />
    </div>
  </div>
</template>

<style scoped>
/* 投稿フォームとタイムラインの背景色を指定 */
.timeline-container {
  background-color: #ffffff; /* タイムライン部分の背景を白に設定 */
  padding: 20px; /* タイムラインに適度なパディングを追加 */
  border-radius: 5px; /* 角を丸くするオプション (必要に応じて調整) */
}
</style>

<script>
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
      isLoading: false,
      newArticle: {
        post_type: 1,
        content: '',
        imageSrc: '',
        medicine_score: 5,
        medicine_name: '',
      },
      articles: [
        {
          id: 1,
          username: 'Mariana Mie',
          userAvatar: 'https://www.w3schools.com/howto/img_avatar.png',
          createdAt: '2024年8月24日 20:33',
          postType: 'note',
          content: 'Today was a good day!',
          mealPicture: '',
          medicineScore: '',
        },
        {
          id: 2,
          username: 'Mariana Mie',
          userAvatar: 'https://www.w3schools.com/howto/img_avatar.png',
          createdAt: '2024年8月24日 20:35',
          postType: 'meal',
          content: '',
          mealPicture: 'https://semantic-ui.com/images/wireframe/square-image.png',
          medicineScore: '',
        },
        {
          id: 3,
          username: 'Mariana Mie',
          userAvatar: 'https://www.w3schools.com/howto/img_avatar.png',
          createdAt: '2024年8月24日 20:37',
          postType: 'medicine',
          content: '',
          mealPicture: '',
          medicineScore: '8',
        },
      ],
    };
  },
  computed: {
    isFormValid() {
      switch (this.newArticle.post_type) {
        case 1:
          return this.newArticle.content.length > 0;
        case 2:
          return this.newArticle.imageSrc.length > 0;
        case 3:
          return this.newArticle.medicine_score > 0;
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
    },
  },
  methods: {
    updateContent(content) {
      this.newArticle.content = content;
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
    submitPost() {
      // 投稿処理
    },
  },
};
</script>
