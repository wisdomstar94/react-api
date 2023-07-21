import { AxiosError, AxiosInstance, AxiosResponse, Canceler, CreateAxiosDefaults, InternalAxiosRequestConfig, Method } from "axios";

export declare namespace IAxios {
  export interface GetAxiosInstanceProps {
    options?: CreateAxiosDefaults<any>;
    requestBefore?: (config: InternalAxiosRequestConfig<any>) => InternalAxiosRequestConfig<any>;
    requestError?: (error: any) => void;
    responseBefore?: (response: AxiosResponse<any, any>) => AxiosResponse<any, any>;
    responseError?: (error: AxiosError<unknown, any>) => void;
  }

  export interface AxiosTunningOptions<T> {
    axiosInstance: () => { instance: AxiosInstance; cancel: Canceler };
    apiFn: (axiosInstance: AxiosInstance) => Promise<T>;
    retryCount?: number;
    onSuccess: (result: T) => void;
    onError: (error: any) => void;
  }
}