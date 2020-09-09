import { getAccessorType, getterTree, actionTree, mutationTree } from "typed-vuex";
import { UserViewModel, AuthenticationRequest, UserDto, UsersState } from "@/models/users.types";
import { ApiError } from "@/models/shared.types";
import { API_BASE_URL, DEFAULT_HEADERS, DEFAULT_HEADERS_WITH_AUTHORIZATION } from ".";
import { isNullOrUndefined, getUserTokenFromStorage } from "@/utils";

/**
 * Mutation keys
 */
export const SET_CURRENT_USER = "setCurrentUser";
export const SET_AUTHENTICATION_ERROR = "setAuthenticationError";
export const SET_ROUTE_TO_HOME = "setRouteToHome";

/**
 * Action keys
 */
export const USER_TOKEN_STORAGE_KEY = "user";
export const LOGIN_USER = "login";
export const REGISTER_USER = "register";
export const GET_CURRENT_USER = "getCurrentUser";
export const GET_TOKEN_FROM_STORAGE = "getTokenFromStorage";
export const SET_USER_IN_STORAGE = "setUserInStorage";
export const CLEAR_USER = "clearUser";

/**
 * State definition
 */
export const state = () => ({
  currentUser: undefined,
  errors: [] as string[]
} as UsersState);

/**
 * Getters
 */
export const getters = getterTree(state, {
  currentUser: state => state.currentUser?.username,
  userIsAuthenticated: state => !isNullOrUndefined(state.currentUser),
  errors: state => state.errors,
});

/**
 * Mutations
 */
export const mutations = mutationTree(state, {
  [SET_CURRENT_USER]: (state, user: UserDto | undefined) => state.currentUser = user,
  [SET_AUTHENTICATION_ERROR]: (state, errors?: { [key: string]: [] }) => {
    if (errors === undefined) {
      state.errors = [];
      return;
    }

    const friendlyErrors = [] as string[];

    for (const key in errors) {
      const errorValue: string[] = errors[key]; 
      const normalizedKey = key.charAt(0).toUpperCase() + key.substring(1, key.length);
      errorValue.forEach(error => friendlyErrors.push(`${normalizedKey} ${error}`));
    }

    state.errors = friendlyErrors;
  }
});

/**
 * Actions
 */
export const actions = actionTree({ state, getters, mutations }, {
  async [LOGIN_USER]({ commit, dispatch }, payload: AuthenticationRequest) {
  },

  /**
   * Dispatched action to call the register endpoint and returns a flag back
   * to the components signaling them to route back to home on success 
   */
  async [REGISTER_USER]({ commit, dispatch }, payload: AuthenticationRequest) {
    const apiResponse = await fetch(`${API_BASE_URL}/users`, { method: "POST", body: JSON.stringify(payload), ...DEFAULT_HEADERS });

    if (apiResponse.ok) {
      const registeredUser: UserViewModel = await apiResponse.json();
      commit(SET_CURRENT_USER, registeredUser.user);
      commit(SET_AUTHENTICATION_ERROR, undefined);
      dispatch(SET_USER_IN_STORAGE, registeredUser.user.token);
      this.$router.push("/");      
    } else {
      const apiErrors: ApiError = await apiResponse.json();
      commit(SET_AUTHENTICATION_ERROR, apiErrors.errors);

      return false;
    }
  },

  /**
   * Dispatched action to retrieve the current user from the cached token
   */
  async [GET_CURRENT_USER]({ commit }, token: string) {
      this.$axios.setToken(getUserTokenFromStorage(), "Token");
      const apiResponse = await this.$axios.$get<UserViewModel>("user");
      commit(SET_CURRENT_USER, apiResponse.user);
  },
  [CLEAR_USER]: ({commit}) => {
    commit(SET_CURRENT_USER, undefined);
  },
  [SET_USER_IN_STORAGE]: ({ }, token: string) => localStorage.setItem(USER_TOKEN_STORAGE_KEY, token)
});

export const accessorType = getAccessorType({
  state,
  actions,
  getters,
  mutations
});