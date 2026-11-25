import { HttpErrorResponse } from '@angular/common/http';
import { extractErrorMessage } from './error-handler.util';

describe('extractErrorMessage', () => {
  it('should return fallback message for null/undefined/empty input', () => {
    expect(extractErrorMessage(null).message).toBe('Ocorreu um erro inesperado.');
    expect(extractErrorMessage(undefined, 'Erro padrão').message).toBe('Erro padrão');
  });

  it('should return direct string when input is a string', () => {
    expect(extractErrorMessage('Erro de validação').message).toBe('Erro de validação');
  });

  it('should handle standard Error instance', () => {
    const err = new Error('Falha no cliente');
    expect(extractErrorMessage(err).message).toBe('Falha no cliente');
  });

  it('should handle HttpErrorResponse status 0 (offline/network failure)', () => {
    const httpErr = new HttpErrorResponse({ status: 0, statusText: 'Unknown Error' });
    const res = extractErrorMessage(httpErr);
    expect(res.status).toBe(0);
    expect(res.message).toContain('Não foi possível conectar ao servidor');
  });

  it('should parse backend JSON payload with message and validation details', () => {
    const httpErr = new HttpErrorResponse({
      status: 400,
      statusText: 'Bad Request',
      error: {
        message: 'Dados inválidos no formulário',
        errors: ['Nome é obrigatório', 'Código de barras já cadastrado']
      }
    });

    const res = extractErrorMessage(httpErr);
    expect(res.status).toBe(400);
    expect(res.message).toBe('Dados inválidos no formulário');
    expect(res.details).toEqual(['Nome é obrigatório', 'Código de barras já cadastrado']);
  });

  it('should parse backend JSON payload with field errors map', () => {
    const httpErr = new HttpErrorResponse({
      status: 422,
      error: {
        error: 'Erro de validação',
        errors: {
          name: ['O nome deve ter pelo menos 2 caracteres'],
          quantity: ['Quantidade deve ser positiva']
        }
      }
    });

    const res = extractErrorMessage(httpErr);
    expect(res.message).toBe('Erro de validação');
    expect(res.details).toContain('name: O nome deve ter pelo menos 2 caracteres');
    expect(res.details).toContain('quantity: Quantidade deve ser positiva');
  });

  it('should handle backend string error inside HttpErrorResponse', () => {
    const httpErr = new HttpErrorResponse({
      status: 400,
      error: 'Estoque insuficiente para efetuar a saída.'
    });

    const res = extractErrorMessage(httpErr);
    expect(res.message).toBe('Estoque insuficiente para efetuar a saída.');
    expect(res.status).toBe(400);
  });
});
