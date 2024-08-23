<template>
  <div>
    <div class="ui main container">
      <!-- 基本的なコンテンツはここに記載する -->
      
      <div class="ui active inverted page dimmer" v-if="isLoading">
        <div class="ui text loader">Loading</div>
      </div>
      
      <div v-if="message" class="ui negative message">
        {{ message }}
      </div>
      
      <div class="ui segment">
        <form class="ui large form" @submit.prevent="submit">
          
          <div class="field">
            <div class="ui left icon input">
              <i class="user icon"></i>
              <input type="text" placeholder="ID" v-model="user.userId">
            </div>
          </div>
          
          <div class="field">
            <div class="ui left icon input">
              <i class="lock icon"></i>
              <input type="password" placeholder="Password" v-model="user.password">
            </div>
          </div>
          
          <button class="ui fluid green huge button" type="submit" :disabled="!isFormValid">
            {{ submitText }}
          </button>
          
        </form>
      </div>
      <button @click="toggleMode()" class="ui large grey fluid button">
        {{ toggleText }}
      </button>
    </div>
  </div>
</template>

<script>
// 必要なものはここでインポートする
// @は/srcの同じ意味です
// import something from '@/components/something.vue';
import { baseUrl } from '@/assets/config.js';

export default {
  name: 'Login',

  components: {
    // 読み込んだコンポーネント名をここに記述する
  },

  data() {
    // Vue.jsで使う変数はここに記述する
    return {
      isLoading: false,
      isLogin: true,
      user: {
        userId: null,
        password: null,
      },
      message: null,
    };
  },

  computed: {
    // 計算した結果を変数として利用したいときはここに記述する
    submitText() {
      return this.isLogin ? 'ログイン' : '新規登録';
    },
    toggleText() {
      return this.isLogin ? '新規登録' : 'ログイン';
    },
    isFormValid() {
      if(this.isLogin) {
        return this.user.userId && this.user.password;
      }
      return this.user.userId && this.user.password;
    }
  },

  methods: {
    // Vue.jsで使う関数はここで記述する
    toggleMode() {
      this.isLogin = !this.isLogin
    },
    async submit(){
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      if(this.isLogin) {
        //リクエストボディを指定する
        const requestBody = {
          userId: this.user.userId,
          password: this.user.password
        };
  
        try {
          /* global fetch */
          const res = await fetch(baseUrl + '/user/login', {
            method: "POST",
            body: JSON.stringify(requestBody),
          });
  
          const text = await res.text();
          const jsonData = text ? JSON.parse(text) : {};
  
          // fetchではネットワークエラー以外のエラーはthrowされないため、明示的にthrowする
          if (!res.ok) {
            const errorMessage =
              jsonData.message ?? 'エラーメッセージがありません。';
            throw new Error(errorMessage);
          }
  
          // 成功時の処理
          console.log(jsonData);
          window.localStorage.setItem('token', jsonData.token);
          window.localStorage.setItem('userId', this.user.userId);
          this.$router.push({ name : 'Home' });
          
        } catch (e) {
          this.message = e.message;
          // エラー時の処理
        } finally {
          this.isLoading = false;
        }
        return
      }
      //新規登録
      // リクエストボディを指定する
      const requestBody = {
        userId: this.user.userId,
        password: this.user.password,
      };

      try {
        /* global fetch */
        const res = await fetch(baseUrl + '/user/signup', {
          method: "POST",
          body: JSON.stringify(requestBody),
        });

        const text = await res.text();
        const jsonData = text ? JSON.parse(text) : {};

        // fetchではネットワークエラー以外のエラーはthrowされないため、明示的にthrowする
        if (!res.ok) {
          const errorMessage =
            jsonData.message ?? 'エラーメッセージがありません。';
          throw new Error(errorMessage);
        }

        // 成功時の処理
        console.log(jsonData);
        window.localStorage.setItem('token', jsonData.token);
        window.localStorage.setItem('userId', this.user.userId);
        this.$router.push({ name : 'Home' });
          
      } catch (e) {
        this.message = e.message;
        // エラー時の処理
      } finally {
          this.isLoading = false;
      }
    },
  },
  
}
</script>

<style scoped>
/* このコンポーネントだけに適用するCSSはここに記述する */
</style>
