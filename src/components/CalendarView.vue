<template>
  <div class="field padding-top">
    <table class="ui celled table">
      <thead>
        <tr>
          <th v-for="day in daysOfWeek" :key="day" class="center aligned">{{ day }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(week, weekIndex) in calendar" :key="weekIndex">
          <td 
            v-for="day in week" 
            :key="day.date"
            @mouseenter="showPostSummary(day.date)"
            @click="selectDate(day.date)"
            style="cursor: pointer;"
          >
            <div class="ui teal circular">{{ day.date }}</div>
            <div v-if="daySummary[day.date]">
              <span v-for="(count, type) in daySummary[day.date]" :key="type">{{ type }}: {{ count }} 件</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    posts: Array,
    calendar: Array,
    daysOfWeek: Array,
  },
  data() {
    return {
      daySummary: {},
    };
  },
  methods: {
    showPostSummary(date) {
      if (!date) return;
      const postsForDate = this.posts.filter(post => new Date(post.created_at).getDate() === date);
      const summary = postsForDate.reduce((acc, post) => {
        if (!acc[post.post_type]) {
          acc[post.post_type] = 0;
        }
        acc[post.post_type]++;
        return acc;
      }, {});
      this.daySummary = {
        ...this.daySummary,
        [date]: summary
      };
    },
    selectDate(date) {
      this.$emit('postClicked', date);
    },
  },
};
</script>