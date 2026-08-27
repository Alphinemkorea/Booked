import { apiClient } from './apiClient.js';

export const apiHandler = {
  get: (path) => apiClient(path),
  post: (path, body) => apiClient(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => apiClient(path, { method: 'PUT', body: JSON.stringify(body) }),
  del: (path) => apiClient(path, { method: 'DELETE' }),
};
