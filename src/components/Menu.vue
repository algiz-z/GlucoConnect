<template>
  <div class="ui active inverted page dimmer" v-if="isLoading">
      <div class="ui text loader">Loading</div>
  </div>
  <div class="ui top fixed inverted teal massive menu">
    <router-link active-class="active" v-if="account_type === 'patient'" class="item" exact to="/home-patient"><i class="home icon"></i> Home</router-link>
    <router-link active-class="active" v-if="account_type === 'doctor'" class="item" exact to="/home-doctor"><i class="home icon"></i> Home</router-link>
    <router-link active-class="active" v-if="account_type === 'patient'" class="item" to="/doctor-list"><i class="user plus icon"></i> Following</router-link>
    <router-link active-class="active" v-if="account_type === 'doctor'" class="item" exact to="/patient-list"><i class="users icon"></i> Followers</router-link>
    <router-link active-class="active" class="item" to="/profile"><i class="user icon"></i> Profile</router-link>
    <div class="right menu">
      <a @click="logout" class="item"><i class="sign out icon"></i> Logout</a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Menu',
    computed: {
      
    },
    
    data() {
    // Vue.jsで使う変数はここに記述する
    return {
      userId: window.localStorage.getItem('userId'),
      isLoading: false,
    };
  },
  
  
  methods: {
    logout() {
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      window.localStorage.clear();
      this.$router.replace({ name : 'Login' });
      this.isLoading=false;
    }
  },
    
  props: {
    account_type: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped>
  
</style>
