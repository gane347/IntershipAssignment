import { apiFetch, authenticatedApiFetch } from "./api/client";

export type User = {
  id: string;
  email: string;
  username: string;
  isSeller: boolean;
  createdAt: string;
};

type AuthResponse = {
  user: User;
  token: string;
};

const TOKEN_KEY = "store_access_token";

function saveSession(response: AuthResponse) {
  window.localStorage.setItem(TOKEN_KEY, response.token);
  return response.user;
}

export async function register(input: {
  email: string;
  username: string;
  password: string;
  isSeller?: boolean;
}) {
  const response = await apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return saveSession(response);
}

export async function login(identifier: string, password: string) {
  const response = await apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ identifier, password }),
  });
  return saveSession(response);
}

export async function logout() {
  try {
    if (window.localStorage.getItem(TOKEN_KEY)) {
      await authenticatedApiFetch<void>("/auth/logout", { method: "POST" });
    }
  } finally {
    window.localStorage.removeItem(TOKEN_KEY);
  }
}

export function getAccessToken() {
  return typeof window === "undefined" ? null : window.localStorage.getItem(TOKEN_KEY);
}

export async function getCurrentUser() {
  if (!getAccessToken()) return null;
  try {
    return (await authenticatedApiFetch<{ user: User }>("/auth/me")).user;
  } catch {
    await logout();
    return null;
  }
}
