<template>
  <div class="ui main container">
    
    <div class="ui active inverted page dimmer" v-if="isLoading">
      <div class="ui text loader">Loading</div>
    </div>
    
    <div class="ui segment">
      <form class="ui form">
        <div class="ui grid">
          <div class="row">    
            <div class="one wide column center aligned vertical middle aligned">
              <label>氏名：</label>
            </div>
            <div class="fourteen wide column">
              <input v-model="username" type="text" name="username" placeholder="患者名" class="ui huge fluid input" />
            </div>
          </div>
    
          <div class="row">
            <div class="one wide column center aligned vertical middle aligned">
              <label>HbA1c：</label>
            </div>
            <div class="seven wide column">
              <div class="ui action input">
                <input v-model.number="start" type="number" name="HbA1c-start" placeholder="%から" />
                <span>から</span>
              </div>
            </div>
            <div class="seven wide column">
              <div class="ui action input">
                <input v-model.number="end" type="number" name="HbA1c-end" placeholder="%まで" />
                <div class="ui">まで</div>
              </div>
            </div>
          </div>
          
          <div class="row">
            <div class="one wide column"></div>
            <div class="thirteen wide column">
              <div class="ui teal two item menu">
                <button class="ui button item" :class="{ active: desc }" @click="toggleMode()">
                  HbA1c 降順で並べ替え
                </button>
                <button class="ui button item" :class="{ active: !desc }" @click="toggleMode()">
                  HbA1c 昇順で並べ替え
                </button>
              </div>
            </div>
            <div class="two wide column">
              <button type="button" class="ui teal circular button" @click="resetForm()">
                リセット
              </button>
            </div>
          </div>
              
        </div>
      </form>
    </div>
    <ul class="ui centered grid">
      <template v-for="(patient, index) in filteredUsers" :key="index">
        <li class="ui row">
          <router-link :to="`/patient-detail?patientId=${patient.user_id}&username=${patient.username}`">
            <div class="ui card custom-card-width">
              <div class="content">
                <div class="ui three column grid">
                  <div class="column three wide">
                    <img :src="'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png'" class="ui image-size image circular" alt="Profile Picture" />
                  </div>
                  <div class="column eight wide left aligned vertical middle aligned">
                    <h3 class="ui name-text">{{ patient.username }}</h3>
                  </div>
                  <div class="column five wide right aligned vertical middle aligned">
                    <div class="ui teal label large">HbA1c: {{ patient.hba1c_value }}%</div>
                  </div>
                </div>
              </div>
            </div>
          </router-link>
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
      desc: false,
      username: "",
      start: 0,
      end: 10,
      patients: [
        {
          user_id: 1,
          username: 'Mie Takaoka',
          profilePicture: '',
          hba1c_value: 5.6,
        },
        {
          user_id: 2,
          username: 'Mariana Okazaki',
          profilePicture: '',
          hba1c_value: 7.1,
        },
      ],
    };
  },

  computed: {
    filteredUsers() {
      return this.patients.filter(e => {
        const matchUsername = this.username ? e.username?.match(this.username) : true;
        const withinHb = (
          (this.start ? e.hba1c_value >= this.start : true) &&(this.end ? e.hba1c_value <= this.end : true)
        ); 
        return matchUsername && withinHb;
      });
    }
  },

  methods: {
    async getRequestTemplate() {
      // headerを指定する
      const headers = { Authorization: "mtiToken" };

      try {
        /* global fetch */
        const res = await fetch(baseUrl + "/test", {
          method: "GET",
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
    toggleMode() {
      this.desc = !this.desc;
      this.patients.sort((a, b) => {
        if (this.desc) {
          return b.hba1c_value - a.hba1c_value;
        } else {
          return a.hba1c_value - b.hba1c_value;
        }
      });
    },
    
    resetForm() {
      this.username = "";
      this.start = 0;
      this.end = 10;
    },
  },
  
  mounted() {
    this.toggleMode();
  }
};
</script>

<style scoped>
  .custom-card-width {
    width: 35rem;
  }
  @media (max-width: 800) {
    
  }
  .name-text {
    color: black; 
  }
  
</style>