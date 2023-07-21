export declare namespace IUseApi {
  export type RequestDataType = 'body' | 'query-string';

  export interface Api<T = unknown> {
    /**
     - fetch 함수가 호출 될 때 해당 함수가 호출됩니다.
     - 해당 함수가 완료되기 전에 (응답 받기 전에) fetch 함수가 다시 여러번 호출 되더라도 해당 함수는 호출되지 않습니다. (중복 요청 차단)
     */
    fn: () => Promise<T>;
    /**
     * api 가 호출 중일 때 해당 함수를 호출하여 api 호출을 취소할 수 있는 함수를 전달 받는 프로퍼티입니다.
     * 취소 로직은 호출하는 곳에서 직접 구현해야 합니다.
     */
    cancel?: () => void;
  }

  export interface Props<T = unknown> {
    /**
     - true : fetch 가 호출 되었을 경우 정상적으로 동작합니다.
     - false : fetch 가 호출 되었을 경우 진행을 차단합니다. (API 호출 차단) 
     */
    enabled?: boolean;
    /**
     autoFetchDependencies 인자에 존재하는 값에 변동이 있을 때마다 fetch 함수를 자동으로 호출하도록 할 것인지에 대한 여부입니다.
     */
    enabledAutoFetch?: boolean;
    /**
     이 인자에 넘겨진 값들에 변동이 있을 때마다 fetch 함수를 자동으로 호출합니다.
     */
    autoFetchDependencies?: unknown[];
    api: () => Api<T>;
  }

  export type FetchOptions = {
    retryCount?: number;
  };
}