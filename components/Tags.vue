<template>
  <div class="col-md-3">
    <div class="sidebar">
      <p>Popular Tags</p>

      <div v-for="tag in tags" :key="tag" class="tag-list">
        <a @click="loadArticlesWithTag(tag)" class="cursor-pointer tag-pill tag-default">{{ tag }}</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import { LOAD_ARTICLE_TAG_FEED } from "@/store/articles";
import { LOAD_TAGS } from "~/store/tags";

export default Vue.extend({
  beforeCreate() {
    this.$accessor.tags[LOAD_TAGS]();
  },
  computed: mapGetters("tags", ["tags"]),
  methods: {
    loadArticlesWithTag(tag: string): void {
      this.$accessor.articles[LOAD_ARTICLE_TAG_FEED](tag);
    }
  }
})
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>