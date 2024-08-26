<template>
  <div class="field">
    <table class="ui celled table">
      <thead>
        <tr>
          <th v-for="day in daysOfWeek" :key="day" class="center aligned">{{ day }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(week, weekIndex) in calendar" :key="weekIndex">
          <td v-for="day in week" :key="day.date">
            <div class="ui teal circular">{{ day.date }}</div>
            <PostList :posts="getPostsForDate(day.date)" @postClicked="$emit('postClicked', $event)" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import PostList from '@/components/PostList.vue';

export default {
  components: {
    PostList,
  },
  props: {
    posts: Array,
    calendar: Array,
    daysOfWeek: Array,
  },
  methods: {
    getPostsForDate(date) {
      return this.posts.filter(post => {
        const postDate = new Date(post.created_at).getDate();
        return postDate === date;
      });
    },
  },
};
</script>