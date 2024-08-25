<template>
  <div class="user-icon">
    <img :src="userIcon || defaultIcon" class="ui image circular" alt="User Icon" />
    <button class="ui tiny button circular" type="button" @click="triggerIconUpload">
      アイコンを変更
    </button>
    <input type="file" id="iconUpload" style="display: none" @change="handleIconUpload" />
  </div>
</template>

<script>
export default {
  name: 'UserIcon',
  props: {
    initialIcon: {
      type: String,
      default: ''
    },
    defaultIcon: {
      type: String,
      default: 'https://www.w3schools.com/howto/img_avatar.png'
    }
  },
  data() {
    return {
      userIcon: this.initialIcon
    };
  },
  methods: {
    triggerIconUpload() {
      document.getElementById('iconUpload').click();
    },
    handleIconUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.userIcon = URL.createObjectURL(file); // フロントエンドでのみアイコンを変更
        this.$emit('iconUpdated', this.userIcon); // 親コンポーネントに新しいアイコンを通知

        // ここでDynamoDBへの保存処理を将来的に追加
        // 例えば、以下のようなAPIリクエストを行うことが考えられます：
        //
        // fetch('/api/updateUserIcon', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'Authorization': `Bearer ${token}` // 必要に応じてトークンを付加
        //   },
        //   body: JSON.stringify({
        //     userId: this.userId,  // ユーザーIDを使って識別
        //     iconUrl: this.userIcon // アイコンのURLをDynamoDBに保存
        //   })
        // }).then(response => {
        //   if (response.ok) {
        //     console.log('アイコンが保存されました');
        //   } else {
        //     console.error('アイコンの保存に失敗しました');
        //   }
        // }).catch(error => {
        //   console.error('エラーが発生しました:', error);
        // });
      }
    }
  }
}
</script>

<style scoped>
.user-icon {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ui.image.circular {
  width: 100px;
  height: 100px;
}
</style>