<template>
  <div>
    <!-- Iterate through each article and add the meta -->
    <div v-for="article in getArticles" :key="article.slug">
      <ArticleMeta 
        :authorImage="article.author.image"
        :authorUsername="article.author.username"
        :date="article.createdAt"
        :description="article.description"
        :favoritedCount="article.favoritesCount"
        :title="article.title" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapGetters } from "vuex";
import { getUserTokenFromStorage, isStringNullUndefinedOrEmpty, isNullOrUndefined } from "@/utils";
import { ArticleDto, ArticleViewModelList } from "../../models/article.types";
import ArticleFeed from "./ArticleFeed.vue";
import ArticleMeta from "./ArticleMeta.vue";

export default Vue.extend({
  props: {
    articles: {
      type: Array,
      default: () => []
    }
  },
  computed: {
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