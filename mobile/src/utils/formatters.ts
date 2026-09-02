import { isAxiosError } from 'axios';
import { API_BASE_URL } from '../services/api';

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function getApiErrorMessage(error: unknown) {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;

    if (typeof message === 'string') {
      return message;
    }

    if (error.code === 'ECONNABORTED') {
      return `A API demorou para responder em ${API_BASE_URL}.`;
    }

    if (!error.response) {
      return `Nao foi possivel conectar na API em ${API_BASE_URL}. Verifique se o backend esta rodando e se o celular esta na mesma rede.`;
    }
  }

  return 'Nao foi possivel concluir a operacao.';
}
