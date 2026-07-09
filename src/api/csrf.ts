import { API_BASE_URL } from "./client";

export const fetchCsrfToken = async (): Promise<string> => {
  const res = await fetch(`${API_BASE_URL}/csrf-token`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch CSRF token");
  const data = await res.json();
  return data.csrfToken;
};
