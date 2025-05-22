import axios from "axios";
import { ApiError } from "../../core/errors/api-error";

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8081',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
});

axiosInstance.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {

    const response = error.response;
    const data = response?.data;

    if (response?.status === 401) {
      //TODO Não autorizado, redirecionar para tela de login
    }

    const code = data?.errors?.codigo ?? response?.status ?? 0;
    const message = data?.errors?.mensagem ?? 'Um erro inesperado ocorreu, por favor tente mais tarde';

    return Promise.reject(new ApiError(code, message));
  }
);

export default axiosInstance;
