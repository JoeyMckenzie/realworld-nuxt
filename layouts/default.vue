<template>
  <div>
    <NavBar />
    <Nuxt />
    <Footer />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import { isStringNullUndefinedOrEmpty } from "@/utils";
import { GET_CURRENT_USER } from "@/store/users"

export default Vue.extend({
  computed: mapGetters("users", ["userIsAuthenticated"]),

  /**
   * On browser refresh, call the API to get the user in state if a token exists
   */
  beforeMount() {
    const cachedToken = localStorage.getItem("user");
    const userIsNotAuthenticatedAndTokenIsInStorage = !(this.userIsAuthenticated as boolean) && !isStringNullUndefinedOrEmpty(cachedToken);

    if (userIsNotAuthenticatedAndTokenIsInStorage) {
      this.$accessor.users[GET_CURRENT_USER](cachedToken!);
    }
  }
});
</script>