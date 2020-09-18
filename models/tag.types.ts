import { Maybe } from "./shared.types";

export type TagsState = {
  currentTags: string[];
  currentTag: Maybe<string>;
};

export type TagViewModelList = {
  tags: string[];
};
