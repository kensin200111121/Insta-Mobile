import type { AxiosRequestConfig, Method } from 'axios';
import axios from 'axios';
import ENVIRONMENT from '../environment';

// import { history } from '@/routes/history';

const axiosInstance = axios.create({
  timeout: 6000,
});

axiosInstance.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  config => {
    if (config?.data?.message) {
      // $message.success(config.data.message)
    }

    return config?.data;
  },
  error => {
    // if needs to navigate to login page when request exception
    // history.replace('/login');
    let errorMessage = 'Network Error';

    if (error?.message?.includes('Network Error')) {
      errorMessage = 'Network Error, Please make sure your network is connected correctly.';
    } else {
      try {
        errorMessage = error?.response?.data?.message || error?.message;
      } catch (err) {
        errorMessage = error?.message;
      }      
    }

    return {
      status: false,
      message: errorMessage,
      result: null,
    };
  },
);

export type Response<T = any> = {
  status: boolean;
  message: string;
  result: T;
};

export type MyResponse<T = any> = Promise<Response<T>>;

/**
 *
 * @param method - request methods
 * @param url - request url
 * @param data - request data or params
 */
export const request = <T = any>(
  method: Lowercase<Method>,
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): MyResponse<T> => {
  // const prefix = '/api'
  const prefix = `${ENVIRONMENT.SERVER_DOMAIN}app`;

  url = prefix + url;

  if (method === 'post') {
    return axiosInstance.post(url, data, config);
  } else {
    return axiosInstance.get(url, {
      params: data,
      ...config,
    });
  }
};
