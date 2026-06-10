async function request(path, options = {}) {
  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...options.headers
  };

  const response = await fetch(path, {
    ...options,
    headers,
    body: options.body && typeof options.body !== "string" ? JSON.stringify(options.body) : options.body
  });

  return response.json();
}

function withQuery(path, params) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });
  return `${path}?${searchParams.toString()}`;
}

export const authApi = {
  me: () => request("/api/auth/me"),
  login: (payload) => request("/api/auth/login", { method: "POST", body: payload }),
  signup: (payload) => request("/api/auth/signup", { method: "POST", body: payload }),
  oauth: (payload) => request("/api/auth/oauth", { method: "POST", body: payload }),
  logout: () => request("/api/auth/logout", { method: "POST" })
};

export const historyApi = {
  list: () => request("/api/history"),
  clear: () => request("/api/history", { method: "DELETE" }),
  delete: (id) => request(`/api/history/${id}`, { method: "DELETE" })
};

export const favoritesApi = {
  list: () => request("/api/favorites"),
  save: (payload) => request("/api/favorites", { method: "POST", body: payload }),
  delete: (id) => request(`/api/favorites/${id}`, { method: "DELETE" })
};

export const searchApi = {
  images: (params) => request(withQuery("/api/search", params))
};

export const adminApi = {
  stats: () => request("/api/admin/stats")
};

export async function getDashboardData() {
  const [me, historyData, favoriteData] = await Promise.all([authApi.me(), historyApi.list(), favoritesApi.list()]);
  return { me, historyData, favoriteData };
}
