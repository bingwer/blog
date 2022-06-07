import { ResponseType } from '@libs/server/withHandler';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useSWR, { KeyedMutator } from 'swr';

type UserReturnType = {
  user: ResponseType | undefined;
  error: any;
  mutate: KeyedMutator<ResponseType>;
};

const publicPath = ['login'];
const privatePath = ['write'];

function useUser(): UserReturnType {
  const router = useRouter();
  const { data, error, mutate } = useSWR<ResponseType>('/api/auth/check');

  useEffect(() => {
    const isUserInPublicPath = publicPath.find(path =>
      router.pathname.includes(path),
    );

    const isUserInPrivatePath = privatePath.find(path =>
      router.pathname.includes(path),
    );

    if (isUserInPublicPath && data && data.ok) {
      router.replace('/');
      return;
    }

    if (isUserInPrivatePath && data && !data.ok) {
      router.replace('/login');
    }
  }, [router, data]);

  return { user: data, error, mutate };
}

export default useUser;
