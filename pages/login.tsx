import useMutation from '@hooks/useMutation';
import useUser from '@hooks/useUser';
import { ResponseType } from '@libs/server/withHandler';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface LoginForm {
  userId: string;
  password: string;
}

function Login() {
  const router = useRouter();
  const [login, { data, loading, error: loginError }] =
    useMutation<ResponseType>('/api/auth/login');

  useUser();

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<LoginForm>();

  const doLogin = (formData: LoginForm) => {
    login(formData);
  };

  useEffect(() => {
    if (data && data.ok) router.replace('/');
  }, [data, router]);

  return (
    <main className="mx-auto flex h-full w-full max-w-xl items-center justify-center px-8 text-text-dark dark:text-text-white">
      <form
        className="flex h-full w-full flex-col justify-between space-y-5 rounded-xl border-2 border-l-mainColor py-24 px-8 text-text-dark dark:border-d-mainColor dark:text-text-white md:max-w-md"
        onSubmit={handleSubmit(doLogin)}
      >
        <div className="flex justify-between text-base">
          <span className="mr-3 w-20 text-right">아이디</span>
          <input
            type="text"
            className="w-full rounded-lg border-2 border-l-mainColor bg-transparent pl-2 focus:outline-none dark:border-d-mainColor"
            {...register('userId', { required: true })}
          />
        </div>
        <div className="flex justify-between text-base">
          <span className="mr-3 w-20 text-right">비밀번호</span>
          <input
            type="password"
            className="w-full rounded-lg border-2 border-l-mainColor bg-transparent pl-2 focus:outline-none dark:border-d-mainColor"
            {...register('password', { required: true })}
          />
        </div>
        <div className="text-center text-red-500">
          {formErrors.userId && !formErrors.password && (
            <p>아이디를 입력해주세요</p>
          )}
          {!formErrors.userId && formErrors.password && (
            <p>패스워드를 입력해주세요</p>
          )}
          {formErrors.userId && formErrors.password && (
            <p>아이디와 패스워드를 입력해주세요</p>
          )}
          {loginError && <p>아이디또는 패스워드를 확인해주세요</p>}
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-l-hoverColor text-lg text-text-white hover:bg-l-highlightColor"
        >
          {loading ? '로그인중...' : '로그인'}
        </button>
      </form>
    </main>
  );
}

export default Login;
