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
    const errors = response?.data;

    if (response?.status === 401) {
      //TODO Não autorizado, redirecionar para tela de login
    }

    const [firstKey] = Object.keys(errors || {});
    const firstError = errors?.[firstKey];

    const code = firstError?.codigo ?? 0;
    const message = firstError?.mensagem ?? 'Um erro inesperado ocorreu, por favor tente mais tarde';
    console.log(firstError?.mensagem);

    return Promise.reject(new ApiError(code, message));
  }
);

export default axiosInstance;
