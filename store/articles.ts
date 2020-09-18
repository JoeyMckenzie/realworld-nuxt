import { getAccessorType, getterTree, actionTree, mutationTree } from "typed-vuex";
import { getUsernameFromStorage, getUserTokenFromStorage, isStringNullUndefinedOrEmpty } from "../utils";
import { ArticleFeed, ArticlesState, ArticleViewModel, ArticleViewModelList } from "../models/article.types";
import { Maybe } from "~/models/shared.types";
import { TagViewModelList } from "~/models/tag.types";

/**
 * Mutation keys
 */
const SET_ARTICLES_STATE = "setArticlesState";
const SET_ARTICLES = "setArticles";
const SET_ARTICLE = "setArticle";
const SET_FEED = "setFeed";
const SET_LOADING_ARTICLES = "setLoadingArticles";
const SET_LOADED_TAG_FEED = "setLoadedTagFeed";

/**
 * Action keys
 */
export const REHYDRATE_ARTICLES_STATE = "rehydrateArticlesState";
export const LOAD_ARTICLES = "loadArticles";
export const LOAD_ARTICLE = "loadArticle";
export const LOAD_FEED = "loadFeed";
export const LOAD_ARTICLES_BY_USER = "loadArticlesByUsers";
export const LOAD_FAVORITED_ARTICLES = "loadFavoritedArticles";
export const FAVORITE_ARTICLE = "favoriteArticle";
export const UNFAVORITE_ARTICLE = "unfavoriteArticle";
export const RELOAD_CURRENT_ARTICLES = "reloadCurrentArticles";
export const LOAD_ARTICLE_TAG_FEED = "loadArticleTagFeed";

/**
 * State definition
 */
export const state = () => ({
  currentArticle: undefined,
  currentArticleList: undefined,
  currentFeed: ArticleFeed.Global,
  loadedTagFeed: undefined,
  loadingArticles: false
} as ArticlesState);

/**
 * Getters
 */
export const getters = getterTree(state, {
  currentArticle: state => state.currentArticle?.article,
  currentArticles: state => state.currentArticleList?.articles,
  articlesCount: state => state.currentArticleList?.articlesCount,
  tagFeed: state => state.loadedTagFeed,
  currentFeed: state => state.currentFeed,
  isLoading: state => state.loadingArticles
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
  [SET_ARTICLE]: (state, article: Maybe<ArticleViewModel>) => state.currentArticle = article,
  [SET_FEED]: (state, feedType: ArticleFeed) => state.currentFeed = feedType,
  [SET_LOADING_ARTICLES]: (state, isLoading: boolean) => state.loadingArticles = isLoading,
  [SET_LOADED_TAG_FEED]: (state, feedTag: string) => state.loadedTagFeed = feedTag
});

/**
 * Actions
 */
