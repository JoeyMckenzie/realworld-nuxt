import { Context } from "@nuxt/types";
import createPersistedState from "vuex-persistedstate";

const stateSlices = ["users", "articles"];

export default ({ store }: Context) => {
  createPersistedState({
    key: "cachedState",
    paths: stateSlices
  })(store)
}