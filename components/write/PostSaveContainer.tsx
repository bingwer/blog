import React, { useEffect, useState } from 'react';
import useDarkMode from '@hooks/useDarkMode';
import PortalWrap from '@libs/client/PortalWrap';
import useSeries from '@hooks/write/useSeries';
import { cls } from '@libs/util';
import { Editor } from '@toast-ui/react-editor';
import removeMarkdown from 'markdown-to-text';
import Image from 'next/image';
import {
  UseFormGetValues,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { WriteFormType } from 'pages/write';
import AddSeriesContainer from './AddSeriesContainer';

interface PostSaveContainerProps {
  nextStep: boolean;
  setNextStep: React.Dispatch<React.SetStateAction<boolean>>;
  thumbnailPath: string | undefined;
  editorRef: React.MutableRefObject<Editor>;
  formAction: {
    getValues: UseFormGetValues<WriteFormType>;
    register: UseFormRegister<WriteFormType>;
    handleSubmit: UseFormHandleSubmit<WriteFormType>;
    setValue: UseFormSetValue<WriteFormType>;
    watch: UseFormWatch<WriteFormType>;
  };
  savePost: (FormData: WriteFormType) => Promise<void>;
}

// eslint-disable-next-line no-useless-escape
const regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;

function PostSaveContainer(props: PostSaveContainerProps) {
  const [darkMode] = useDarkMode();
  const {
    nextStep,
    setNextStep,
    editorRef,
    formAction: { register, getValues, handleSubmit, setValue, watch },
    thumbnailPath,
    savePost,
  } = props;
  const [isPrivate, setIsPrivate] = useState(false);
  const [openSeriesMenu, setOpenSeriesMenu] = useState(false);
  const [tempThumbnailPath, setTempThumbnailPath] = useState<string>();
  const series = useSeries();

  useEffect(() => {
    if (!nextStep) return;
    const defaultURL = getValues('title')
      ?.replace(regExp, '')
      ?.replaceAll(' ', '-');
    const defaultSummary =
      editorRef &&
      removeMarkdown(editorRef?.current?.getInstance()?.getHTML()).slice(
        0,
        150,
      );
    if (getValues('url') === '') setValue('url', defaultURL);
    if (getValues('summary') === '') setValue('summary', defaultSummary);
  }, [getValues, editorRef, setValue, nextStep]);

  useEffect(() => {
    if (!nextStep) return;
    if (thumbnailPath) setTempThumbnailPath(thumbnailPath);
  }, [nextStep, thumbnailPath]);

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
          <div className="flex flex-col items-center justify-center space-y-5 md:flex-row md:space-y-0 md:space-x-5">
            <section className="h-96 w-96 px-6">
              <div className="flex h-full w-full flex-col justify-between">
                <p className="text-xl">포스트 미리보기</p>
                {tempThumbnailPath ? (
                  <div className="relative h-48 w-full">
                    <Image
                      src={tempThumbnailPath}
                      width={1280}
                      height={720}
                      quality={100}
                      placeholder="blur"
                      blurDataURL={tempThumbnailPath}
                    />
                    <input
                      type="file"
                      id="thumbnail"
                      className="invisible h-0 w-0"
                    />
                    <label
                      htmlFor="thumbnail"
                      className="rounded-mdtext-center absolute -top-11 right-10 flex h-9 cursor-pointer items-center justify-center text-sm"
                    >
                      수정
                    </label>
                    <button
                      type="button"
                      className="absolute -top-11 right-0 flex h-9 cursor-pointer items-center justify-center rounded-md text-center text-sm"
                      onClick={() => setTempThumbnailPath(undefined)}
                    >
                      제거
                    </button>
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
                      className="flex h-9 w-32 items-center justify-center rounded-md bg-l-mainColor text-center text-sm text-text-white dark:bg-d-mainColor"
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
                  maxLength={150}
                  {...register('summary')}
                />
                <div className="flex w-full justify-end">
                  <p className="text-sm">{watch('summary')?.length} / 150</p>
                </div>
              </div>
            </section>
            <div className="h-1 w-[21rem] bg-l-mainColor dark:bg-d-mainColor md:h-96 md:w-1" />
            {openSeriesMenu ? (
              <AddSeriesContainer
                setOpenSeriesMenu={setOpenSeriesMenu}
                series={series}
              />
            ) : (
              <section className="flex h-96 w-96 flex-col justify-between px-6">
                <div className="flex h-[17rem] w-full flex-col justify-between">
                  <div>
                    <p className="mb-3 text-xl">공개 설정</p>
                    <div className="flex w-full justify-between">
                      <button
                        type="button"
                        className={cls(
                          'flex h-12 w-40 items-center justify-center space-x-4 rounded-md border-2 text-sm text-text-white',
                          isPrivate
                            ? 'border-slate-400 text-slate-400'
                            : 'border-0 bg-l-mainColor dark:bg-d-mainColor',
                        )}
                        onClick={() => setIsPrivate(false)}
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
                        className={cls(
                          'flex h-12 w-40 items-center justify-center space-x-4 rounded-md border-2 text-sm text-text-white',
                          isPrivate
                            ? 'border-0 bg-l-mainColor dark:bg-d-mainColor'
                            : 'border-slate-400 text-slate-400',
                        )}
                        onClick={() => setIsPrivate(true)}
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
                      className="h-10 w-full bg-white pb-1 pl-[3.55rem] pr-3 text-text-dark focus:outline-none dark:bg-black dark:text-text-white"
                      {...register('url')}
                    />
                    <span className="absolute left-3 top-[2.9rem]">/post/</span>
                  </div>
                  <div>
                    <p className="mb-1 text-xl">모음집 설정</p>
                    {series && series?.selectedSeries ? (
                      <div className="space-y-1">
                        <div className="flex w-full items-center justify-between ">
                          <span className="overflow-hidden text-ellipsis whitespace-nowrap pl-3">
                            {`선택된 모음집 : 
                          ${
                            series?.seriesList &&
                            series?.seriesList.find(
                              ({ id }) => id === series?.selectedSeries,
                            )?.name
                          }`}
                          </span>
                          <button
                            type="button"
                            className="text-l-mainColor"
                            onClick={() => setOpenSeriesMenu(true)}
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
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="flex justify-end text-sm text-red-500">
                          <button
                            type="button"
                            onClick={() =>
                              series &&
                              series.actions.setSelectedSeries(undefined)
                            }
                          >
                            모음집에서 제거
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full">
                        <button
                          type="button"
                          className="flex h-12  w-full items-center justify-center space-x-4 rounded-md bg-l-mainColor text-sm text-text-white dark:bg-d-mainColor"
                          onClick={() => setOpenSeriesMenu(true)}
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
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex w-full justify-between">
                    <button
                      type="button"
                      className="flex h-12 w-40 items-center justify-center space-x-4 rounded-md bg-l-mainColor text-sm text-text-white dark:bg-d-mainColor"
                      onClick={() => setNextStep(false)}
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      className="flex h-12 w-40 items-center justify-center space-x-4 rounded-md bg-l-mainColor text-sm text-text-white dark:bg-d-mainColor"
                      onClick={handleSubmit(savePost)}
                    >
                      출간하기
                    </button>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </PortalWrap>
  );
}

export default PostSaveContainer;
