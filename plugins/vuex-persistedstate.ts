import { Context } from "@nuxt/types";
import createPersistedState from "vuex-persistedstate";

export default ({ store }: Context) => {
  createPersistedState({
    key: "cachedState",
    paths: ["users", "articles"]
  })(store)
}