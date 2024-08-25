<template>
  <div>
    <!-- 薬の名前を入力するフィールド -->
    <div class="field">
      <label for="medicine-name">薬の名前</label>
      <input
        type="text"
        id="medicine-name"
        placeholder="薬の名前を入力"
        :value="medicineName"
        @input="updateMedicineName"
        class="ui input"
      />
    </div>

    <!-- テキストエリア -->
    <TextAreaWithCounter :value="content" @input="updateContent" />

    <!-- 薬のスコアを選択するメニュー -->
    <div class="ui mini header">薬のスコアを選択してください:</div>
    <div class="ui ten item menu">
      <template v-for="n in 10" :key="n">
        <button class="ui button item" :class="{ active: medicineScore === n }" @click="$emit('update:medicineScore', n)">
          {{ n }}
        </button>
      </template>
    </div>
  </div>
</template>

<script>
import TextAreaWithCounter from '@/components/TextAreaWithCounter.vue';

export default {
  name: 'MedicineScoreSelector',
  components: {
    TextAreaWithCounter,
  },
  props: {
    content: String,
    medicineScore: Number,
    medicineName: String,  // 薬の名前を受け取るプロパティ
  },
  methods: {
    updateContent(content) {
      this.$emit('update:content', content);
    },
    updateMedicineName(event) {
      this.$emit('update:medicineName', event.target.value);
    }
  }
};
</script>

<style scoped>
/* 必要に応じて追加のスタイルをここに記述 */
</style>