<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">

          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="getImage" class="user-img" />
            <h4>{{ getUsername }}</h4>
            <p>{{ getBio }}</p>
            <button class="btn btn-sm btn-outline-secondary action-btn">
              <i class="ion-plus-round"></i>
              &nbsp;
              Follow {{ getUsername }} 
            </button>
          </div>

        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <a @click="loadUserArticles" :class="isUserArticlesFeed ? 'active' : undefined" class="cursor-pointer nav-link">My Articles</a>
              </li>
              <li class="nav-item">
                <a @click="loadFavoritedArticles" :class="isFavoritedArticlesFeed ? 'active' : undefined" class="cursor-pointer nav-link">Favorited Articles</a>
              </li>
            </ul>
          </div>

          <ArticleList :articles="currentArticles" />
          
        </div>

      </div>
    </div>

  </div>  
</template>

<script lang="ts">
import Vue from "vue";
import ArticleList from "@/components/articles/ArticleList.vue";
import { Context } from "@nuxt/types";
import { GET_USER_PROFILE } from "@/store/users";
import { mapGetters } from "vuex";
import { isNullOrUndefined } from "@/utils";
import { Maybe } from "@/models/shared.types";
import { LOAD_ARTICLES_BY_USER, LOAD_FAVORITED_ARTICLES } from "@/store/articles";
import { ArticleFeed } from "~/models/article.types";

export default Vue.extend({
  components: {
    ArticleList
  },
  asyncData: (context: Context) => {
    let parsedUsername = "";

    // Grab the username from the path route
    const tokenizedPath = context.route.path.split("/");
    
    if (tokenizedPath.length > 0) {
      parsedUsername = tokenizedPath[tokenizedPath.length - 1];
    }

    return {
      username: parsedUsername
    };
  },
  created() {
      this.$accessor.users[GET_USER_PROFILE](this.$data.username);
      this.$accessor.articles[LOAD_ARTICLES_BY_USER](this.$data.username);
  },
  computed: {
    ...mapGetters("users", ["currentUserProfile"]),
    ...mapGetters("articles", ["currentArticles", "currentFeed"]),
    getUsername(): Maybe<string> {
      return this.currentUserProfile?.username;
    },
    getImage(): Maybe<string> {
      return this.currentUserProfile?.image;
    },
    getBio(): Maybe<string> {
      return this.currentUserProfile?.bio;
    },
    isUserArticlesFeed(): boolean {
      return this.currentFeed === ArticleFeed.User;
    },
    isFavoritedArticlesFeed(): boolean {
      return this.currentFeed === ArticleFeed.Favorited;
    }
  },
  methods: {
    loadUserArticles() {
      this.$accessor.articles[LOAD_ARTICLES_BY_USER](this.$data.username);
    },
    loadFavoritedArticles() {
      this.$accessor.articles[LOAD_FAVORITED_ARTICLES](this.$data.username);
    }
  }
})
</script>

<style scoped>
.cursor-pointer { 
  cursor: pointer;
}
</style>