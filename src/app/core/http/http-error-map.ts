import { HttpContextToken } from '@angular/common/http';

export const SKIP_ERROR_TOAST = new HttpContextToken<boolean>(() => false);

export interface ErrorMapConfig {
  title?: string;
  defaultMessage: string;
  statusMessages?: Record<number, string>;
}

export const HTTP_ERROR_MAP: Record<string, ErrorMapConfig> = {
  '/api/auth/login': {
    title: 'Falha na Autenticação',
    defaultMessage: 'Não foi possível autenticar.',
    statusMessages: {
      401: 'E-mail ou senha incorretos.',
      403: 'Acesso bloqueado ou inativo.',
      429: 'Muitas tentativas. Aguarde alguns minutos.'
    }
  },
  '/api/auth/register': {
    title: 'Erro no Cadastro',
    defaultMessage: 'Não foi possível cadastrar a conta.',
    statusMessages: {
      409: 'Já existe uma conta registrada com este e-mail.'
    }
  },
  '/api/inventory': {
    title: 'Inventário de Joias',
    defaultMessage: 'Erro na operação de inventário.',
    statusMessages: {
      404: 'Joia não encontrada no estoque.',
      409: 'Já existe uma joia cadastrada com este código/SKU.',
      400: 'Dados inválidos fornecidos para o inventário.'
    }
  }
};

export function resolveHttpErrorMessage(url: string, status: number, serverMessage?: any): { title: string; message: string } {
  if (status === 0) {
    return {
      title: 'Sem Conexão',
      message: 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.'
    };
  }

  if (status >= 500) {
    return {
      title: 'Serviço Indisponível',
      message: 'Ocorreu um erro interno no servidor. Tente novamente em instantes.'
    };
  }

  const matchedRoute = Object.keys(HTTP_ERROR_MAP).find((endpoint) => url.includes(endpoint));
  const config = matchedRoute ? HTTP_ERROR_MAP[matchedRoute] : undefined;

  let message = '';

  if (typeof serverMessage === 'string' && serverMessage.trim().length > 0) {
    message = serverMessage;
  } else if (Array.isArray(serverMessage) && serverMessage.length > 0) {
    message = serverMessage.join(', ');
  } else if (config?.statusMessages && config.statusMessages[status]) {
    message = config.statusMessages[status];
  } else if (config) {
    message = config.defaultMessage;
  } else {
    switch (status) {
      case 400:
        message = 'Requisição inválida. Verifique os dados enviados.';
        break;
      case 401:
        message = 'Sessão expirada. Faça login novamente.';
        break;
      case 403:
        message = 'Você não tem permissão para realizar esta operação.';
        break;
      case 404:
        message = 'Recurso não encontrado.';
        break;
      case 409:
        message = 'Conflito de dados no servidor.';
        break;
      default:
        message = 'Ocorreu um erro inesperado ao processar sua solicitação.';
    }
  }

  return {
    title: config?.title || 'Erro na Operação',
    message
  };
}
