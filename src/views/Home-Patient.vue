<template>
  <div>
    <div class="ui main container">
      <!-- 基本的なコンテンツはここに記載する -->  　
      　　<ul class="ui three column grid">
           <li class="column">
             <div class="ui card fluid">
               <div class="content">
                 <h2 class="header">
                  nickname
                  <span class="ui green label">22</span>
                 </h2>
                 <span class="meta">userId</span>
               </div>
             </div>
           </li>
          </ul>
    </div>
  </div>
</template>

<script>
// 必要なものはここでインポートする
// @は/srcの同じ意味です
// import something from '@/components/something.vue';

export default {
  name: 'Template',

  components: {
    // 読み込んだコンポーネント名をここに記述する
  },

  data() {
    // Vue.jsで使う変数はここに記述する
    return {
    };
  },

  computed: {
    // 計算した結果を変数として利用したいときはここに記述する
  },

  methods: {
    // Vue.jsで使う関数はここで記述する
  },
}
</script>

<style scoped>
/* このコンポーネントだけに適用するCSSはここに記述する */
</style>
