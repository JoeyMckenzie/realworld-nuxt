import { getAccessorType } from "typed-vuex";
import * as users from "./users";

export const API_BASE_URL = "https://conduit.productionready.io/api";
export const DEFAULT_HEADERS = {
  headers: {
    "Content-Type": "application/json"
  }
} as RequestInit;

export const DEFAULT_HEADERS_WITH_AUTHORIZATION = (token: string) => ({
  headers: {
    "Authorization": `Token ${token}`,
    "Content-Type": "application/json"
  }
} as RequestInit);

export const accessorType = getAccessorType({
  modules: {
    users
  }
});