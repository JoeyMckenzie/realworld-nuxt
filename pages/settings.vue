<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <ul class="error-messages">
            <li v-for="error in errors" :key="error">
              {{ error }}
            </li>
          </ul>

          <div>
            <fieldset>
                <fieldset class="form-group">
                  <input v-model="image" class="form-control" type="text" placeholder="URL of profile picture">
                </fieldset>
                <fieldset class="form-group">
                  <input v-model="username" class="form-control form-control-lg" type="text" placeholder="Your Name">
                </fieldset>
                <fieldset class="form-group">
                  <textarea v-model="bio" class="form-control form-control-lg" rows="8" placeholder="Short bio about you"></textarea>
                </fieldset>
                <fieldset class="form-group">
                  <input v-model="email" class="form-control form-control-lg" type="text" placeholder="Email">
                </fieldset>
                <fieldset class="form-group">
                  <input v-model="password" class="form-control form-control-lg" type="password" placeholder="Password">
                </fieldset>
                <button @click="updateUserProfile" class="btn btn-lg btn-primary pull-xs-right">
                  Update Settings
                </button>
            </fieldset>
          </div>
        </div>

      </div>
    </div>
  </div>  
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import { LOGIN_USER, CLEAR_API_ERRORS, UPDATE_USER } from "@/store/users";
import { AuthenticationRequest, LoginRequest, UpdateRequest, UserDto, UsersState } from "@/models/users.types";
import { Route, NavigationGuardNext } from "vue-router";
import { getStringOrDefault, isNullOrUndefined, isStringNullUndefinedOrEmpty } from "~/utils";
import { Maybe } from "~/models/shared.types";

export default Vue.extend({
  data: () => ({
    image: "",
    username: "",
    bio: "",
    email: "",
    password: ""
  }),
  beforeRouteLeave(to: Route, from: Route, next: NavigationGuardNext<Vue>) {
    // Clear any persisting API errors when the route changes
    this.$accessor.users[CLEAR_API_ERRORS]();
    next();
  },
  created() {
    const user = this.$accessor.users.currentUser;

    if (isNullOrUndefined(user)) {
      // Do some sort of error handling here
      return;
    }

    this.$data.image = user!.image;
    this.$data.username = user!.username;
    this.$data.bio = user!.bio;
    this.$data.email = user!.email;
  },
  computed: mapGetters("users", ["errors", "currentUser"]),
  methods: {
    updateUserProfile() {
      const user = {
        image: this.$data.image,
        username: this.$data.username,
        bio: this.$data.bio,
        email: this.$data.email       
      } as UpdateRequest;

      if (!isStringNullUndefinedOrEmpty(this.$data.password)) {
        user.password = this.$data.password;
      }

      this.$accessor.users[UPDATE_USER](user);
    }
  }
});
</script>