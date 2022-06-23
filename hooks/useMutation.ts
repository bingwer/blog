import { useState } from 'react';
import axiosClient from '@libs/client/axiosClient';
import { AxiosError } from 'axios';

interface UseMutationState<T> {
  loading: boolean;
  data?: T;
  error?: any | AxiosError;
}

type useMutationResult<T> = [(data: any) => void, UseMutationState<T>];

function useMutation<T = any>(
  url: string,
  flag: 'POST' | 'PUT' | 'PATCH',
): useMutationResult<T> {
  const [result, setResult] = useState<UseMutationState<T>>({
    loading: false,
    data: undefined,
    error: undefined,
  });

  async function mutation(data: any) {
    setResult(prevResult => ({ ...prevResult, loading: true }));

    const method = flag.toLowerCase() as 'post' | 'put' | 'patch';

    try {
      const { data: resData } = await axiosClient[method](url, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setResult(prevResult => ({ ...prevResult, data: resData }));
    } catch (e: any | AxiosError) {
      setResult(prevResult => ({ ...prevResult, error: e }));
    } finally {
      setResult(prevResult => ({ ...prevResult, loading: false }));
    }
  }

  return [mutation, result];
}

export default useMutation;
