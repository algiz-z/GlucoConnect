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
              <input type="text" placeholder="User ID" v-model="user.user_id" />
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
  </div>
</template>

<script>
import { baseUrl } from "@/assets/config.js";

export default {
  name: "Template",

  data() {
    return {
      isPatient: window.localStorage.getItem('account_type') === 'patient',
      isLoading: false,
      user: {
        user_id: null,
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
  },
};
</script>

<style scoped></style>
