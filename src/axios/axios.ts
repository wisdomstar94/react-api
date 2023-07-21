import axios, { AxiosError, Canceler } from "axios";
import { useCallback } from "react";
import { IAxios } from "./axios.interface";

const BASE_URL: string | undefined = undefined;

export function useAxios() {
  const getAxiosInstance = useCallback((params?: IAxios.GetAxiosInstanceProps) => {
    return _getAxiosInstance({
      options: params?.options,
      requestBefore(config) {
        let _config = config;
        if (typeof params?.requestBefore === 'function') {
          _config = params?.requestBefore(config);
        }
        return _config;
      },
      requestError(error) {
        console.error('request-error', error);
        if (typeof params?.requestError === 'function') {
          params?.requestError(error);
        }
      },
      responseBefore(response) {
        let _response = response;
        if (typeof params?.responseBefore === 'function') {
          _response = params?.responseBefore(response);
        }
        return _response;
      },
      responseError(error) {
        console.error('response-error', error);
        if (typeof params?.responseError === 'function') {
          params?.responseError(error);
        }
      },
    });
  }, []);

  return {
    getAxiosInstance,
  };
}

export function getAxiosInstance(params?: IAxios.GetAxiosInstanceProps) {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const instance = axios.create({
    timeout: 3000,
    baseURL: BASE_URL,
    ...(params?.options ?? {}),
    cancelToken: source.token,
  });

  instance.interceptors.request.use(
    (config) => {
      // 요청을 보내기 전 설정 값을 처리하는 로직을 작성합니다. (jwt 헤더 삽입 및 jwt 갱신 등)
      let _config = config;
      if (typeof params?.requestBefore === 'function') {
        _config = params?.requestBefore(config);
      }
      return _config;
    }, 
    (error) => {
      // 요청 에러 처리에 대한 로직을 작성합니다.
      if (typeof params?.requestError === 'function') {
        params?.requestError(error);
      }
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      // 응답을 처리하는 로직을 작성합니다. (jwt 갱신 등)
      let _response = response;
      if (typeof params?.responseBefore === 'function') {
        _response = params?.responseBefore(response);
      }
      return _response;
    },
    (error: AxiosError<unknown, any>) => {
      // 응답 에러 처리에 대한 로직을 작성합니다. (jwt 갱신 및 전역 에러 팝업 표시 등)
      if (typeof params?.responseError === 'function') {
        params?.responseError(error);
      }
      return Promise.reject(error);
    }
  );

  return {
    instance,
    cancel: source.cancel,
  };
}

const _getAxiosInstance = getAxiosInstance;

export class AxiosTunning<T> {
  options: IAxios.AxiosTunningOptions<T>;
  cancel?: Canceler;
  retryedCount: number = 0;

  constructor(options: IAxios.AxiosTunningOptions<T>) {
    this.options = options;
    this.fetch();
  }

  fetch() {
    const call = () => {
      const { instance, cancel } = this.options.axiosInstance();
      this.cancel = cancel;
      this.options.apiFn(instance).then(result => {
        this.options.onSuccess(result);
      }).catch(error => {
        if (this.options.retryCount !== undefined) {
          if (this.retryedCount < this.options.retryCount) {
            call();
          } else {
            this.options.onError(error);
          }
          this.retryedCount++;
        } else {
          this.options.onError(error);    
        }
      });
    };
    call();
  }
}
