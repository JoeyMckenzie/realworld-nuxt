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
import { getUserTokenFromStorage, isNullOrUndefined, isStringNullUndefinedOrEmpty } from "@/utils";
import { GET_CURRENT_USER } from "@/store/users"
import { UsersState } from "~/models/users.types";

export default Vue.extend({
  computed: mapGetters("users", ["userIsAuthenticated"]),

  /**
   * On browser refresh, call the API to get the user in state if a token exists
   */
  beforeMount() {
    const cachedState = localStorage.getItem("usersState");

    if (isNullOrUndefined(cachedState)) {
      return;
    }

    const usersState = JSON.parse(cachedState!) as UsersState;
    const userIsNotAuthenticatedAndTokenIsInStorage = !(this.userIsAuthenticated as boolean) && !isStringNullUndefinedOrEmpty(usersState.currentUser?.token);

    if (userIsNotAuthenticatedAndTokenIsInStorage) {
      this.$accessor.users[GET_CURRENT_USER](usersState.currentUser!.token!);
    }
  }
});
</script>