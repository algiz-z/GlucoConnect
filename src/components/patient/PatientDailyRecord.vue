<template>
  <div>
    <TextAreaWithCounter :value="content" @input="handleInput" />
  </div>
</template>

<script>
import TextAreaWithCounter from '@/components/TextAreaWithCounter.vue';

export default {
  name: 'PatientDailyRecord',
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

<style scoped>
/* 必要であれば、特定のスタイルを追加 */
</style>