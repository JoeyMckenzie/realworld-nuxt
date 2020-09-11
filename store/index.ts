import { getAccessorType } from "typed-vuex";
import * as users from "./users";

export const accessorType = getAccessorType({
  modules: {
    users
  }
});