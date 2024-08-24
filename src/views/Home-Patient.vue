<template>
  <div class="ui main container">
    
    <div class="ui active inverted page dimmer" v-if="isLoading">
      <div class="ui text loader">Loading</div>
    </div>
    
    <div class="ui segment">
        <div class="ui teal three item menu huge">
            <button class="ui button item large" :class="{ active: newArticle.post_type === 1 }" @click="togglePostType(1)">
                <i class="calendar alternate outline icon"></i> 日常登録
            </button>
            <button class="ui button item large" :class="{ active: newArticle.post_type === 2 }" @click="togglePostType(2)">
                <i class="utensils icon"></i> 食事記録
            </button>
            <button class="ui button item large" :class="{ active: newArticle.post_type === 3 }" @click="togglePostType(3)">
                <i class="pills icon"></i> 薬の相性
            </button>
        </div>
        <form class="ui form">
            <div class="ui grid">
                
                <div class="row" v-if="newArticle.post_type === 1">
                    <div class="one wide column right aligned vertical top aligned">
                        <img :src="'https://www.w3schools.com/howto/img_avatar.png'" class="ui image circular" alt="Profile Picture" />
                    </div>
                    <div class="fifteen wide column">
                        <div class="field textarea-container">
                            <textarea rows="4" maxlength="400" placeholder="ここにメモを書いてください" v-model="newArticle.content" />
                            <div class="char-count">{{ charCount }} / 400</div>
                        </div>
                    </div>
                </div>
                
                <div class="row" v-if="newArticle.post_type === 2">
                    <div class="one wide column right aligned vertical middle aligned">
                        <img :src="'https://www.w3schools.com/howto/img_avatar.png'" class="ui image tiny circular" alt="Profile Picture" />
                    </div>
                    <div class="fifteen wide column center aligned vertical bottom aligned">
                        <div v-if="!newArticle.imageSrc">
                            <input type="file" id="fileUpload" style="display: none" @change="handleFileUpload" />
                            <button @click="triggerFileInput" class="ui teal button big">
                                <i class="upload icon"></i>
                                写真をアップロード
                            </button>
                        </div>
                        <div class="center aligned vertical middle aligned image-container" v-if="newArticle.imageSrc">
                            <img :src="newArticle.imageSrc" alt="Preview" class="ui image small" />
                            <button @click="removeImage" class="ui tiny icon lightgrey button circular remove-button">
                                <i class="close icon"></i>
                            </button>
    
                        </div>
                    </div>
                </div>
                
                <div class="row" v-if="newArticle.post_type === 3">
                    <div class="one wide column right aligned vertical top aligned">
                        <img :src="'https://www.w3schools.com/howto/img_avatar.png'" class="ui image circular" alt="Profile Picture" />
                    </div>
                    <div class="fifteen wide column">
                        <div class="ui teal ten item menu">
                            <template v-for="n in 10" :key="n">
                                <button class="ui button item" :class="{ active: newArticle.medicine_score === n }" @click="setMedicine_score(n)">
                                    {{ n }}
                                </button>
                            </template>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="sixteen wide column right aligned">
                        <button class="ui teal medium button circular" type="submit" :disabled="!isFormValid">
                            投稿
                        </button>
                    </div>
                </div>
            </div>
            
        </form>
    </div>
    
    <ul class="ui centered grid">
        
        <template v-for="(article, index) in articles" :key="index">
            <li class="ui row">
                <div class="ui card custom-card-width">
                    <div class="content">
                        <div class="ui two column grid">
                            <div class="two wide column right aligned vertical top aligned">
                                <img :src="'https://www.w3schools.com/howto/img_avatar.png'" class="ui image tiny circular" alt="Profile Picture" />
                            </div>
                            <div class="twelve wide column left aligned vertical middle aligned">
                                <span class="ui large header">{{ username }}&nbsp;&nbsp;</span>
                                <span class="ui small meta">{{ article.created_at }}<br /><br /></span>
                                <p v-if="article.post_type === 'note'">{{ article.content }}</p>
                                <img :src="'https://semantic-ui.com/images/wireframe/square-image.png'" class="ui image-size image rounded" alt="Meal Picture" v-if="article.post_type === 'meal'"/>
                                <p class="ui teal label large" v-if="article.post_type === 'medicine'">薬の相性：{{ article.medicine_score }}</p>
                            </div>
                            <div class="two wide column">
                                  <div class="ui simple dropdown item">
                                    <i class="small ellipsis horizontal icon"></i>
                                    <div class="menu">
                                      <a class="item" @click="editPost(article.created_at)"><i class="edit icon"></i>編集</a>
                                      <a class="item" @click="deletePost(article.created_at)"><i class="ui red trash alternate outline icon"></i><span class="text-red">削除</span></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        </template>
    </ul>
    
  </div>
