<template>
  <div :class="['ui segment post-form', themeClass]">
    <PostTypeMenu :postType="postType" @update:postType="updatePostType" />

    <form class="ui form" @submit.prevent="submitPost">
      <div class="ui grid">
        <div class="sixteen wide column">
          <!-- PatientDailyRecord.vueやPatientMealRecord.vueのコンテンツがここに挿入されます -->
          <slot :content="formData" @input="updateContent"></slot>
        </div>

        <div class="sixteen wide column right aligned">
          <button
            class="ui small icon button"
            @click="triggerFileInput"
            type="button"
          >
            <i class="upload icon"></i>
          </button>
          <button
            class="ui large button circular"
            :style="activeButtonStyle"
            type="submit"
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
  data() {
    return {
      formData: this.content || '', // 初期値をcontentから取得
    };
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
  watch: {
    content(newContent) {
      this.formData = newContent;
    },
  },
  methods: {
    updatePostType(type) {
      this.$emit('update:postType', type);
    },
    triggerFileInput() {
      document.getElementById('fileUpload').click();
    },
    removeImage() {
      this.$emit('update:imageSrc', null);
    },
    submitPost() {
      this.$emit('submitPost', this.formData);
    },
    updateContent(value) {
      this.formData = value;
      this.$emit('input', value); // 親に更新を通知
    },
  },
};
</script>