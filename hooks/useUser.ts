import { ResponseType } from '@libs/server/withHandler';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';

const publicPath = ['login'];

function useUser() {
  const router = useRouter();
  const { data, error } = useSWR<ResponseType>('/api/auth/check');

  useEffect(() => {
    const isUserInPublicPath = publicPath.find(path =>
      router.pathname.includes(path),
    );

    if (isUserInPublicPath && data && data.ok) {
      router.replace('/');
      return;
    }

    if (data && !data.ok) {
      router.replace('/login');
    }
  }, [router, data]);

  return [data, error];
}

export default useUser;