</template>

<script>
export default {
    name: 'Patient',
    data() {
        return {
            account_type: window.localStorage.getItem('account_type'),
            username: 'Mariana Mie',
            isLoading: false,
            newArticle: {
                post_type: 1,  //１：診察・日常記録、２：薬の相性記録、３：食事記録
                content: '',
                imageSrc: '',
                medicine_score: 5,
            },
            articles: [
                {
                    created_at: '2024年8月24日 20:33',
                    post_type: 'note',
                    content: 'Today was a good day!',
                    medicine_score: '',
                    mealpicture: '',
                },
                {
                    created_at: '2024年8月24日 20:35',
                    post_type: 'meal',
                    content: '',
                    medicine_score: '',
                    mealpicture: '',
                },
                {
                    created_at: '2024年8月24日 20:37',
                    post_type: 'medicine',
                    content: '',
                    medicine_score: '8',
                    mealpicture: '',
                },
            ],
        };
    },
    
    computed: {
        charCount() {
          return this.newArticle.content.length;
        },
        isFormValid() {
            switch (this.newArticle.post_type) {
                case 1:
                    return this.newArticle.content;
                case 2:
                    return this.newArticle.imageSrc;
                case 3:
                    return this.newArticle.medicine_score;
            }
        },
    },
    
    methods: {
        togglePostType(type) {
            this.newArticle.post_type = type;
        },
        triggerFileInput() {
            document.getElementById('fileUpload').click()
        },
        handleFileUpload(event) {
            const file = event.target.files[0]
            if (file) {
                this.newArticle.imageSrc = URL.createObjectURL(file)
          }
        },
        removeImage() {
            this.newArticle.imageSrc = null;
        },
        setMedicine_score(score) {
            this.newArticle.medicine_score = score;
        },
        deletePost(n) {
            const confirmation = confirm('この投稿を削除しますか？');

            if (confirmation) {
            
             }
        },
        editPost(n) {
        
        },
        async deleteUser() {
        
          const confirmed = window.confirm("アカウントを削除してもよろしいですか？");
          if (!confirmed) {
            return;
          }
    
          if (this.isLoading) {
            return;
          }
          this.isLoading = true;
          // headerを指定する
          const headers = { Authorization: "mtiToken" };
    
          try {
            /* global fetch */
            const res = await fetch(`${baseUrl}/user?userId=${this.user.userId}`, {
              method: "DELETE",
              headers,
            });
    
            const text = await res.text();
            const jsonData = text ? JSON.parse(text) : {};
    
            // fetchではネットワークエラー以外のエラーはthrowされないため、明示的にthrowする
            if (!res.ok) {
              const errorMessage =
                jsonData.message ?? "エラーメッセージがありません。";
              throw new Error(errorMessage);
            }
    
            // 成功時の処理
            this.$router.push({ name : 'Login' });
            
          } catch (e) {
            // エラー時の処理
            this.message = e.message;
            this.messageType = 'error';
          } finally {
            this.isLoading = false;
          }
        },
        
        async submit() {
          if (this.isLoading) {
            return;
          }
          this.isLoading = true;
          // headerを指定する
          const headers = { Authorization: "mtiToken" };
          // リクエストボディを指定する
          const requestBody = {
            userId: this.user.userId,
            password: this.user.password,
            nickname: this.user.nickname,
            age: this.user.age
          };
    
          try {
            /* global fetch */
            const res = await fetch(baseUrl + "/user", {
              method: "PUT",
              body: JSON.stringify(requestBody),
              headers,
            });
    
            const text = await res.text();
            const jsonData = text ? JSON.parse(text) : {};
    
            // fetchではネットワークエラー以外のエラーはthrowされないため、明示的にthrowする
            if (!res.ok) {
              const errorMessage =
                jsonData.message ?? "エラーメッセージがありません。";
              throw new Error(errorMessage);
            }
    
            // 成功時の処理
            
          } catch (e) {
            
          } finally {
            this.isLoading = false;
          }
        }
    
    },
  
}
</script>

<style scoped>
    .textarea-container {
        position: relative;
    }
    
    .textarea-container textarea {
        width: 100%;
        resize: none;
    }
    
    .char-count {
        position: absolute;
        bottom: 0.8rem;
        right: 0.8rem;
        color: #888;
        font-size: 0.8rem;
    }
    
    .remove-button {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        z-index: 10;
    }
    
    .image-container {
        position: relative;
        display: inline-block;
    }
    
    .custom-card-width{
        width: 70%;
    }
    .text-red {
        color: red;
    }
</style>
