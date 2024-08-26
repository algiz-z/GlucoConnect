<template>
  <div class="ui container">
    <div style="margin-top:100px;"></div>
    <div class="ui link cards centered">
      <div 
        class="card"
        v-for="patient in patients" 
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

export default {
  data() {
    return {
      patients: [], // 患者データを格納
    };
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
  },
  mounted() {
    this.fetchPatients();
  },
};
</script>