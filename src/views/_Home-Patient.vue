<template>
  <div class="ui main container">
    
    <div class="ui active inverted page dimmer" v-if="isLoading">
      <div class="ui text loader">Loading</div>
    </div>
    
    <div class="ui segment">
        <div class="ui teal three item menu huge stackable">
            <button class="ui button item large" :class="{ active: newArticle.post_type === 1 }" @click="togglePostType(1)">
                <i class="calendar alternate outline icon"></i> 診察・日常記録
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
                
                <div class="row">
                    <div class="sixteen wide column right aligned">
                        <button class="ui teal medium button circular" type="button" @click="triggerFileInput">
                            <i class="upload icon"></i> 写真をアップロード
                        </button>
                        <input type="file" id="fileUpload" style="display: none" @change="handleFileUpload" />
                    </div>
                </div>
                
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
                
                <div class="row" v-if="newArticle.imageSrc">
                    <div class="sixteen wide column center aligned">
                        <div class="center aligned vertical middle aligned image-container">
                            <img :src="newArticle.imageSrc" alt="Preview" class="ui image small" />
                            <button @click="removeImage" class="ui tiny icon lightgrey button circular remove-button">
                                <i class="close icon"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="sixteen wide column right aligned">
                        <button class="ui teal medium button circular" type="submit" :disabled="!isFormValid" @click="submitArticle">
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
                        <div class="two wide column right aligned vertical top aligned">
                            <div class="ui dropdown">
                                <i class="ellipsis vertical icon" @click="toggleDropdown(index)"></i>
                                <div class="menu" v-if="dropdownVisible[index]">
                                    <div class="item" @click="editPost(index)">編集</div>
                                    <div class="item" @click="confirmDelete(index)">削除</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
        </li>
      </template>
    </ul>
    
    <!-- 削除確認モーダル -->
    <div class="ui modal" v-if="deleteIndex !== null">
      <div class="header">投稿を削除</div>
      <div class="content">
        <p>この投稿を削除してもよろしいですか？</p>
      </div>
      <div class="actions">
        <button class="ui red button" @click="deletePost(deleteIndex)">削除</button>
        <button class="ui button" @click="deleteIndex = null">キャンセル</button>
      </div>
    </div>

    <!-- 編集モード -->
    <div v-if="isEditing" class="ui segment">
        <h3>投稿を編集</h3>
        <form class="ui form">
            <div class="field">
                <textarea v-model="editContent" rows="4"></textarea>
            </div>
            <button class="ui button teal" @click="saveEdit">保存</button>
            <button class="ui button" @click="isEditing = false">キャンセル</button>
        </form>
    </div>
    
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
            isEditing: false,
            editContent: '',
            editIndex: null,
            deleteIndex: null,
            dropdownVisible: [], // ドロップダウンの表示状態を管理する配列
            newArticle: {
                post_type: 1,  
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
        toggleDropdown(index) {
            this.$set(this.dropdownVisible, index, !this.dropdownVisible[index]);
        },
        editPost(index) {
            this.isEditing = true;
            this.editIndex = index;
            this.edit