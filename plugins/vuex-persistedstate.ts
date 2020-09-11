import { Context } from "@nuxt/types";
import createPersistedState from "vuex-persistedstate";

export default ({ store }: Context) => {
  createPersistedState({
    key: "usersState",
    paths: ["users"]
  })(store)
}