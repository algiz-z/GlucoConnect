<template>
  <form class="ui form">
    <!-- 投稿タイプに応じてフォームの表示内容を切り替える -->
    <div class="ui grid">
      <!-- 写真アップロードボタン -->
      <div class="row">
        <div class="sixteen wide column right aligned">
          <ImageUploader @fileUploaded="handleFileUpload" />
        </div>
      </div>

      <!-- テキストエリア（診察・日常記録） -->
      <div class="row" v-if="postType === 1">
        <div class="one wide column right aligned vertical top aligned">
          <img :src="'https://www.w3schools.com/howto/img_avatar.png'" class="ui image circular" alt="Profile Picture" />
        </div>
        <div class="fifteen wide column">
          <div class="field textarea-container">
            <textarea rows="4" maxlength="400" placeholder="ここにメモを書いてください" v-model="content" />
            <div class="char-count">{{ content.length }} / 400</div>
          </div>
        </div>
      </div>

      <!-- テキストエリア（食事記録） -->
      <div class="row" v-if="postType === 2">
        <div class="one wide column right aligned vertical top aligned">
          <img :src="'https://www.w3schools.com/howto/img_avatar.png'" class="ui image circular" alt="Profile Picture" />
        </div>
        <div class="fifteen wide column">
          <div class="field textarea-container">
            <textarea rows="4" maxlength="400" placeholder="食事の詳細やコメントを書いてください" v-model="content" />
            <div class="char-count">{{ content.length }} / 400</div>
          </div>
        </div>
      </div>

      <!-- テキストエリアとスコア（薬の相性記録） -->
      <div class="row" v-if="postType === 3">
        <div class="one wide column right aligned vertical top aligned">
          <img :src="'https://www.w3schools.com/howto/img_avatar.png'" class="ui image circular" alt="Profile Picture" />
        </div>
        <div class="fifteen wide column">
          <div class="field textarea-container">
            <textarea rows="4" maxlength="400" placeholder="薬の効果やコメントを書いてください" v-model="content" />
            <div class="char-count">{{ content.length }} / 400</div>
          </div>
          <div class="ui teal ten item menu">
            <template v-for="n in 10" :key="n">
              <button class="ui button item" :class="{ active: medicineScore === n }" @click="$emit('update:medicineScore', n)">
                {{ n }}
              </button>
            </template>
          </div>
        </div>
      </div>

      <!-- 画像プレビュー -->
      <div class="row" v-if="imageSrc">
        <div class="sixteen wide column center aligned">
          <div class="center aligned vertical middle aligned image-container">
            <img :src="imageSrc" alt="Preview" class="ui image small" />
            <button @click="removeImage" class="ui tiny icon lightgrey button circular remove-button">
              <i class="close icon"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- 投稿ボタン -->
      <div class="row">
        <div class="sixteen wide column right aligned">
          <button class="ui teal medium button circular" type="button" @click="submitPost">
            投稿
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import ImageUploader from '@/components/ImageUploader.vue';

export default {
  name: 'PostForm',
  components: {
    ImageUploader
  },
  props: {
    postType: Number,
    content: String,
    imageSrc: String,
    medicineScore: Number
  },
  methods: {
    handleFileUpload(imageSrc) {
      this.$emit('update:imageSrc', imageSrc);
    },
    removeImage() {
      this.$emit('update:imageSrc', null);
    },
    submitPost() {
      this.$emit('submitPost');
    }
  }
}
</script>

<style scoped>
.textarea-container {
  position: relative;
}
.textarea-container textarea {
  width: 100%;
  resize: none;
}
.char-count {
  position: absolute;
  bottom: 0.8rem;
  right: 0.8rem;
  color: #888;
  font-size: 0.8rem;
}
.remove-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 10;
}
.image-container {
  position: relative;
  display: inline-block;
}
</style>