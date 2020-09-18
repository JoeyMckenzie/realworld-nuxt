import { getAccessorType, getterTree, actionTree, mutationTree } from "typed-vuex";
import { TagsState, TagViewModelList } from "../models/tag.types";

/**
 * Mutation keys
 */
const SET_TAGS = "setArticleTags";
const SET_TAG = "setArticleTag";

/**
 * Action keys
 */
export const REHYDRATE_TAGS_STATE = "rehydrateTagsState";
export const LOAD_TAGS = "loadTags";
export const LOAD_TAG_FEED = "loadTagFeed";

/**
 * State definition
 */
export const state = () => ({
  currentTags: [],
  currentTag: undefined
} as TagsState);

/**
 * Getters
 */
export const getters = getterTree(state, {
  tags: state => state.currentTags,
  tag: state => state.currentTag
});

/**
 * Mutations
 */
export const mutations = mutationTree(state, {
  [SET_TAGS]: (state, tags: string[]) => state.currentTags = tags,
  [SET_TAG]: (state, tag: string) => state.currentTag = tag
});

/**
 * Actions
 */
export const actions = actionTree({ state, getters, mutations }, {
  [REHYDRATE_TAGS_STATE]: ({ commit }, state: TagsState) => commit(SET_TAGS, state.currentTags),

  async [LOAD_TAGS]({ commit }) {
    try {
      const apiResponse = await this.$axios.$get<TagViewModelList>("/tags");
      commit(SET_TAGS, apiResponse.tags);
    } catch (error) {
      console.log(`Error retrieving tag list: ${error}`);
    }
  }
});

export const accessorType = getAccessorType({
  state,
  actions,
  getters,
  mutations
});