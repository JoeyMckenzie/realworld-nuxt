import { getAccessorType, getterTree, actionTree, mutationTree } from "typed-vuex";
import { ApiErrorDto } from "../models/shared.types";
import { isNullOrUndefined } from "../utils";
import { ArticlesState } from "../models/article.types";

/**
 * Mutation keys
 */

/**
 * Action keys
 */

/**
 * State definition
 */
export const state = () => ({
  currentArticle: undefined,
  currentArticleList: undefined
} as ArticlesState);

/**
 * Getters
 */
export const getters = getterTree(state, {
  currentArticle: state => state.currentArticle?.article,
  currentArticles: state => state.currentArticleList?.articles,
  articlesCount: state => state.currentArticleList?.articlesCount
});

/**
 * Mutations
 */
export const mutations = mutationTree(state, {
});

/**
 * Actions
 */
export const actions = actionTree({ state, getters, mutations }, {
});

export const accessorType = getAccessorType({
  state,
  actions,
  getters,
  mutations
});