<template>
  <div class="ui main container">
    <div class="ui three column grid">
      
      <!-- Header Section -->
      <div class="row">    
        <div class="column one wide left aligned ">
          <div class="ui teal circular button" @click="goBack">
            <i class="arrow left icon"></i>
          </div>
        </div>
        
        <div class="column four wide left aligned vertical middle aligned">
          <div class="ui large header">
              {{ patient.username }}
          </div>
        </div>
        
        <div class="column eleven wide right aligned">
          <div class="ui teal pointing secondary compact menu">
            <button class="ui button item" :class="{ active: mode === 1 }" @click="changeMode(1)">
              日常
            </button>
            <button class="ui button item" :class="{ active: mode === 2 }" @click="changeMode(2)">
              食事
            </button>
            <button class="ui button item" :class="{ active: mode === 3 }" @click="changeMode(3)">
              薬の相性
            </button>
          </div>
        </div>
      </div>
      
      <!-- Month Navigation -->
      <div class="row">
        <div class="column sixteen wide right aligned ">
          <div class="ui secondary compact menu">
            <button class="ui inverted teal button circular" @click="goToCurrentMonth" v-if="selectedMonth !== currentMonth">
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
      </div>
    </div>

    <!-- Calendar View -->
    <CalendarView 
      :posts="filteredPosts" 
      :calendar="calendar" 
      :daysOfWeek="daysOfWeek"
      @postClicked="handlePostClick"
    />

    <!-- Graph Section (for mode 4) -->
    <div class="field" v-if="mode === 4">
      グラフ表示
    </div>
  </div>
</template>

<script>
import CalendarView from '@/components/CalendarView.vue';
import { baseUrl } from "@/assets/config.js";

export default {
  components: {
    CalendarView,
  },
  data() {
    return {
      patient: {},
      patientPosts: [],
      mode: 1,
      selectedMonth: new Date().getMonth() + 1,
      selectedYear: new Date().getFullYear(),
      daysOfWeek: ["日", "月", "火", "水", "木", "金", "土"],
      calendar: [],
      currentMonth: new Date().getMonth() + 1,
    };
  },
  computed: {
    filteredPosts() {
      return this.patientPosts.filter(post => {
        if (this.mode === 1 && post.post_type === "note") return true;
        if (this.mode === 2 && post.post_type === "meal") return true;
        if (this.mode === 3 && post.post_type === "medicine") return true;
        return false;
      });
    },
  },
  methods: {
    async fetchPatientDetails() {
      try {
        const patientId = this.$route.params.id;
        const articlesResponse = await fetch(`${baseUrl}/articles?userId=${patientId}`, {
          headers: {
            Authorization: 'mtitoken',
          },
        });
        if (!articlesResponse.ok) {
          throw new Error(`HTTP error! status: ${articlesResponse.status}`);
        }
        const articlesData = await articlesResponse.json();
        this.patientPosts = articlesData.articles || [];

        if (this.patientPosts.length > 0) {
          this.patient = { username: this.patientPosts[0].user_id };
        }

        this.generateCalendar();
      } catch (error) {
        console.error("Error fetching patient details or posts:", error);
      }
    },
    generateCalendar() {
      // ダミーデータでサンプル生成
      this.calendar = [
        [{ date: 1 }, { date: 2 }, { date: 3 }, { date: 4 }, { date: 5 }, { date: 6 }, { date: 7 }],
        [{ date: 8 }, { date: 9 }, { date: 10 }, { date: 11 }, { date: 12 }, { date: 13 }, { date: 14 }],
      ];
    },
    changeMode(mode) {
      this.mode = mode;
    },
    goBack() {
      this.$router.back();
    },
    goToCurrentMonth() {
      this.selectedMonth = this.currentMonth;
    },
    prevMonth() {
      if (this.selectedMonth > 1) {
        this.selectedMonth--;
      } else {
        this.selectedMonth = 12;
        this.selectedYear--;
      }
      this.generateCalendar();
    },
    nextMonth() {
      if (this.selectedMonth < 12) {
        this.selectedMonth++;
      } else {
        this.selectedMonth = 1;
        this.selectedYear++;
      }
      this.generateCalendar();
    },
    handlePostClick(post) {
      console.log("Post clicked:", post);
      // 追加のアクションがあればここに実装
    }
  },
  mounted() {
    this.fetchPatientDetails();
  },
};
</script>