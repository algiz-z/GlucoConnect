<template>
  <div>
    <TextAreaWithCounter :value="content" @input="handleInput" />
    <div class="ui mini header meal-photo-description">
      食事の写真が投稿ボタン左のボタンよりアップロード可能です
    </div>
  </div>
</template>

<script>
import TextAreaWithCounter from '@/components/TextAreaWithCounter.vue';

export default {
  name: 'PatientMealRecord',
  props: {
    content: String,
  },
  components: {
    TextAreaWithCounter,
  },
  data() {
    return {
      localContent: this.content
    };
  },
  watch: {
    content(newVal) {
      this.localContent = newVal;
    },
    localContent(newVal) {
      this.$emit('update:content', newVal);
    }
  }
};
</script>