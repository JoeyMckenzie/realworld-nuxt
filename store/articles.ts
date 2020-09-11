import { getAccessorType, getterTree, actionTree, mutationTree } from "typed-vuex";
import { ApiErrorDto } from "../models/shared.types";
import { getUserTokenFromStorage, isNullOrUndefined } from "../utils";
import { ArticleFeed, ArticlesState, ArticleViewModel, ArticleViewModelList } from "../models/article.types";

/**
 * Mutation keys
 */
const SET_ARTICLES_STATE = "setArticlesState";
const SET_ARTICLES = "setArticles";
const SET_FEED = "setFeed";

/**
 * Action keys
 */
export const REHYDRATE_ARTICLES_STATE = "rehydrateArticlesState";
export const LOAD_ARTICLES = "loadArticles";
export const LOAD_FEED = "loadFeed";


/**
 * State definition
 */
export const state = () => ({
  currentArticle: undefined,
  currentArticleList: undefined,
  currentFeed: ArticleFeed.Global
} as ArticlesState);

/**
 * Getters
 */
export const getters = getterTree(state, {
  currentArticle: state => state.currentArticle?.article,
  currentArticles: state => state.currentArticleList?.articles,
  articlesCount: state => state.currentArticleList?.articlesCount,
  currentFeed: state => state.currentFeed
});

/**
 * Mutations
 */
export const mutations = mutationTree(state, {
  [SET_ARTICLES_STATE]: (state, rehydratedState: ArticlesState) => {
    state.currentArticleList = rehydratedState.currentArticleList;
    state.currentArticle = rehydratedState.currentArticle;
    state.currentFeed = rehydratedState.currentFeed;
  },
  [SET_ARTICLES]: (state, articles: ArticleViewModelList) => state.currentArticleList = articles,
  [SET_FEED]: (state, feedType: ArticleFeed) => state.currentFeed = feedType 
});

/**
 * Actions
 */
export const actions = actionTree({ state, getters, mutations }, {
  [REHYDRATE_ARTICLES_STATE]: ({ commit }, state: ArticlesState) => commit(SET_ARTICLES_STATE, state),

  /**
   * Load the global feed of articles
   * 
   * @param commit - Context helper 
   */
  async [LOAD_ARTICLES]({ commit }) {
    try {
      const articles = await this.$axios.$get<ArticleViewModelList>("/articles");
      commit(SET_ARTICLES, articles);
      commit(SET_FEED, ArticleFeed.Global);
    } catch (error) {
      console.error(`Error loading articles: ${error}`);
    }
  },
  
  async [LOAD_FEED]({ commit }) {
    try {
      this.$axios.setToken(getUserTokenFromStorage(), "Token");
      const articles = await this.$axios.$get<ArticleViewModelList>("/articles/feed");
      commit(SET_ARTICLES, articles);
      commit(SET_FEED, ArticleFeed.Followed);
    } catch (error) {
      console.error(`Error loading feed: ${error}`);
    }
  }
});

export const accessorType = getAccessorType({
  state,
  actions,
  getters,
  mutations
});