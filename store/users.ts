import { getAccessorType, getterTree, actionTree, mutationTree } from "typed-vuex";
import { UserViewModel, AuthenticationRequest } from "@/models/users.types";
import { ApiError } from "@/models/shared.types";
import { API_BASE_URL, DEFAULT_HEADERS } from ".";

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
export const GET_USER_FROM_STORAGE = "getUserFromStorage";
export const SET_USER_IN_STORAGE = "setUserInStorage";

/**
 * Users state
 */
export type UsersState = ReturnType<typeof state>;

export const state = () => ({
  currentUser: { } as UserViewModel,
  errors: [] as string[]
});

/**
 * Getters
 */
export const getters = getterTree(state, {
  user: state => state.currentUser.user,
  errors: state => state.errors,
});

/**
 * Mutations
 */
export const mutations = mutationTree(state, {
  [SET_CURRENT_USER]: (state, user: UserViewModel) => state.currentUser = user,
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
  [LOGIN_USER]: (context, payload: AuthenticationRequest) => {
  },

  /**
   * Dispatched action to call the register endpoint and returns a flag back
   * to the components signaling them to route back to home on success 
   */
  [REGISTER_USER]: async ({ commit, dispatch }, payload: AuthenticationRequest): Promise<boolean> => {
    const apiResponse = await fetch(`${API_BASE_URL}/users`, { method: "POST", body: JSON.stringify(payload), ...DEFAULT_HEADERS });

    if (apiResponse.ok) {
      const registeredUser: UserViewModel = await apiResponse.json();
      commit(SET_CURRENT_USER, registeredUser);
      commit(SET_AUTHENTICATION_ERROR, undefined);
      dispatch(SET_USER_IN_STORAGE, registeredUser.user.token);

      // On a successful registration, return true to the caller to let them know
      // to navigate back to home 
      return true;
    } else {
      const apiErrors: ApiError = await apiResponse.json();
      commit(SET_AUTHENTICATION_ERROR, apiErrors.errors);

      return false;
    }
  },
  [GET_CURRENT_USER]: async ({ commit }, token: string) => {
      const apiResponse = await fetch(API_BASE_URL, { method: "GET", ...DEFAULT_HEADERS });
      const user: UserViewModel = await apiResponse.json();
      commit(SET_CURRENT_USER, user);
  },
  [GET_USER_FROM_STORAGE]: ({ dispatch }) => {
    const userTokenFromStorage = localStorage.getItem(USER_TOKEN_STORAGE_KEY);

    if (userTokenFromStorage === null || userTokenFromStorage.length === 0) {
      return;
    }

    dispatch(GET_CURRENT_USER, userTokenFromStorage);
  },
  [SET_USER_IN_STORAGE]: ({ }, token: string) => localStorage.setItem(USER_TOKEN_STORAGE_KEY, token)
});

export const accessorType = getAccessorType({
  state,
  actions,
  getters,
  mutations
});