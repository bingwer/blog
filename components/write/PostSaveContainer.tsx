import useDarkMode from '@hooks/useDarkMode';
import PortalWrap from '@libs/client/PortalWrap';
import { cls } from '@libs/util';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import React from 'react';

interface PostSaveContainerProps {
  nextStep: boolean;
  setNextStep: React.Dispatch<React.SetStateAction<boolean>>;
  thumbnailPath: string | undefined;
}

function PostSaveContainer(props: PostSaveContainerProps) {
  const [darkMode] = useDarkMode();
  const { nextStep, setNextStep, thumbnailPath } = props;

  return (
    <PortalWrap wrapperId="writeconfirm">
      <div
        className={cls(
          'absolute top-0 w-full overflow-y-scroll transition-[height]',
          darkMode ? 'dark' : 'light',
          nextStep ? 'z-[100] h-auto' : 'z-[99] h-0',
        )}
      >
        <div className="flex min-h-screen w-full items-center justify-center bg-l-backgroundColor px-12 text-text-dark dark:bg-d-backgroundColor dark:text-text-white">
          <div className="grid grid-cols-1 space-y-6 md:grid-cols-2 md:space-y-0">
            <section className="h-96 w-96 border-l-mainColor px-6 dark:border-d-mainColor md:border-r-2">
              <div className="flex h-full w-full flex-col justify-between">
                <p className="text-xl">포스트 미리보기</p>
                {thumbnailPath ? (
                  <div className="h-48 w-full">
                    <Image
                      src={thumbnailPath}
                      width={380}
                      height={192}
                      quality={100}
                    />
                  </div>
                ) : (
                  <div className="flex h-48 w-full flex-col items-center justify-center space-y-3 bg-slate-200 dark:bg-slate-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <label
                      htmlFor="thumbnail"
                      className="flex h-9 w-32 items-center justify-center rounded-md bg-d-mainColor text-center text-sm"
                    >
                      썸네일 업로드
                    </label>
                    <input
                      type="file"
                      id="thumbnail"
                      className="invisible h-0 w-0"
                    />
                  </div>
                )}
                <textarea
                  className="h-28 w-full resize-none bg-white p-3 text-sm text-text-dark focus:outline-none dark:bg-black dark:text-text-white"
                  placeholder="포스트 요약을 입력하세요"
                />
                <div className="flex w-full justify-end">
                  <p className="text-sm">0 / 150</p>
                </div>
              </div>
            </section>
            <section className="flex h-96 w-96 flex-col justify-between px-6">
              <div className="flex h-[17rem] w-full flex-col justify-between">
                <div>
                  <p className="mb-3 text-xl">공개 설정</p>
                  <div className="flex w-full justify-between">
                    <button
                      type="button"
                      className="flex h-12 w-40 items-center justify-center space-x-4 rounded-md bg-d-mainColor text-sm text-text-white"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>공개</span>
                    </button>
                    <button
                      type="button"
                      className="flex h-12 w-40 items-center justify-center space-x-4 rounded-md bg-d-mainColor text-sm text-text-white"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      <span>비공개</span>
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <p className="mb-3 text-xl">URL 설정</p>
                  <input
                    type="text"
                    className="h-10 w-full bg-white pb-1 pl-[7.6rem] pr-3 text-text-dark focus:outline-none dark:bg-black dark:text-text-white"
                  />
                  <span className="absolute left-3 top-[2.9rem]">
                    @/polarscript/
                  </span>
                </div>
                <div>
                  <p className="mb-3 text-xl">모음집 설정</p>
                  <div className="w-full">
                    <button
                      type="button"
                      className="flex h-12  w-full items-center justify-center space-x-4 rounded-md bg-d-mainColor text-sm text-text-white"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      <span>모음집에 추가하기</span>
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex w-full justify-between">
                  <button
                    type="button"
                    className="flex h-12 w-40 items-center justify-center space-x-4 rounded-md bg-d-mainColor text-sm text-text-white"
                    onClick={() => setNextStep(false)}
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    className="flex h-12 w-40 items-center justify-center space-x-4 rounded-md bg-d-mainColor text-sm text-text-white"
                  >
                    출간하기
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </PortalWrap>
  );
}

export default PostSaveContainer;
