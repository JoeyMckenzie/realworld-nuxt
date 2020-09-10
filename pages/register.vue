<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Sign up</h1>
          <p class="text-xs-center">
            <nuxt-link to="/login">Have an account?</nuxt-link>
          </p>

          <ul class="error-messages">
            <li v-for="error in errors" :key="error">
              {{ error }}
            </li>
          </ul>

          <div>
            <fieldset class="form-group">
              <input v-model="username" class="form-control form-control-lg" type="text" placeholder="Your Name">
            </fieldset>
            <fieldset class="form-group">
              <input v-model="email" class="form-control form-control-lg" type="text" placeholder="Email">
            </fieldset>
            <fieldset class="form-group">
              <input v-model="password" class="form-control form-control-lg" type="password" placeholder="Password">
            </fieldset>
            <button @click="registerUser" class="btn btn-lg btn-primary pull-xs-right">
              Sign up
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
import { REGISTER_USER, CLEAR_API_ERRORS } from "@/store/users";
import { AuthenticationRequest, RegisterPayload } from "@/models/users.types";
import { Route, NavigationGuardNext } from "vue-router";

export default Vue.extend({
  data: () => ({
    username: "",
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
    async registerUser(): Promise<void> {
      const user = {
        email: this.$data.email,
        username: this.$data.username,
        password: this.$data.password
      } as RegisterPayload;

      const shouldRouteToHome = await this.$accessor.users[REGISTER_USER]({ user: user } as AuthenticationRequest);

      if (shouldRouteToHome) {
        this.$router.push("/");
      }
    }
  }
});
</script>