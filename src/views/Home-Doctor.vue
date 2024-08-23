<template>
  <div class="ui main container">
    <div class="card">
        <img src="https://via.placeholder.com/100" alt="Imagem de Perfil" class="profile-img">
        <div class="card-content">
            <h2>Nome do Usuário</h2>
            <p>Idade: 25</p>
        </div>
    </div>
  </div>
</template>

<script>
import { baseUrl } from "@/assets/config.js";

export default {
  name: "Template",

  data() {
    return {};
  },

  computed: {},

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
  },
};
</script>

<style scoped></style>
