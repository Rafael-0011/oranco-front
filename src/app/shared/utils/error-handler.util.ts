import { HttpErrorResponse } from '@angular/common/http';

export interface ExtractedError {
  message: string;
  status?: number;
  statusText?: string;
  details?: string[];
  timestamp?: string;
}

/**
 * Extrai uma mensagem amigável e detalhes a partir de respostas de erro da API ou mensagens genéricas.
 */
export function extractErrorMessage(error: unknown, fallback = 'Ocorreu um erro inesperado.'): ExtractedError {
  if (!error) {
    return { message: fallback };
  }

  // String direta
  if (typeof error === 'string') {
    return { message: error || fallback };
  }

  // HttpErrorResponse do Angular
  if (error instanceof HttpErrorResponse) {
    const status = error.status;
    const statusText = error.statusText;

    // Erro de rede ou servidor fora do ar
    if (status === 0) {
      return {
        message: 'Não foi possível conectar ao servidor. Verifique sua conexão ou se o serviço está ativo.',
        status: 0,
        statusText: 'Sem Conexão'
      };
    }

    const payload = error.error;

    // Se o payload do backend for uma string direta
    if (typeof payload === 'string' && payload.trim().length > 0) {
      // Tentar interpretar se for JSON em string
      try {
        const parsed = JSON.parse(payload);
        return parseBackendPayload(parsed, status, statusText, fallback);
      } catch {
        return { message: payload, status, statusText };
      }
    }

    // Se o payload for objeto
    if (payload && typeof payload === 'object') {
      return parseBackendPayload(payload, status, statusText, fallback);
    }

    // Mensagens padrões por status HTTP caso o backend não tenha corpo de erro
    if (status === 400) return { message: 'Requisição inválida. Verifique os dados informados.', status, statusText };
    if (status === 401) return { message: 'Sessão expirada ou não autorizada.', status, statusText };
    if (status === 403) return { message: 'Você não tem permissão para realizar esta operação.', status, statusText };
    if (status === 404) return { message: 'Registro não encontrado no servidor.', status, statusText };
    if (status === 409) return { message: 'Conflito de dados no servidor.', status, statusText };
    if (status >= 500) return { message: 'Erro interno no servidor. Tente novamente mais tarde.', status, statusText };

    return { message: error.message || fallback, status, statusText };
  }

  // Error padrão do JavaScript
  if (error instanceof Error) {
    return { message: error.message || fallback };
  }

  // Objeto genérico
  if (typeof error === 'object' && error !== null) {
    return parseBackendPayload(error as Record<string, unknown>, undefined, undefined, fallback);
  }

  return { message: fallback };
}

function parseBackendPayload(
  payload: Record<string, any>,
  status?: number,
  statusText?: string,
  fallback = 'Ocorreu um erro inesperado.'
): ExtractedError {
  // Campos comuns em APIs Spring Boot / Quarkus / Express / FastAPI / .NET
  const message =
    payload['message'] ||
    payload['error'] ||
    payload['detail'] ||
    payload['title'] ||
    payload['msg'] ||
    fallback;

  const details: string[] = [];

  // Se houver lista de validações (ex: validationErrors, errors, violations)
  const validationList = payload['errors'] || payload['violations'] || payload['details'];
  if (Array.isArray(validationList)) {
    for (const item of validationList) {
      if (typeof item === 'string') {
        details.push(item);
      } else if (item && typeof item === 'object') {
        const field = item.field || item.property || item.path || '';
        const msg = item.message || item.defaultMessage || item.error || JSON.stringify(item);
        details.push(field ? `${field}: ${msg}` : msg);
      }
    }
  } else if (typeof payload['errors'] === 'object' && payload['errors'] !== null) {
    // Map de chave-valor (ex: { name: ["obrigatório"], barcode: ["já cadastrado"] })
    for (const [key, val] of Object.entries(payload['errors'])) {
      if (Array.isArray(val)) {
        details.push(`${key}: ${val.join(', ')}`);
      } else {
        details.push(`${key}: ${String(val)}`);
      }
    }
  }

  return {
    message: typeof message === 'string' ? message : fallback,
    status: typeof payload['status'] === 'number' ? payload['status'] : status,
    statusText,
    details: details.length > 0 ? details : undefined,
    timestamp: typeof payload['timestamp'] === 'string' ? payload['timestamp'] : undefined
  };
}
