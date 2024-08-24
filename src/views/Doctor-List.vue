<template>
  <div class="ui main container">
    
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
      <form class="ui form">
            <div class="ui left icon input">
              <i class="id card icon"></i>
              <input type="text" placeholder="User ID" v-model="doctor_user_id" />
            </div>
          &nbsp;
          <button class="ui teal button" type="submit" :disabled="!isFormValid">
            フォロー
          </button>
          
      </form>
      
    </div>
    <ul class="ui centered grid">
      <template v-for="(doctor, index) in doctors" :key="index">
        <li class="ui row">
          <div class="ui card custom-card-width">
            <div class="content">
              <div class="ui three column grid">
                <div class="column three wide">
                  <img :src="'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png'" class="ui image-size image circular" alt="Profile Picture" />
                </div>
                <div class="column eight wide left aligned vertical middle aligned">
                  <h3 class="ui name-text">{{ doctor.username }}</h3>
                </div>
                <div class="column five wide right aligned vertical middle aligned">
                  <div class="ui teal label large">{{ doctor.category }}</div>
                </div>
              </div>
            </div>
          </div>
        </li>
      </template>
    </ul>
    
  </div>
</template>

<script>
import { baseUrl } from "@/assets/config.js";

export default {
  name: "Template",

  data() {
    return {
      doctor_user_id: "",
      doctors: [
        {
          user_id: 1,
          username: 'Psicólogo',
          profilePicture: '',
          category: '心理学者',
        },
        {
          user_id: 2,
          username: 'Clínico Geral',
          profilePicture: '',
          category: '内科',
        },
      ],
    };
  },

  computed: {
  
  isFormValid() {
    return this.doctor_user_id;
  }
  
  },

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

<style scoped>
  .custom-card-width {
    width: 40%;
  }
</style>
