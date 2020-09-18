<template>
  <div>
    <div v-if="isLoading">
      <span class="text-center">Loading articles...</span>
    </div>
    <!-- Iterate through each article and add the meta -->
    <div v-else v-for="article in getArticles" :key="article.slug">
      <ArticleMeta 
        :authorImage="article.author.image"
        :authorUsername="article.author.username"
        :date="article.createdAt"
        :description="article.description"
        :favoritedCount="article.favoritesCount"
        :slug="article.slug"
        :favorited="article.favorited"
        :title="article.title" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import ArticleFeed from "./ArticleFeed.vue";
import ArticleMeta from "./ArticleMeta.vue";
import { mapGetters } from "vuex";
import { getUserTokenFromStorage, isStringNullUndefinedOrEmpty, isNullOrUndefined } from "@/utils";
import { ArticleDto, ArticleViewModelList } from "@/models/article.types";

export default Vue.extend({
  props: {
    articles: {
      type: Array,
      default: () => [] as ArticleDto[]
    }
  },
  computed: {
    ...mapGetters("articles", ["isLoading"]),
    articlesHaveLoaded(): boolean {
      return this.$props.articles.length > 0;
    },
    getArticles(): ArticleDto[] {
      return this.$props.articles;
    }
  },
  components: {
    ArticleFeed,
    ArticleMeta
  },
})
</script>