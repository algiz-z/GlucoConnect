<template>
  <div>
    <input type="file" id="fileUpload" style="display: none" @change="handleFileUpload" />
    <button class="ui teal medium button circular" type="button" @click="triggerFileInput">
      <i class="upload icon"></i> 写真をアップロード
    </button>
  </div>
</template>

<script>
export default {
  name: 'ImageUploader',
  methods: {
    triggerFileInput() {
      document.getElementById('fileUpload').click();
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        this.$emit('fileUploaded', imageUrl); // 親コンポーネントにアップロードされた画像のURLを伝える
      }
    }
  }
}
</script>

<style scoped>
.ui.teal.medium.button.circular {
  margin-top: 10px;
}
</style>