<template>
  <div class="textarea-container">
    <textarea
      :value="value"
      @input="handleInput"
      @compositionend="handleCompositionEnd"
      rows="4"
      maxlength="400"
      placeholder="ここにメモを書いてください"
    ></textarea>
    <div class="char-count">{{ value.length }} / 400</div>
  </div>
</template>

<script>
export default {
  name: 'TextAreaWithCounter',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  methods: {
    handleInput(event) {
      if (!event.isComposing) {
        this.$emit('input', event.target.value);
      }
    },
    handleCompositionEnd(event) {
      this.$emit('input', event.target.value);
    }
  }
};
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
</style>