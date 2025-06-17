import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { ApiError } from "../../core/errors/api-error";

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8081',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
});

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {

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
  (response: AxiosResponse) => response,
  (error) => {

    const response = error.response;
    const errors = response?.data;

    if (response?.status === 401) {
      //TODO Não autorizado, redirecionar para tela de login
    }

    const [firstKey] = Object.keys(errors || {});
    const firstError = errors?.[firstKey];

    const code = firstError[0].codigo ?? 0;
    const message = firstError[0].mensagem ?? 'Um erro inesperado ocorreu, por favor tente mais tarde';
    console.log(firstError?.mensagem);

    return Promise.reject(new ApiError(code, message));
  }
);

export default axiosInstance;
