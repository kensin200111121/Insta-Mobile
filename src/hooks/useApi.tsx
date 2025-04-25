import axios from 'axios';
import { useAuthContext } from '../contexts/auth.context';
import type { AxiosRequestConfig, Method } from 'axios';
import ENVIRONMENT from '../environment';

const useApi = () => {
    const { storeToken, userToken, openTokenOverlay } = useAuthContext();
    
  // const prefix = '/api'
  const prefix = `${ENVIRONMENT.SERVER_DOMAIN}app`;
  
  const api = axios.create({
    baseURL: prefix,
  });

  const request = (
    method: Lowercase<Method>,
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): MyResponse<any> => {
    if (method === 'post') {
      return api.post(url, data, config);
    } else {
      return api.get(url, {
        params: data,
        ...config,
      });
    }
  };

  // Request interceptor
  api.interceptors.request.use(
    config => {
        if (storeToken || userToken) {
            config.headers.Authorization = `${userToken || storeToken}`;
          }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    config => {
      if (config?.data?.message) {
        // $message.success(config.data.message)
      }
  
      return config?.data;
    },
    error => {

      if (error?.response?.status === 401) {
        openTokenOverlay()
      }
      // if needs to navigate to login page when request exception
      // history.replace('/login');
      let errorMessage = 'API ERROR';
  
      if (error?.message?.includes('Network Error')) {
        errorMessage = 'Network Error! Please check your network connection.';
      } else {
        errorMessage = error?.message;
      }
  
      return {
        status: false,
        message: errorMessage,
        result: null,
      };
    },
  );
  
  return request;
};

export type Response<T = any> = {
    status: boolean;
    message: string;
    result: T;
};

export type MyResponse<T = any> = Promise<Response<T>>;


export default useApi;