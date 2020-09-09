export function isNullOrUndefined(value: any | undefined | null): boolean {
  return value === undefined || value === null;
}

export function isStringNullUndefinedOrEmpty(value: string | undefined | null): boolean {
  if (typeof value === "string") {
    return value.length === 0;
  }

  return isNullOrUndefined(value);
}

export function getUserTokenFromStorage(): string | false {
  if (!process.browser) {
    return false;
  }

  const token = localStorage.getItem("user");

  return token === null ? false : token;
}