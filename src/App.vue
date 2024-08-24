<template>
  <div id="app">
    <Menu v-if="showMenu" :account_type="account_type"/>
    <router-view />
  </div>
</template>

<script>
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { RouterView } from 'vue-router';
  import Menu from '@/components/Menu.vue';
  export default {
    name: 'App',
    components: {
      Menu
    },
    setup() {
      const route = useRoute();
      const showMenu = computed(() => {
        return route.path !== '/login';
      });
      
      const account_type = computed(() => {
        return window.localStorage.getItem('account_type');
      });

      return { showMenu, account_type };
    },
  }
</script>
