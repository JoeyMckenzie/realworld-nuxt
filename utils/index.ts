import { Maybe, RetrievedItem } from "@/models/shared.types";

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

  const token = localStorage.getItem("user");

  return token === null ? false : token;
}