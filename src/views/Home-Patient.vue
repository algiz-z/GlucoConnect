<template>
    <div class="container" style="border: 1px solid black;margin-top:50px; padding: 10px;">
        <div class="textarea-container">
            <div class="ui form">
                <div class="field">
                    <textarea placeholder="ここにメモを書いてください"></textarea>
                </div>
            </div>
        </div>
        <div class="ui form" style="margin-top: 100px;margin-left;50xpx;">
            <div class="ui grid" style=" text-align: center;">
                 <div class="inline fields">
                    <div class="field">
                        <div class="ui radio checkbox" style="margin-left: 500px;">
                            <input type="radio" name="record" value="meal">
                            <label>食事記録</label>
                        </div>
                    </div>
                    <div class="reference">参照</div>
                </div>
                <div class="inline fields">
                    <div class="field">
                        <div class="ui radio checkbox">
                            <input type="radio" name="record" value="diagnosis">
                            <label>診察・日常記録</label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="ui grid">
                <div class="inline fields">
                    <div class="field">
                        <div class="ui radio checkbox" style="margin-left: 500px;margin-right:5px;">
                            <input type="radio" name="record" value="medicine">
                            <label>薬の相性</label>
                        </div>
                    </div>
                    <select class="ui dropdown" style="width: 60px;">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5" selected>5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>
                </div>
                <div class="submit-btn">
                    <button class="ui button green" type="submit">投稿</button>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
// 必要なものはここでインポートする
// @は/srcの同じ意味です
// import something from '@/components/something.vue';

export default {
    name: 'Patient',
    
    components: {
      // 読み込んだコンポーネント名をここに記述する
    },
    
    data() {
      // Vue.jsで使う変数はここに記述する
      return {
       users:[
        {username: '1',create_at: 1,content:'text'},
        {username: '2',create_at: 2,content:'text'},
        {username: '3',create_at: 3,content:'text'},
       ],
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
    .container{
        border: 1px solid black;
        padding: 10px;
    }
    label{
        writing-mode: horizontal-tb;
        display: inline-block;
    }
</style>
  