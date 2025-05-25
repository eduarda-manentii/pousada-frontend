import { FiltroConfig } from './../interfaces/filtro-config';
import { Injectable } from '@angular/core';
import axiosInstance from '../config/axios-config';
import { ApiError } from '../../core/errors/api-error';
import { AxiosHeaders } from 'axios';
import { FiltroConfigValue } from '../interfaces/filtro-config';

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

  async saveImage(endpoint: string, object: FormData): Promise<any> {
    try {
      const response = await axiosInstance.post(endpoint, object, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
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
    filtros: FiltroConfigValue[]
  ): Promise<Page<T>> {

    try {
      const searchParts: string[] = [];

      console.log("Filtros abomba:");
      console.log(filtros);
      for (const filtro of filtros) {
        const { type, key, keys, value } = filtro;

        if (type === 'range' && keys && keys.length === 2 && value) {
          try {
            const parsed = JSON.parse(value);
            const { de, ate } = parsed;

            if (de) searchParts.push(`${keys[0]}>=${de}`);

            if (ate) searchParts.push(`${keys[1]}<=${ate}`)
          } catch (e) {
            console.warn('Erro ao processar filtro de range:', filtro);
          }
        } else if (key && value !== null && value !== '') {
          if (type === 'text') {
            searchParts.push(`${key}=='${value}*'`)
          } else if (type === 'boolean') {
            searchParts.push(`${key}==${value}`);
          } else {
            searchParts.push(`${key}==${value}`);
          }
        }

        console.log("Filtros aplicados:");
        console.log(searchParts);
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
