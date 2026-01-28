const BASE_URL = "http://127.0.0.1:8000/api/v1";

/**
 * @param endpoint contoh: "/login", "/forms"
 * @param options fetch options
 * @param auth true = pakai token | false = tanpa token
 */
export async function apiFetch(endpoint, options = {}, auth = true) {
  const token = localStorage.getItem("token");
  console.log("TOKEN FROM STORAGE:", token);

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // token HANYA untuk endpoint protected
  if (auth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
}
