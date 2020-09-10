import { AuthenticationRequest, AuthenticationResponse, UserViewModel } from "../models/users.types";
import axios from "axios";
import { ApiErrorDto } from "../models/shared.types";

const UserApi = {
  authenticate: async (endpoint: string, body: AuthenticationRequest): Promise<AuthenticationResponse> => {
    try {
      const apiResponse = await axios.post<UserViewModel>(endpoint, body);

      return apiResponse.data;
    } catch (error) {
      return error.response.data.errors as ApiErrorDto;
    }
  } 
}

export default UserApi;