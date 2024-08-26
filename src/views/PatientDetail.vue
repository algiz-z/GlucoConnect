<template>
  <div class="ui main container">
    <div class="ui three column grid">
      
      <!-- Header Section -->
      <div class="row" style="margin-top: 1rem;">    
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
            <button class="ui button item" :class="{ active: mode === 4 }" @click="changeMode(4)">
              HbA1c
            </button>
          </div>
        </div>
      </div>
      
      <!-- Month Navigation -->
      <div class="row" v-if="mode !== 4" >
        <div class="column sixteen wide right aligned ">
          <div class="ui secondary compact menu">
            <button class="ui teal button circular" @click="goToCurrentMonth" v-if="selectedMonth !== currentMonth|| selectedYear !== currentYear">
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
      @postClicked="openPostModal"
      v-if="mode !== 4" 
    />
    <LineChart :chart-data="data" :options="options" style="margin-top:2rem;" v-if="mode === 4" />
    <!-- Post Details Modal -->
    <div class="ui modal" ref="postModal">
      <i class="close icon"></i>
      <div class="header">{{ modalDate }} の投稿詳細</div>
      <div class="content">
        <PostList :posts="modalPosts" />
      </div>
      <div class="actions">
        <div class="ui approve button">OK</div>
      </div>
    </div>
  </div>
</template>

<script>
import CalendarView from '@/components/CalendarView.vue';
import PostList from '@/components/PostList.vue';
import { baseUrl } from "@/assets/config.js";
import LineChart from '@/components/doctor/LineChart.vue'; 

export default {
  components: {
    CalendarView,
    PostList,
    LineChart,
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
      currentYear: new Date().getFullYear(),
      modalPosts: [],
      modalDate: null,
      data: {
        labels: ['2023年8月20日', '2023年9月18日', '2023年10月20日', '2023年11月25日', '2023年12月20日', '2024年1月23日', '2024年2月20日', '2024年3月15日', '2024年4月27日', '2024年8月22日'],
        datasets: [
          {
            label: 'HbA1c',
            backgroundColor: 'rgba(0, 128, 128, 0.2)',
            borderColor: 'rgba(0, 128, 128, 1)',
            pointBackgroundColor: 'rgba(0, 128, 128, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(0, 128, 128, 1)',
            data: [5.6, 6.1, 5.8, 6.3, 5.9, 6.0, 6.2, 6.4, 5.7, 6.0]
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 0,
            max: 10,
            title: {
              display: true,
              text: 'HbA1c (%)'
            }
          },
          x: {
            title: {
              display: true,
              text: '日付' // "Data" em japonês
            },

          }
        }
      },
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
        console.log(this.patientPosts);

        if (this.patientPosts.length > 0) {
          this.patient = { username: this.patientPosts[0].user_id };
        }

        this.generateCalendar();
      } catch (error) {
        console.error("Error fetching patient details or posts:", error);
      }
    },
    generateCalendar() {
      const daysInMonth = new Date(this.selectedYear, this.selectedMonth, 0).getDate();
      const firstDayOfMonth = new Date(this.selectedYear, this.selectedMonth - 1, 1).getDay();

      let calendar = [];
      let week = [];

      for (let i = 0; i < firstDayOfMonth; i++) {
        week.push({ date: null });
      }

      for (let day = 1; day <= daysInMonth; day++) {
        week.push({ date: day });

        if (week.length === 7) {
          calendar.push(week);
          week = [];
        }
      }

      if (week.length > 0) {
        while (week.length < 7) {
          week.push({ date: null });
        }
        calendar.push(week);
      }

      this.calendar = calendar;
    },
    changeMode(mode) {
      this.mode = mode;
    },
    goBack() {
      this.$router.back();
    },
    goToCurrentMonth() {
      this.selectedMonth = this.currentMonth;
      this.selectedYear = this.currentYear;
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
    openPostModal(date) {
      this.modalDate = date;
      this.modalPosts = this.filteredPosts.filter(post => {
        const postDate = new Date(post.created_at).getDate();
        return postDate === date;
      });
      $(this.$refs.postModal).modal('show');
    }
  },
  mounted() {
    this.fetchPatientDetails();
  },
};
</script>