export const actions = actionTree({ state, getters, mutations }, {
  [REHYDRATE_ARTICLES_STATE]: ({ commit }, state: ArticlesState) => commit(SET_ARTICLES_STATE, state),

  /**
   * Load the global feed of articles.
   * 
   * @param commit - Context helper 
   */
  async [LOAD_ARTICLES]({ commit }) {
    try {
      commit(SET_LOADING_ARTICLES, true);

      // Conditionally set the token, if available
      const token = getUserTokenFromStorage();
      if (token &&  typeof token === "string") {
        this.$axios.setToken(token, "Token");
      }

      const articles = await this.$axios.$get<ArticleViewModelList>("/articles");
      commit(SET_ARTICLES, articles);
      commit(SET_FEED, ArticleFeed.Global);
    } catch (error) {
      console.error(`Error loading articles: ${error}`);
    } finally {
      commit(SET_LOADING_ARTICLES, false);
    }
  },
  
  /**
   * Retrieves the article by the slug title.
   * 
   * @param commit - Context helper 
   * @param articleSlug - Slug title
   */
  async [LOAD_ARTICLE]({ commit }, articleSlug: string) {
    try {
      commit(SET_LOADING_ARTICLES, true);
      const article = await this.$axios.$get<ArticleViewModel>(`/articles/${articleSlug}`);
      commit(SET_ARTICLE, article);
      
      // Route the user to the selected article page
      this.$router.push(`/article/${articleSlug}`);
    } catch (error) {
      console.error(`Error loading article: ${error}`);
      commit(SET_ARTICLE, undefined);
    } finally {
      commit(SET_LOADING_ARTICLES, false);
    }
  },
  
  async [LOAD_FEED]({ commit }) {
    try {
      commit(SET_LOADING_ARTICLES, true);
      this.$axios.setToken(getUserTokenFromStorage(), "Token");
      const articles = await this.$axios.$get<ArticleViewModelList>("/articles/feed");
      commit(SET_ARTICLES, articles);
      commit(SET_FEED, ArticleFeed.Followed);
    } catch (error) {
      console.error(`Error loading feed: ${error}`);
    } finally {
      commit(SET_LOADING_ARTICLES, false);
    }
  },

  async [LOAD_ARTICLES_BY_USER]({ commit }, username: string) {
    try {
      commit(SET_LOADING_ARTICLES, true);
      const articles = await this.$axios.$get<ArticleViewModelList>(`/articles?author=${username}`);
      commit(SET_ARTICLES, articles);
      commit(SET_FEED, ArticleFeed.User);
    } catch (error) {
      console.log(`Error loading feed articles by users ${username}: ${error}`);
    } finally {
      commit(SET_LOADING_ARTICLES, false);
    }
  },

  async [LOAD_FAVORITED_ARTICLES]({ commit }, username: string) {
    try {
      commit(SET_LOADING_ARTICLES, true);
      this.$axios.setToken(getUserTokenFromStorage(), "Token");
      const articles = await this.$axios.$get<ArticleViewModelList>(`/articles?favorited=${username}`);
      commit(SET_ARTICLES, articles);
      commit(SET_FEED, ArticleFeed.Favorited)
    } catch (error) {
      console.log(`Error loading feed articles by users ${username}: ${error}`);
    } finally {
      commit(SET_LOADING_ARTICLES, false);
    }
  },

  [RELOAD_CURRENT_ARTICLES]({ dispatch, getters }) {
    switch (getters.currentFeed) {
      case ArticleFeed.Favorited:
        dispatch(LOAD_FAVORITED_ARTICLES, getUsernameFromStorage());
        break;
      case ArticleFeed.Followed:
        dispatch(LOAD_FEED);
        break;
      case ArticleFeed.Global:
        console.log("reloading all articles");
        dispatch(LOAD_ARTICLES);
        break;
    }
  },

  async [FAVORITE_ARTICLE]({ dispatch }, slug: string) {
    try {
      this.$axios.setToken(getUserTokenFromStorage(), "Token");
      await this.$axios.$post(`/articles/${slug}/favorite`);
      dispatch(RELOAD_CURRENT_ARTICLES);
    } catch (error) {
      console.log(`Error favoriting article ${error}`);
    }
  },

  async [UNFAVORITE_ARTICLE]({ dispatch }, slug: string) {
    try {
      this.$axios.setToken(getUserTokenFromStorage(), "Token");
      await this.$axios.$delete(`/articles/${slug}/favorite`);
      dispatch(RELOAD_CURRENT_ARTICLES);
    } catch (error) {
      console.log(`Error unfavoriting article ${error}`);
    }
  },

  async [LOAD_ARTICLE_TAG_FEED]({ commit }, tag: string) {
    try {
      commit(SET_LOADING_ARTICLES, true);
      const apiResponse = await this.$axios.$get<ArticleViewModelList>(`/articles?tag=${tag}`);
      commit(SET_ARTICLES, apiResponse);
      commit(SET_FEED, ArticleFeed.Tag);
      commit(SET_LOADED_TAG_FEED, tag);
    } catch (error) {
      console.log(`Error retrieving article tag feed: ${error}`);
    } finally {
      commit(SET_LOADING_ARTICLES, false);
    }
  }
});

export const accessorType = getAccessorType({
  state,
  actions,
  getters,
  mutations
});