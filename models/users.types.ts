import { ApiError, ApiErrorDto } from "./shared.types";

export type UsersState = {
  currentUser: UserDto | undefined,
  errors: string[],
  isLoading: boolean
};

export type UserViewModel = {
  user: UserDto
};

export type UserDto = {
  username: string;
  email?: string;
  token?: string;
  bio?: string;
  image?: string;
  password?: string;
};

export type LoginPayload = {
  email: string,
  password: string
};

export type RegisterPayload = {
  email: string,
  username: string,
  password: string
};

export type AuthenticationRequest = {
  user: LoginPayload | RegisterPayload
};

export type AuthenticationResponse = UserViewModel | ApiErrorDto;