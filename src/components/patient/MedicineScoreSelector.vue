<template>
  <div>
    <!-- 薬の名前を入力するフィールド -->
    <div class="field">
      <label for="medicine-name">薬の名前</label>
      <input
        type="text"
        id="medicine-name"
        placeholder="薬の名前を入力"
        class="ui input"
        :value="medicineName"
        @input="onMedicineNameInput"
      />
    </div>

    <!-- テキストエリア -->
    <TextAreaWithCounter :value="content" @input="handleInput" />

    <!-- 薬のスコアを選択するメニュー -->
    <div class="ui mini header">薬を服用してからの体調の評価（５が変化なし）</div>
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
    medicineName: String,
  },
  methods: {
    onMedicineNameInput(event) {
      const value = event.target.value;
      this.$emit('update:medicineName', value);
    },
    updateContent(value) {
      console.log("event:",event);
      if (value !== undefined) {
        this.$emit('update:content', value);
      } else {
        console.error("Received undefined value in updateContent");
      }
    }
  }
};
</script>