export type ApiError = {
  errors: ApiErrorDto
};

export type ApiErrorDto = { [key: string]: [] };

export type Maybe<T> = T | undefined | null;

export type RetrievedItem = string | false;