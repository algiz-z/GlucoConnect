<template>
  <div :class="['ui three item menu huge', themeClass]">
    <button
      :class="['ui button item large', { active: postType === 1 }]"
      @click="$emit('update:postType', 1)"
    >
      <i class="calendar alternate outline icon"></i> 日常記録
    </button>
    <button
      :class="['ui button item large', { active: postType === 2 }]"
      @click="$emit('update:postType', 2)"
    >
      <i class="utensils icon"></i> 食事記録
    </button>
    <button
      :class="['ui button item large', { active: postType === 3 }]"
      @click="$emit('update:postType', 3)"
    >
      <i class="pills icon"></i> 薬の相性
    </button>
  </div>
</template>

<script>
export default {
  name: 'PostTypeMenu',
  props: {
    postType: {
      type: Number,
      required: true,
    },
  },
  computed: {
    themeClass() {
      switch (this.postType) {
        case 1:
          return 'daily-record-theme';
        case 2:
          return 'meal-record-theme';
        case 3:
          return 'medicine-theme';
        default:
          return '';
      }
    },
  },
};
</script>

<style scoped>
.ui.menu {
  border-bottom: none;
}

/* デフォルトのアクティブなボタンの文字色を修正 */
.ui.button.active {
  color: white !important; /* アクティブな状態のボタンの文字色を白に設定 */
  background-color: inherit;
  border-bottom: 3px solid white; /* アクティブなボタンの下に白のボーダー */
}

.daily-record-theme .ui.button.active {
  background-color: #00b5ad; /* 日常記録のテーマ色 */
}

.meal-record-theme .ui.button.active {
  background-color: #f2711c; /* 食事記録のテーマ色 */
}

.medicine-theme .ui.button.active {
  background-color: #21ba45; /* 薬の相性のテーマ色 */
}
</style>