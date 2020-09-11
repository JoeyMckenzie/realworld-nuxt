import { Maybe, RetrievedItem } from "@/models/shared.types";
import { ArticlesState } from "~/models/article.types";
import { UsersState } from "~/models/user.types";

export const isNullOrUndefined = (value: Maybe<any>): boolean => {
  return value === undefined || value === null;
}

export const isStringNullUndefinedOrEmpty = (value: Maybe<string>): boolean => {
  if (typeof value === "string") {
    return value.length === 0;
  }

  return isNullOrUndefined(value);
}

export const getUserTokenFromStorage = (): RetrievedItem => {
  if (!process.browser) {
    return false;
  }

  const cachedState = localStorage.getItem("cachedState");

  if (isNullOrUndefined(cachedState)) {
    return false;
  }

  const deserializedState: { articles: ArticlesState, users: UsersState } = JSON.parse(cachedState!);

  return isNullOrUndefined(deserializedState.users.currentUser?.token) ? false : deserializedState.users.currentUser?.token!;
}

export const getStringOrDefault = (value: Maybe<string>): string => {
  return isStringNullUndefinedOrEmpty(value) ? "" : value!;
}