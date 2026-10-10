import { apiRequest } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { LoginCredentials } from "../types";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "teacher";
  title: string;
  avatarText: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    return apiRequest<AuthUser>(API_ENDPOINTS.auth.login, {
      method: "POST",
      body: {
        email: credentials.username.trim(),
        password: credentials.password ?? "",
      },
    });
  },

  async me(): Promise<AuthUser> {
    return apiRequest<AuthUser>(API_ENDPOINTS.auth.me);
  },

  async logout(): Promise<void> {
    await apiRequest<void>(API_ENDPOINTS.auth.logout, { method: "POST" });
  },
};
