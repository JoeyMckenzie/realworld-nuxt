<template>
<div class="auth-page">
  <div class="container page">
    <div class="row">

      <div class="col-md-6 offset-md-3 col-xs-12">
        <h1 class="text-xs-center">Sign up</h1>
        <p class="text-xs-center">
          <nuxt-link to="/register">Need an account?</nuxt-link>
        </p>

        <ul class="error-messages">
          <li v-for="error in errors" :key="error">
            {{ error }}
          </li>
        </ul>

        <div @click="loginUser">
          <fieldset class="form-group">
            <input class="form-control form-control-lg" type="text" placeholder="Email">
          </fieldset>
          <fieldset class="form-group">
            <input class="form-control form-control-lg" type="password" placeholder="Password">
          </fieldset>
          <button class="btn btn-lg btn-primary pull-xs-right">
            Sign in
          </button>
        </div>
      </div>

    </div>
  </div>
</div>  
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import { LOGIN_USER, CLEAR_API_ERRORS } from "@/store/users";
import { AuthenticationRequest, LoginPayload } from "@/models/users.types";
import { Route, NavigationGuardNext } from "vue-router";

export default Vue.extend({
  data: () => ({
    email: "",
    password: ""
  }),
  beforeRouteLeave(to: Route, from: Route, next: NavigationGuardNext<Vue>) {
    // Clear any persisting API errors when the route changes
    this.$accessor.users[CLEAR_API_ERRORS]();
    next();
  },
  computed: mapGetters("users", ["errors"]),
  methods: {
    loginUser() {
      const user = {
        email: this.$data.email,
        password: this.$data.password
      } as LoginPayload;

      this.$accessor.users[LOGIN_USER]({ user: user } as AuthenticationRequest);
    }
  }
});
</script>