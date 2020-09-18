<template>
  <div class="article-preview">
    <div class="article-meta">
      <nuxt-link :to="getUserprofileLink" ><img :src="authorImage" /></nuxt-link>
      <div class="info">
        <nuxt-link :to="getUserprofileLink" class="author">{{ authorUsername }}</nuxt-link>
        <span class="date">{{ getFriendlyDate }}</span>
      </div>
      <button v-if="favorited" @click="unfavoriteArticle" class="btn btn-outline-primary btn-sm pull-xs-right">
        <i class="ion-heart"></i> {{ favoritedCount }}
      </button>
      <button v-else @click="favoriteArticle" class="btn btn-outline-primary btn-sm pull-xs-right">
        <i class="ion-heart"></i> {{ favoritedCount }}
      </button>
    </div>
    <div @click="getArticleFromSlug" class="cursor-pointer preview-link">
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
      <span>Read more...</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { AuthorDto } from "@/models/article.types";
import { FAVORITE_ARTICLE, LOAD_ARTICLE, UNFAVORITE_ARTICLE } from "@/store/articles";

export default Vue.extend({
  props: {
    authorUsername: String,
    authorImage: String,
    date: String,
    favoritedCount: Number,
    title: String,
    description: String,
    slug: String,
    favorited: Boolean
  },
  computed: {
    getFriendlyDate(): string {
      return new Date(this.$props.date).toDateString();
    },
    getUserprofileLink(): string {
      return `/profile/${this.$props.authorUsername}`;
    },
    getArticleRoute(): string {
      return `/article/${this.$props.slug}`;
    }
  },
  methods: {
    getArticleFromSlug(): void {
      this.$accessor.articles[LOAD_ARTICLE](this.$props.slug);
    },
    favoriteArticle(): void {
      this.$accessor.articles[FAVORITE_ARTICLE](this.$props.slug);
    },
    unfavoriteArticle(): void {
      this.$accessor.articles[UNFAVORITE_ARTICLE](this.$props.slug);
    }
  }
})
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>