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
        
        <form class="ui large form bottom attached segment" @submit.prevent="submit">
          
          <div class="field">
            <div class="ui left icon input">
              <i class="id card icon"></i>
              <input type="text" placeholder="User ID" v-model="user.user_id" required disabled />
            </div>
          </div>
          
          <div class="field">
            <div class="ui left icon input">
              <i class="lock icon"></i>
              <input type="password" placeholder="Password" v-model="user.password" />
            </div>
          </div>
          
          <div class="field">
            <div class="ui left icon input">
              <i class="user icon"></i>
              <input type="text" placeholder="氏名" v-model="user.username" />
            </div>
          </div>
          
          <div class="field" v-if="isPatient">
            <div class="ui left icon input">
              <i class="tint icon"></i>
              <input type="text" placeholder="最新HbA1cの値" v-model="user.hba1c_value" />
            </div>
          </div>
          
          <div class="field" v-if="!isPatient">
            <div class="ui left icon input">
              <i class="tag icon"></i>
              <input type="text" placeholder="専門分野" v-model="user.category" />
            </div>
          </div>
          
          <button class="ui fluid teal huge button" type="submit" :disabled="!isFormValid">
            更新
          </button>
        </form>
      </div>
    </div>
    <!-- Delete Account Section -->
    <div class="ui grid">
      <div class="ui centered row">
        <a href="#" class="ui red basic button" @click.prevent="confirmDelete">
          アカウント削除
        </a>
      </div>
    </div>
    
    <!-- Confirm Delete Modal -->
    <div class="ui modal" ref="deleteModal">
      <i class="close icon"></i>
      <div class="header">アカウント削除の確認</div>
      <div class="content">
        <p>アカウントを削除しますか？削除は元に戻せません。</p>
      </div>
      <div class="actions">
        <div class="ui button" @click="closeDeleteModal">キャンセル</div>
        <div class="ui negative button" @click="deleteAccount">削除</div>
      </div>
    </div>
  </div>
</template>

<script>
import { baseUrl } from "@/assets/config.js";

export default {
  name: "Template",

  data() {
    return {
      isPatient: window.localStorage.getItem('account_type') === 'patient',
      account_type: window.localStorage.getItem('account_type'),
      isLoading: false,
      user: {
        user_id: window.localStorage.getItem('user_id'),
        password: null,
        username: null,
        category: null,
        hba1c_value: null,
      },
      hba1c_values: {
        recorded_at: null,
        hba1c_value: null,
      }
    };
  },

  computed: {},

  methods: {
    async postRequestTemplate() {
      // headerを指定する
      const headers = { Authorization: "mtiToken" };
      // リクエストボディを指定する
      const requestBody = {
        value1: "value1",
        value2: "value2",
      };

      try {
        /* global fetch */
        const res = await fetch(baseUrl + "/test", {
          method: "POST",
          body: JSON.stringify(requestBody),
          headers,
        });

        const text = await res.text();
        const jsonData = text ? JSON.parse(text) : {};

        // fetchではネットワークエラー以外のエラーはthrowされないため、明示的にthrowする
        if (!res.ok) {
          const errorMessage =
            jsonData.message ?? "エラーメッセージがありません";
          throw new Error(errorMessage);
        }

        // 成功時の処理
        console.log(jsonData);
      } catch (e) {
        console.error(e);
        // エラー時の処理
      }
    },
    confirmDelete() {
      $(this.$refs.deleteModal).modal('show');
    },
    closeDeleteModal() {
      $(this.$refs.deleteModal).modal('hide');
    },
    async deleteAccount() {
      this.isLoading = true;
      try {
        const response = await fetch(`${baseUrl}/user?user_id=${this.user.user_id}&account_type=${this.account_type}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'mtitoken'
          },
          body: JSON.stringify({ user_id: this.user.user_id })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // 成功の時の処理
        this.positiveMessage = 'アカウントが削除されました。';
        this.$router.push({ name : 'Login' });

      } catch (error) {
        this.errorMessage = `エラーが発生しました: ${error.message}`;
      } finally {
        this.isLoading = false;
        this.closeDeleteModal();
      }
    },
  },
};
</script>

<style scoped>
  
</style>
