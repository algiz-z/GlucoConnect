<template>
  <div :class="['ui segment post-form', themeClass]">
    <PostTypeMenu :postType="postType" @update:postType="updatePostType" />

    <form class="ui form">
      <div class="ui grid">
        <div class="sixteen wide column">
          <!-- PatientDailyRecord.vueやPatientMealRecord.vueのコンテンツがここに挿入されます -->
          <slot></slot>
        </div>

        <div class="sixteen wide column right aligned">
          <button class="ui small icon button" @click="triggerFileInput" type="button">
            <i class="upload icon"></i>
          </button>
          <button
            class="ui large button circular"
            :style="activeButtonStyle"
            type="button"
            @click="submitPost"
            :disabled="!isFormValid"
          >
            投稿
          </button>&thinsp;
        </div>

        <div class="sixteen wide column center aligned" v-if="imageSrc">
          <div class="ui small image">
            <img :src="imageSrc" alt="Preview" />
            <button @click="removeImage" class="ui tiny icon button circular">
              <i class="close icon"></i>
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import PostTypeMenu from './patient/PostTypeMenu.vue';

export default {
  name: 'PostForm',
  components: {
    PostTypeMenu,
  },
  props: {
    postType: Number,
    content: String,
    imageSrc: String,
    isFormValid: Boolean,
  },
  computed: {
    themeClass() {
      return {
        1: 'daily-record-border',
        2: 'meal-record-border',
        3: 'medicine-border',
      }[this.postType];
    },
    activeButtonStyle() {
      return {
        1: { backgroundColor: '#00b5ad', color: '#fff' },
        2: { backgroundColor: '#f2711c', color: '#fff' },
        3: { backgroundColor: '#21ba45', color: '#fff' },
      }[this.postType];
    },
  },
  methods: {
    updatePostType(type) {
      this.$emit('update:postType', type);
    },
    triggerFileInput() {
      // 写真アップロード処理
      document.getElementById('fileUpload').click();
    },
    removeImage() {
      this.$emit('update:imageSrc', null);
    },
    submitPost() {
      this.$emit('submitPost');
    },
  },
};
</script>

<style scoped>
/* 投稿部分のスタイル */
.ui.segment.post-form {
  padding: 2rem;
  border-radius: 0.5rem;
  background-color: #ffffff; /* 背景色を白に設定 */
  border: 2px solid; /* 縁の色を動的に変更 */
}

/* 動的に変更される縁の色 */
.daily-record-border {
  border-color: #00b5ad;
}

.meal-record-border {
  border-color: #f2711c;
}

.medicine-border {
  border-color: #21ba45;
}

.ui.grid {
  margin-top: 1rem;
}

.ui.small.image {
  position: relative;
}

.ui.small.image img {
  border-radius: 0.3rem;
}

.ui.small.image button {
  position: absolute;
  top: 0;
  right: 0;
}
</style>