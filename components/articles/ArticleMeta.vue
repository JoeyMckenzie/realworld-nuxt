<template>
  <div class="article-preview">
    <div class="article-meta">
      <nuxt-link :to="getUserprofileLink" ><img :src="authorImage" /></nuxt-link>
      <div class="info">
        <nuxt-link :to="getUserprofileLink" class="author">{{ authorUsername }}</nuxt-link>
        <span class="date">{{ getFriendlyDate }}</span>
      </div>
      <button class="btn btn-outline-primary btn-sm pull-xs-right">
        <i class="ion-heart"></i> {{ favoritedCount }}
      </button>
    </div>
    <nuxt-link to="" class="preview-link">
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
      <span>Read more...</span>
    </nuxt-link>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { AuthorDto } from "@/models/article.types";

export default Vue.extend({
  props: {
    authorUsername: String,
    authorImage: String,
    date: String,
    favoritedCount: Number,
    title: String,
    description: String,
  },
  computed: {
    getFriendlyDate(): string {
      return new Date(this.$props.date).toDateString();
    },
    getUserprofileLink(): string {
      return `/profile/${this.$props.authorUsername}`;
    }
  }
})
</script>