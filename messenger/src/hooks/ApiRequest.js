import axios from 'axios';

export const API_BASE_URL = 'http://localhost:5144';

export const apiRequest = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    body = null,
    headers = {},
    authenticated = false
  } = options;

  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    method,
    url,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };

  if (authenticated) {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('Запрос требует аутентификации, но токен не найден');
      throw new ApiError(401, 'Требуется аутентификация');
    }
  }

  if (body && method !== 'GET' && method !== 'HEAD') {
    config.data = body;
  }

  try {
    const response = await axios(config);

    if (response.status === 204 || response.headers['content-length'] === '0') {
      return null;
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      console.error(`Ошибка API ${status}: ${data.message || 'Request failed'}`);
      throw new ApiError(status, data.message || 'Request failed');
    } else {
      console.error('Ошибка сети:', error);
      throw new ApiError(0, 'Ошибка сети');
    }
  }
};

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = 'Ошибка API';
  }
}