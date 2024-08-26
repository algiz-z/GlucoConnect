<template>
  <div class="ui container">
    <Filter
      style="margin-top:6rem;"
      :username="filter.username"
      :start="filter.start"
      :end="filter.end"
      @filterChange="applyFilters"
    />
    <div style="margin-top:2rem;"></div>
    <div class="ui link cards centered">
      <div 
        class="card"
        v-for="patient in filteredUsers" 
        :key="patient.user_id" 
        @click="selectPatient(patient.user_id)"
        style="cursor: pointer;"
      >
        <div class="content">
          <div class="header">{{ patient.username }}</div>
          <div class="meta">ユーザーID: {{ patient.user_id }}</div>
          <div class="description">
            <p>HbA1c: <strong>{{ patient.hba1c_value }}</strong></p>
          </div>
        </div>
        <div class="extra content">
          <span class="right floated">
            詳細を見る
            <i class="right arrow icon"></i>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { baseUrl } from "@/assets/config.js";
import Filter from '@/components/doctor/Filter.vue';

export default {
  data() {
    return {
      patients: [], // Dados dos pacientes
      filter: {
        username: '',
        start: null,
        end: null,
      }
    };
  },
  components: {
    Filter,
  },
  methods: {
    async fetchPatients() {
      try {
        const response = await fetch(`${baseUrl}/users`, {
          headers: {
            Authorization: 'mtitoken', // 認証トークンを追加
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.patients = data.patients; // レスポンスの patients 配列を格納
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    },
    selectPatient(userId) {
      // 患者の詳細ページに遷移
      this.$router.push({ name: 'PatientDetail', params: { id: userId } });
    },
    applyFilters(filterData) {
      this.filter = filterData;
    }
  },
  mounted() {
    this.fetchPatients();
  },
  computed: {
  filteredUsers() {
    return this.patients
      .filter(e => {
        const matchUsername = this.filter.username
          ? e.username?.includes(this.filter.username)
          : true;
        const withinHb = (
          (this.filter.start ? e.hba1c_value >= this.filter.start : true) &&
          (this.filter.end ? e.hba1c_value <= this.filter.end : true)
        );
        return matchUsername && withinHb;
      })
    }
  },

};
</script>