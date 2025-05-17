import { Injectable } from '@angular/core';
import axiosInstance from '../config/axios-config';
import { ApiError } from '../../core/errors/api-error';

interface Page<T> {
  content: T[];
  number: number;
  totalPages: number;
  totalElements: number;
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() {}

  async create(endpoint: string, object: any): Promise<any> {
    try {
      const response = await axiosInstance.post(endpoint, object);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async get<T>(endpoint: string, params: any = {}): Promise<Page<T>> {
    try {
      const response = await axiosInstance.get<Page<T>>(endpoint, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async put(endpoint: string, object: any): Promise<any> {
    try {
      const response = await axiosInstance.put(endpoint, object);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete(endpoint: string): Promise<any> {
    try {
      const response = await axiosInstance.delete(endpoint);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getById<T>(endpoint: string): Promise<T> {
    try {
      const response = await axiosInstance.get<T>(endpoint);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getWithFilters<T>(
    endpoint: string,
    page: number,
    size: number,
    sort: string,
    filtros: { [key: string]: any }
  ): Promise<Page<T>> {

    try {
      const searchParts: string[] = [];

      for (const key in filtros) {
        const value = filtros[key];
        if (value != null && value !== '') {
          searchParts.push(`${key}=='${value}*'`);
        }
      }

      const params: any = {
        page: page.toString(),
        size: size.toString(),
        sort
      };

      if (searchParts.length > 0) {
        params.search = `(${searchParts.join(';')})`;
      }

      const response = await axiosInstance.get<Page<T>>(endpoint, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error: any): string {
    if (error instanceof ApiError) {
      return error.mensagem;
    }

    return 'Erro inesperado ao processar a requisição';
  }

}
