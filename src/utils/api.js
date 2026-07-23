const API_BASE_URL = import.meta.env.DEV
  ? 'http://localhost:5000'
  : '';

// Helper for fetch options
const getFetchOptions = (method, body = null, isMultipart = false) => {
  const options = {
    method,
    credentials: 'include' // Sends cookies for authenticated sessions
  };

  if (body) {
    if (isMultipart) {
      options.body = body; // Multer takes raw FormData
    } else {
      options.headers = {
        'Content-Type': 'application/json'
      };
      options.body = JSON.stringify(body);
    }
  }

  return options;
};

export const api = {
  get: async (endpoint) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, getFetchOptions('GET'));
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP error! status: ${res.status}`);
    }
    return res.json();
  },

  post: async (endpoint, body, isMultipart = false) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, getFetchOptions('POST', body, isMultipart));
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP error! status: ${res.status}`);
    }
    return res.json();
  },

  put: async (endpoint, body, isMultipart = false) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, getFetchOptions('PUT', body, isMultipart));
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP error! status: ${res.status}`);
    }
    return res.json();
  },

  delete: async (endpoint, body = null) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, getFetchOptions('DELETE', body));
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP error! status: ${res.status}`);
    }
    return res.json();
  }
};
