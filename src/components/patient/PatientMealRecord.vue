<template>
  <div>
    <TextAreaWithCounter :value="content" @input="updateContent" />
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
  methods: {
    updateContent(content) {
      this.$emit('update:content', content);
    },
  },
};
</script>