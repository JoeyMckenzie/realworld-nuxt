<template>
  <div>
    <Home />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Home from "@/components/Home.vue";
import { LOAD_ARTICLES } from "@/store/articles"
import { Route, NavigationGuardNext } from "vue-router";

export default Vue.extend({
  components: {
    Home
  },
  beforeMount() {
    this.$accessor.articles[LOAD_ARTICLES]();
  },
})
</script>
