<template>
  <div>
    <div class="ui main container">
      <!-- 基本的なコンテンツはここに記載する -->
      
      <div class="ui active inverted page dimmer" v-if="isLoading">
        <div class="ui text loader">Loading</div>
      </div>
      
      <div v-if="errorMessage" class="ui negative message">
        {{ errorMessage }}
      </div>
      <div v-if="positiveMessage" class="ui positive message">
        {{ positiveMessage }}
      </div>
      
      <div class="ui segment">
        
        <div class="ui teal top attached tabular two item menu">
            <button class="ui button item" :class="{ active: isPatient }" @click="changeUserType()">
              患者
            </button>
            <button class="ui button item" :class="{ active: !isPatient }" @click="changeUserType()">
              医師
            </button>
        </div>
        
        <form class="ui large form bottom attached segment" @submit.prevent="submit">
          
          <div class="field">
            <div class="ui left icon input">
              <i class="id card icon"></i>
              <input type="text" placeholder="User ID" v-model="user.user_id" />
            </div>
          </div>
          
          <div class="field">
            <div class="ui left icon input">
              <i class="lock icon"></i>
              <input type="password" placeholder="Password" v-model="user.password" />
            </div>
          </div>
          
          <div class="field" v-if="!isLogin">
            <div class="ui left icon input">
              <i class="user icon"></i>
              <input type="text" placeholder="氏名" v-model="user.username" />
            </div>
          </div>
          
          <div class="field" v-if="!isLogin && isPatient">
            <div class="ui left icon input">
              <i class="tint icon"></i>
              <input type="text" placeholder="HbA1cの値" v-model="user.hba1c_value" />
            </div>
          </div>
          
          <div class="field" v-if="!isLogin && !isPatient">
            <div class="ui left icon input">
              <i class="tag icon"></i>
              <input type="text" placeholder="専門分野" v-model="user.category" />
            </div>
          </div>
          
          <button class="ui fluid teal huge button" type="submit" :disabled="!isFormValid">
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
      isPatient: true,
      user: {
        user_id: null,
        password: null,
        username: null,
        category: this.isPatient ? null : '',
        hba1c_value: this.isPatient ? null : '', 
      },
      errorMessage: null,
      positiveMessage: null,
    };
  },

  computed: {
    // 計算した結果を変数として利用したいときはここに記述する
    submitText() {
      let text = this.isPatient ? '患者として' : '医師として';
      text += this.isLogin ? 'ログイン' : '新規登録';
      return text;
    },
    toggleText() {
      return this.isLogin ? '新規登録' : 'ログイン';
    },
    isFormValid() {
      if(this.isLogin) {
        return this.user.user_id && this.user.password;
      }
      if(this.isPatient) {
        return this.user.user_id && this.user.password && this.user.username && this.user.hba1c_value;
      }
      return this.user.user_id && this.user.password && this.user.username && this.user.category;
    }
  },

  methods: {
    // Vue.jsで使う関数はここで記述する
    toggleMode() {
      this.isLogin = !this.isLogin
    },
    changeUserType() {
      this.isPatient = !this.isPatient
    },
    
    async submit(){
      this.errorMessage = null;
      this.positiveMessage = null;
      
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      if(this.isLogin) {
        //リクエストボディを指定する
        const requestBody = {
          user_id: this.user.user_id,
          password: this.user.password,
          account_type: this.isPatient ? 'patient' : 'doctor'
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
          window.localStorage.setItem('user_id', this.user.user_id);
          window.localStorage.setItem('account_type', this.isPatient ? 'patient' : 'doctor');
          this.positiveMessage = jsonData.message;
          this.$router.push({ name: this.isPatient ? 'Home-Patient' : 'Home-Doctor' });
          
        } catch (e) {
          this.errorMessage = e.message;
          // エラー時の処理
        } finally {
          this.isLoading = false;
        }
        return
      }
      //新規登録
      // リクエストボディを指定する
      let requestBody;
      
      if (this.isPatient) {
        requestBody = {
          account_type: "patient",
          user_id: this.user.user_id,
          password: this.user.password,
          username: this.user.username,
          hba1c_value: this.user.hba1c_value,
        };
      } else {
        requestBody = {
          account_type: "doctor",
          user_id: this.user.user_id,
          password: this.user.password,
          username: this.user.username,
          category: this.user.category,
        };
      }

      
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
        this.positiveMessage = jsonData.message;
        window.localStorage.setItem('token', jsonData.token);
        window.localStorage.setItem('user_id', this.user.user_id);
        window.localStorage.setItem('account_type', this.isPatient ? 'patient' : 'doctor');
        this.$router.push({ name: this.isPatient ? 'Home-Patient' : 'Home-Doctor' });
          
      } catch (e) {
        this.errorMessage = e.message;
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