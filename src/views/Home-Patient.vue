<template>
    <div class="container" style="border: 1px solid black;margin-top:50px; padding: 10px;">
        <!-- 選択されたラジオボタンのラベルを表示 -->
        <div style="margin-bottom: 10px;">
            <strong v-if="selectedRecord">選択中: {{ selectedRecord }}</strong>
            <strong v-else>未選択</strong> <!-- 未選択時に表示 -->
        </div>
        <div class="textarea-container">
            <div class="ui form">
                <div class="field">
                    <textarea placeholder="ここにメモを書いてください"></textarea>
                </div>
            </div>
        </div>
        <div class="ui form" style="margin-top: 100px;">
            <div class="ui grid" style="text-align: center;">
                 <div class="inline fields">
                    <div class="field">
                        <div class="ui radio checkbox">
                            <input type="radio" name="record" value="食事記録" v-model="selectedRecord">
                            <label>食事記録</label>
                        </div>
                    </div>
                    <div class="field">
                        <label class="ui button" for="file-upload">参照</label>
                        <input type="file" id="file-upload" style="display: none;">
                    </div>
                </div>
                <div class="inline fields">
                    <div class="field">
                        <div class="ui radio checkbox">
                            <input type="radio" name="record" value="診察・日常記録" v-model="selectedRecord">
                            <label>診察・日常記録</label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="ui grid">
                <div class="inline fields">
                    <div class="field">
                        <div class="ui radio checkbox" style="margin-right:5px;">
                            <input type="radio" name="record" value="薬の相性" v-model="selectedRecord">
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
export default {
    name: 'Patient',
    data() {
        return {
            selectedRecord: '',  // 初期値を空に設定して未選択状態にする
            users: [
                {username: '1', create_at: 1, content: 'text'},
                {username: '2', create_at: 2, conte　nt: 'text'},
                {username: '3', create_at: 3, content: 'text'},
            ],
        };
    },
}
</script>

<style scoped>
    .container {
        border: 1px solid black;
        padding: 10px;
    }
    label {
        writing-mode: horizontal-tb;
        display: inline-block;
    }
</style>
