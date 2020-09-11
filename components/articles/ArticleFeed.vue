<template>
  <div class="feed-toggle">
    <ul class="nav nav-pills outline-active">
      <li v-show="userIsAuthenticated" class="nav-item">
        <a @click="loadUserFeed" :class="isFollowedFeed ? 'active' : undefined" class="cursor-pointer nav-link">Your Feed</a>
      </li>
      <li class="nav-item">
        <a @click="loadGlobalFeed" :class="isGlobalFeed ? 'active' : undefined" class="cursor-pointer nav-link">Global Feed</a>
      </li>
      <li v-show="isTagFeed" class="nav-item">
        <a class="nav-link active">Global Feed</a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import { ArticleFeed } from "~/models/article.types";
import { LOAD_ARTICLES, LOAD_FEED } from "~/store/articles";

export default Vue.extend({
  computed: {
    ...mapGetters("users", ["userIsAuthenticated"]),
    ...mapGetters("articles", ["currentFeed"]),
    isTagFeed(): boolean {
      return this.currentFeed === ArticleFeed.Tag;
    },
    isGlobalFeed(): boolean {
      return this.currentFeed === ArticleFeed.Global;
    },
    isFollowedFeed(): boolean {
      return this.currentFeed === ArticleFeed.Followed;
    },
  },
  methods: {
    loadUserFeed(): void {
      this.$accessor.articles[LOAD_FEED]();
    },
    loadGlobalFeed(): void {
      this.$accessor.articles[LOAD_ARTICLES]();
    },
  }
})
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>