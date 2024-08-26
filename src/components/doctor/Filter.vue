<template>
  <div class="ui segment">
    <form class="ui form">
      <div class="ui grid">
        <div class="row">
          <div class="one wide column center aligned vertical middle aligned">
            <label>氏名：</label>
          </div>
          <div class="fourteen wide column">
            <input v-model="username" type="text" name="username" placeholder="氏名" class="ui huge fluid input" />
          </div>
        </div>

        <div class="row inline">
          <div class="one wide column center aligned vertical middle aligned">
            <label>HbA1c：</label>
          </div>
          <div class="six wide column">
            <div class="ui right labeled input">
              <input v-model.number="start" type="number" name="HbA1c-start" placeholder="から" />
              <div class="ui label">%から</div>
            </div>
          </div>
          <div class="six wide column">
            <div class="ui right labeled input">
              <input v-model.number="end" type="number" name="HbA1c-end" placeholder="まで" />
              <div class="ui label">%まで</div>
            </div>
          </div>
          <div class="two wide column">
            <button type="button" class="ui teal circular button" @click="resetForm">
              リセット
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Filter',
  data() {
    return {
      username: '',
      start: null,
      end: null,
    };
  },
  methods: {
    resetForm() {
      this.username = '';
      this.start = null;
      this.end = null;
      this.$emit('filterChange', this.getFilterData()); // Emit filterChange on reset
    },
    getFilterData() {
      return {
        username: this.username,
        start: this.start,
        end: this.end,
      };
    }
  },
  watch: {
    username() {
      this.$emit('filterChange', this.getFilterData());
    },
    start() {
      this.$emit('filterChange', this.getFilterData());
    },
    end() {
      this.$emit('filterChange', this.getFilterData());
    },
  }
};
</script>
