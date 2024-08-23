<template>
  <div class="ui main container">
    
    <div class="ui grid">
      <div class="ui row">
        <div class="column">
          <div class="ui green circular button" @click="goBack">
            <i class="arrow left icon"></i>
          </div>
        </div>
        <div class="column">
          <div class="ui huge label nowrap">
            {{ username }}
          </div>
        </div>
      </div>
    </div>
    
    <div class="ui green pointing secondary compact menu right floated">
      <button class="ui button item" :class="{ active: mode === 1 }" @click="changeMode(1)">
        日常
      </button>
      <button class="ui button item" :class="{ active: mode === 2 }" @click="changeMode(2)">
        食事
      </button>
      <button class="ui button item" :class="{ active: mode === 3 }" @click="changeMode(3)">
        運動
      </button>
      <button class="ui button item" :class="{ active: mode === 4 }" @click="changeMode(4)">
        HbA1c
      </button>
    </div>
    
    <div class="ui secondary menu right">
      <div class="right menu">
        
        <button class="ui inverted green button circular" @click="goToCurrentMonth" v-if="selectedMonth !== currentMonth">
          今月
        </button>
        
        <button class="ui button item" @click="prevMonth">
          <i class="chevron left icon"></i>
        </button>
        
        <div class="item">
            {{ selectedMonth }}月 {{ selectedYear }}年
        </div>
        
        <button class="ui button item" @click="nextMonth">
          <i class="chevron right icon"></i>
        </button>
      </div>
    </div>

    <div class="field padding-top" v-if="mode !== 4">
      
      <table class="ui celled table">
        <thead>
          <tr>
            <th v-for="day in daysOfWeek" :key="day" class="center aligned">{{ day }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(week, weekIndex) in calendar" :key="weekIndex">
            <td v-for="day in week" :key="day.date">
                <div class="ui green circular">{{ day.date }}</div>
                <span>Today was a good day!</span>
            </td>
          </tr>
        </tbody>
      </table>
      
    </div>
    
    <div class="field" v-if="mode === 4">
      grafico
    </div>
    
  </div>
</template>


<script>
import { baseUrl } from "@/assets/config.js";
import { Line } from 'vue-chartjs';
import { Chart as ChartJS } from 'chart.js';

export default {
  name: "Patient-Detail",

  data() {
    return {
      mode: 1, // 1: 日常  2: 食事  3: 運動  4: HbA1c
      currentMonth: new Date().getMonth() + 1,
      selectedMonth: new Date().getMonth() + 1,
      selectedYear: new Date().getFullYear(), 
      days: Array.from({ length: 30 }, (_, index) => ({
        date: index + 1,
        image: `https://via.placeholder.com/100?text=Day+${index + 1}`
      })),
      posts: [
        {
          user_id: 1,
          created_at: '1724137171863',
          profilePicture: '',
          hba1c_value: 5.6,
        },
      ],
    };
  },

  computed: {
    daysOfWeek() {
      return ['日', '月', '火', '水', '木', '金', '土'];
    },

    calendar() {
      const weeks = [];
      const days = this.days;

      for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
      }

      return weeks;
    },
    username() {
      return this.$route.query.username;
    },
  },
  
  methods: {
    goBack() {
      this.$router.push({ name: 'Home-Doctor' });
    },
    
    changeMode(newMode) {
      this.mode = newMode;
    },

    async getRequestTemplate() {
      const headers = { Authorization: "mtiToken" };

      try {
        const res = await fetch(baseUrl + "/test", {
          method: "GET",
          headers,
        });

        const text = await res.text();
        const jsonData = text ? JSON.parse(text) : {};

        if (!res.ok) {
          const errorMessage = jsonData.message ?? "エラーメッセージがありません";
          throw new Error(errorMessage);
        }

        console.log(jsonData);
      } catch (e) {
        console.error(e);
      }
    },

    goToCurrentMonth() {
      this.selectedMonth = this.currentMonth;
      this.updateDays();
    },

    prevMonth() {
        if(this.selectedMonth === 1) {
            this.selectedYear -= 1;
            this.selectedMonth = 12;
            return;
        }
      this.selectedMonth -= 1;
      this.updateDays();
    },

    nextMonth() {
        if(this.selectedMonth === 12) {
            this.selectedYear += 1;
            this.selectedMonth = 1;
            return;
        }
        this.selectedMonth += 1;
        this.updateDays();
    },
    
    updateDays() {
      const daysInMonth = new Date(this.selectedYear, this.selectedMonth, 0).getDate();
      const firstDay = new Date(this.selectedYear, this.selectedMonth - 1, 1).getDay();
      
      this.days = Array.from({ length: daysInMonth }, (_, index) => ({
        date: index + 1,
        image: `https://via.placeholder.com/100?text=Day+${index + 1}`
      }));
      

      // Add empty days for the first week
      for (let i = 0; i < firstDay; i++) {
        this.days.unshift({ date: null });
      }
      
      // Fill remaining days for calendar alignment
      const totalDays = this.days.length;
      const extraDays = (Math.ceil(totalDays / 7) * 7) - totalDays;
      for (let i = 0; i < extraDays; i++) {
        this.days.push({ date: null });
      }
    },
  },
  mounted() {
    this.updateDays();
  }
};
</script>

<style scoped>
.table {
  width: 100%;
  border-collapse: collapse;
}

.ui.celled.table td {
  text-align: center;
  vertical-align: middle;
}

.padding-top {
  padding-top: 1rem;
}
</style>