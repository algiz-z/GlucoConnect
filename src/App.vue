<template>
  <div id="app">
    <Menu v-if="showMenu" :account_type="account_type" :postType="postType" />
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Menu from '@/components/Menu.vue';

export default {
  name: 'App',
  components: {
    Menu,
  },
  setup() {
    const route = useRoute();

    const showMenu = computed(() => route.path !== '/login');
    const account_type = ref(localStorage.getItem('account_type'));
    const postType = ref(1);

    const updatePostType = () => {
      if (route.path.includes('home-patient')) {
        postType.value = 1;
      } else if (route.path.includes('meal-record')) {
        postType.value = 2;
      } else if (route.path.includes('medicine')) {
        postType.value = 3;
      }
    };

    watch(route, updatePostType, { immediate: true });

    return {
      showMenu,
      account_type,
      postType,
    };
  },
};
</script>

<style scoped>
.main-content {
  margin-top: 2rem; /* メニューとコンテンツの間にスペースを追加 */
}
</style>