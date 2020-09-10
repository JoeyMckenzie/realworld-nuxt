import { getAccessorType, getterTree, actionTree, mutationTree } from "typed-vuex";
import { UserViewModel, AuthenticationRequest, UserDto, UsersState, AuthenticationResponse } from "@/models/users.types";
import { ApiErrorDto } from "@/models/shared.types";
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
export const SET_TOKEN_IN_STORAGE = "setUserInStorage";
export const CLEAR_USER = "clearUser";
export const CLEAR_API_ERRORS = "clearApiErrors";


/**
 * State definition
 */
export const state = () => ({
  currentUser: undefined,
  errors: [] as string[],
  isLoading: false
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
  [SET_CURRENT_USER]: (state: UsersState, user: UserDto | undefined) => state.currentUser = user,

  /**
   * Mutates error state to flatten the returned error aggregate from the API as a string list.
   * 
   * @param state {UsersState} - Users state slice
   * @param errors {ApiErrorDto} - Error aggregate returned from API
   */
  [SET_AUTHENTICATION_ERROR]: (state: UsersState, errors?: ApiErrorDto) => {
    // If no errors are returned, set state to an empty list
    if (isNullOrUndefined(errors)) {
      state.errors = [];
      return;
    }

    // Initialize the flattened error list to set in state
    const friendlyErrors = [] as string[];

    // Iterate through each property of the error aggregate and add the flattened error to the list
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
  /**
   * Dispatched action to call the login endpoint and route back to home on success.
   * 
   * @param commit|dispatch - Context helpers  
   * @param payload {AuthenticationRequest} - Login payload
   */
  async [LOGIN_USER]({ commit, dispatch }, payload: AuthenticationRequest) {
    try {
      // Call the login endpoint
      const apiResponse = await this.$axios.$post<UserViewModel>("/users/login", payload)
  
      // If no user is returned, assume an error occurred
      commit(SET_CURRENT_USER, apiResponse.user);
      dispatch(SET_TOKEN_IN_STORAGE, apiResponse.user.token);

      // Route the user back to the home page
      this.$router.push("/");
    } catch (error) {
      commit(SET_CURRENT_USER, undefined);

      // Axios returns the response body with error.response.data
      commit(SET_AUTHENTICATION_ERROR, error.response.data.errors as ApiErrorDto);
    }
  },

  /**
   * Dispatched action to call the register endpoint and returns a flag back route back to home on success.
   * 
   * @param commit|dispatch - Context helpers  
   * @param payload {AuthenticationRequest} - Register payload
   */
  async [REGISTER_USER]({ commit, dispatch }, payload: AuthenticationRequest) {
    try {
      // Call the register endpoint
      const apiResponse = await this.$axios.$post<UserViewModel>("/users", payload)
  
      // If no user is returned, assume an error occurred
      commit(SET_CURRENT_USER, apiResponse.user);
      dispatch(SET_TOKEN_IN_STORAGE, apiResponse.user.token);

      // Route the user back to the home page
      this.$router.push("/");
    } catch (error) {
      commit(SET_CURRENT_USER, undefined);

      // Axios returns the response body with error.response.data
      commit(SET_AUTHENTICATION_ERROR, error.response.data.errors as ApiErrorDto);
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
  [CLEAR_USER]: ({commit}) => commit(SET_CURRENT_USER, undefined),
  [CLEAR_API_ERRORS]: ({ commit }) => commit(SET_AUTHENTICATION_ERROR, undefined),
  [SET_TOKEN_IN_STORAGE]: ({ }, token: string) => localStorage.setItem(USER_TOKEN_STORAGE_KEY, token)
});

export const accessorType = getAccessorType({
  state,
  actions,
  getters,
  mutations
});