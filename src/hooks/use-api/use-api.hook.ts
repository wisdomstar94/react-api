import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IUseApi } from "./use-api.interface";

export function useApi<T>(props: IUseApi.Props<T>) {
  const {
    api,
    autoFetchDependencies,
  } = props;
  const enabled = useMemo(() => props.enabled ?? true, [props.enabled]);
  const enabledAutoFetch = useMemo(() => props.enabledAutoFetch ?? true, [props.enabledAutoFetch]);

  const isLoadingRef = useRef(false);
  const [isFetched, setIsFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<any>();
  const [data, setData] = useState<T>();

  const apis = useRef<IUseApi.Api<T>>(api());

  const fetch = useCallback((options?: IUseApi.FetchOptions) => {
    if (isLoadingRef.current) return;
    if (!enabled) return;

    apis.current = api();
    isLoadingRef.current = true;
    setIsLoading(true);
    setIsComplete(false);

    const retryCount = options?.retryCount ?? 0;
    let retriedCount = 0;

    const call = () => {
      apis.current.fn().then((result) => {
        // setApiResults(prev => prev.concat(true));
        setData(result);
        
        if (isFetched === false) setIsFetched(true);
        isLoadingRef.current = false;
        setIsLoading(false);
        setIsComplete(true);
        setIsSuccess(true);
      }).catch((error) => {
        if (retriedCount < retryCount) {
          retriedCount++;
          call();
          return;
        }
        // setApiResults(prev => prev.concat(false));
        setError(error);
        isLoadingRef.current = false;
        setIsLoading(false);
        setIsComplete(true);
        setIsSuccess(false);
      });
    };
    call();
  }, [api, enabled, isFetched]);

  const cancel = useCallback(() => {
    if (typeof apis.current.cancel === 'function') {
      apis.current.cancel();
    }
  }, []);

  useEffect(() => {
    if (enabledAutoFetch) fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, autoFetchDependencies ?? []);

  return {
    isFetched,
    isLoading,
    isComplete,
    error,
    data,
    fetch,
    isSuccess,
    cancel,
  };
}