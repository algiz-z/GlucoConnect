<template>
  <div :class="['ui segment', postTypeClass]">
    <slot name="patient-specific"></slot> <!-- 患者専用のコンポーネントが挿入されるスロット -->
    <TextAreaWithCounter :value="content" @input="updateContent" />
    <ImageUploader :imageSrc="imageSrc" @update:imageSrc="updateImageSrc" />
    <div class="row">
      <div class="sixteen wide column right aligned">
        <button class="ui small icon button" @click="triggerFileInput" type="button">
          <i class="upload icon"></i>
        </button>
        <button
          class="ui medium button circular"
          :style="activeButtonStyle"
          type="button"
          @click="submitPost"
          :disabled="!isFormValid"
        >
          投稿
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import TextAreaWithCounter from './TextAreaWithCounter.vue';
import ImageUploader from './ImageUploader.vue';

export default {
  name: 'PostForm',
  components: {
    TextAreaWithCounter,
    ImageUploader
  },
  props: {
    content: String,
    imageSrc: String,
    isFormValid: Boolean
  },
  data() {
    return {
      themeColor: '#00b5ad' // デフォルトの水色
    };
  },
  methods: {
    updateContent(content) {
      this.$emit('update:content', content);
    },
    updateImageSrc(src) {
      this.$emit('update:imageSrc', src);
    },
    submitPost() {
      this.$emit('submitPost');
    },
    triggerFileInput() {
      document.getElementById('fileUpload').click();
    },
    removeImage() {
      this.$emit('update:imageSrc', null);
    },
    changeThemeColor(color) {
      this.themeColor = color; // 患者用コンポーネントから受け取った