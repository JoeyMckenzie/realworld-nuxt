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

export type UpdateRequest = {
  username: string;
  email: string;
  bio: string;
  image: string;
  password: string;
}

export type LoginRequest = {
  email: string,
  password: string
};

export type RegisterRequest = {
  email: string,
  username: string,
  password: string
};

export type AuthenticationRequest = {
  endpoint: string;
  user: LoginRequest | RegisterRequest
};

export type AuthenticationResponse = UserViewModel | ApiErrorDto;