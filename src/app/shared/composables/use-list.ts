// shared/hooks/use-list.ts (ou "shared/composables/use-list.ts")
import { inject, signal } from '@angular/core';
import { ApiService } from '../services/backend-api.service';

export function useList<T>(endpoint: string, sortFn: (a: T, b: T) => number = () => 0) {
  const api = inject(ApiService);

  const items = signal<T[]>([]);
  const currentPage = signal(0);
  const totalPages = signal(0);
  const pageSize = 15;

  async function loadPage(page: number) {
    const params = { page: page.toString(), size: pageSize.toString() };
    const data = await api.get<T>(endpoint, params);
    items.set(data.content.sort(sortFn));
    currentPage.set(data.number);
    totalPages.set(data.totalPages);
  }

  async function applyFilters(filtros: any) {
    const data = await api.getWithFilters<T>(endpoint, 0, pageSize, 'id,asc', filtros);
    items.set(data.content.sort(sortFn));
    currentPage.set(data.number);
    totalPages.set(data.totalPages);
  }

  function nextPage() {
    if (currentPage() + 1 < totalPages()) loadPage(currentPage() + 1);
  }

  function previousPage() {
    if (currentPage() > 0) loadPage(currentPage() - 1);
  }

  return {
    items,
    currentPage,
    totalPages,
    loadPage,
    applyFilters,
    nextPage,
    previousPage,
  };
}
