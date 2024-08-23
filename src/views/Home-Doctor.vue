<template>
  <div class="ui main container">
    
    <div class="ui active inverted page dimmer" v-if="isLoading">
      <div class="ui text loader">Loading</div>
    </div>
    
  <div class="ui segment">
    <form class="ui form">
      <div class="field">
        <label for="username">患者名：</label>
        <button type="button" class="ui inverted green circular button right floated compact" @click="resetForm()">
          リセット
        </button>
        <input v-model="username" type="text" name="username" placeholder="患者名" class="ui huge fluid input" />
      </div>
  
      <div class="field">
        <label>HbA1c：</label>
        <div class="ui grid">
          <div class="eight wide column">
            <div class="ui fluid action input">
              <input v-model.number="start" type="number" name="HbA1c-start" placeholder="%から" />
              <div class="ui label">から</div>
            </div>
          </div>
          <div class="eight wide column">
            <div class="ui fluid action input">
              <input v-model.number="end" type="number" name="HbA1c-end" placeholder="%まで" />
              <div class="ui label">まで</div>
            </div>
          </div>
        </div>
      </div>
    </form>
  
      <div class="ui green two item menu">
        <button class="ui button item" :class="{ active: desc }" @click="toggleMode()">
          HbA1c 降順で並べ替え
        </button>
        <button class="ui button item" :class="{ active: !desc }" @click="toggleMode()">
          HbA1c 昇順で並べ替え
        </button>
      </div>
      
    </div>
    <ul class="ui centered grid">
      <template v-for="(patient, index) in filteredUsers" :key="index">
        <li class="ui row">
          <router-link :to="`/patient-detail?patientId=${patient.user_id}&username=${patient.username}`">
            <div class="ui card custom-card-width">
              <div class="content">
                <div class="ui three column grid">
                  <div class="column three wide">
                    <img :src="patient.profilePicture || 'https://semantic-ui.com/images/wireframe/square-image.png'" @error="onImageError" class="ui image-size image circular" alt="Profile Picture" />
                  </div>
                  <div class="column eight wide left aligned vertical middle aligned">
                    <h3 class="ui name-text">{{ patient.username }}</h3>
                  </div>
                  <div class="column five wide right aligned vertical middle aligned">
                    <div class="ui green label large">HbA1c: {{ patient.hba1c_value }}%</div>
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
          profilePicture: 'path_to_image2.jpg',
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
    
    onImageError(event) {
      event.target.src = 'https://semantic-ui.com/images/wireframe/square-image.png';
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
   .image-size {
      width: 3.5rem;
      height: 3.5rem; 
   }
  .custom-card-width {
    width: 35rem;
  }
  
  .name-text {
    color: black; 
  }
  
</style>