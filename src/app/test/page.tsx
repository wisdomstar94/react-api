"use client"

import { useApi } from "@/hooks/use-api/use-api.hook";
import axios from "axios";
import { useEffect } from "react";

const url = `https://cat-fact.herokuapp.com/facts/`;
const data = {
  'a': 'b',
};

export default function Page() {
  const api = useApi({
    api: () => {
      return {
        fn: () => axios({ url: url, method: 'get', params: data }).then(res => res.data),
      };
    },
    enabledAutoFetch: true,
  });

  useEffect(() => {
    console.log('@@@@@@@@ api.isComplete', api.isComplete);
    console.log('@@@@@@@@ api.data', api.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api.isComplete]);

  return (
    <>
      console 창과 network 창을 확인해주세요.
    </>
  );
}
