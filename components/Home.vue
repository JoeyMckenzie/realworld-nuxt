<template>
  <div class="home-page">

    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <ArticleFeed />
          <ArticleList :articles="currentArticles" />
        </div>
        <Tags />
      </div>
    </div>

  </div>  
</template>

<script lang="ts">
import Vue from "vue";
import ArticleList from "./articles/ArticleList.vue";
import ArticleFeed from "./articles/ArticleFeed.vue";
import Tags from "./Tags.vue";
import { ArticlesState } from "@/models/article.types";
import { UsersState } from "@/models/user.types";
import { LOAD_ARTICLES, REHYDRATE_ARTICLES_STATE } from "@/store/articles";
import { REHYDRATE_USERS_STATE } from "@/store/users";
import { isNullOrUndefined } from "@/utils";
import { Route, NavigationGuardNext } from "vue-router";
import { mapGetters } from "vuex";

export default Vue.extend({
  components: {
    ArticleList,
    ArticleFeed,
    Tags
  },
  beforeMount() {
    const cachedState = localStorage.getItem("cachedState");

    if (isNullOrUndefined(cachedState)) {
      return;
    }

    const deserializedState: { articles: ArticlesState, users: UsersState } = JSON.parse(cachedState!);
    this.$accessor.users[REHYDRATE_USERS_STATE](deserializedState.users);
    this.$accessor.articles[REHYDRATE_ARTICLES_STATE](deserializedState.articles);
  },
  computed: mapGetters("articles", ["currentArticles"])
})
</script>