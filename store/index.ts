import { getAccessorType } from "typed-vuex";
import * as users from "./users";
import * as articles from "./articles";
import * as tags from "./tags";

export const accessorType = getAccessorType({
  modules: {
    users,
    articles,
    tags
  }
});